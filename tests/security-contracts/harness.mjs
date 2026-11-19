import { cities, createFixtureAuthority } from "./authority.mjs";
import { fingerprint, normalizeCommand, receiptScope, resourceKey, transition } from "./commands.mjs";
import { advanceProjection, copy, digest, emptySnapshot, head, projectionMessage, reconciles, timestamp } from "./ledger.mjs";

const denied = () => ({ ok: false, code: "denied" });
const failed = (code) => ({ ok: false, code });
const faults = ["before-state", "state", "audit", "receipt", "outbox", "after-commit"];

export function createHarness({ authority = createFixtureAuthority(), checkpoint } = {}) {
  if (checkpoint && !reconciles(checkpoint.snapshot, checkpoint.anchor)) throw new Error("Checkpoint reconciliation failed");
  let state = checkpoint ? copy(checkpoint.snapshot) : emptySnapshot();
  const pending = new WeakMap();
  let auditAvailable = true;

  const find = (command) => state.resources.find((record) => resourceKey(record) === resourceKey(command));

  function prepare(context, input) {
    const command = normalizeCommand(input);
    if (!command || !authority.authorized(context, command.city, command.action, find(command))) return denied();
    const plan = Object.freeze({});
    pending.set(plan, { context, command });
    return { ok: true, plan };
  }

  function commit(plan, fault) {
    if (fault !== undefined && !faults.includes(fault)) throw new Error("Unknown fixture fault");
    const prepared = pending.get(plan);
    if (!prepared) return denied();
    pending.delete(plan);
    const { command, context } = prepared;
    const current = find(command);
    const actor = authority.authorized(context, command.city, command.action, current);
    if (!actor) return denied();

    const scope = digest(receiptScope(actor, command));
    const signature = digest(fingerprint(actor, command));
    const prior = state.receipts.find((item) => item.scope === scope);
    if (prior) {
      return prior.fingerprint === signature
        ? { ok: true, replayed: true, receipt: copy(prior) }
        : failed("request_conflict");
    }
    if (command.expectedRevision !== current.revision) return failed("stale_revision");
    const record = transition(current, command, actor, authority);
    if (!record) return failed("illegal_transition");
    if (!auditAvailable) return failed("audit_unavailable");
    if (fault === "before-state") return failed("simulated_failure");

    const resources = state.resources.map((item) => item === current ? record : item);
    if (fault === "state") return failed("simulated_failure");
    const sequence = state.audit.length + 1;
    const body = {
      id: `event-${sequence}`, version: 1, at: timestamp(sequence), previous: head(state), city: record.city, resourceId: record.resourceId,
      actor, action: command.action, reason: command.action === "reject" ? command.data : null,
      revision: record.revision, stateDigest: digest(record), scope, fingerprint: signature,
    };
    const event = { ...body, hash: digest(body) };
    const audit = [...state.audit, event];
    if (fault === "audit") return failed("simulated_failure");
    const receipt = { scope, fingerprint: signature, eventId: event.id, at: event.at, record };
    const receipts = [...state.receipts, receipt];
    if (fault === "receipt") return failed("simulated_failure");
    const outbox = [...state.outbox, projectionMessage(record, event)];
    if (fault === "outbox") return failed("simulated_failure");

    state = { ...state, resources, audit, receipts, outbox };
    if (fault === "after-commit") return failed("response_lost");
    return { ok: true, replayed: false, receipt: copy(receipt) };
  }

  function execute(context, command, fault) {
    const prepared = prepare(context, command);
    return prepared.ok ? commit(prepared.plan, fault) : prepared;
  }

  return Object.freeze({
    authority, prepare, commit, execute,
    readAudit(context, city) {
      if (!authority.authorized(context, city, "read_audit")) return denied();
      const events = state.audit.filter((event) => event.city === city).map(
        ({ id, version, at, city, resourceId, actor, action, reason, revision }) => ({ id, version, at, city, resourceId, actor, action, reason, revision }),
      );
      return { ok: true, events };
    },
    visibleIn(city) {
      if (!cities.includes(city) || !auditAvailable) return [];
      return state.projection.filter((item) => {
        const current = find(item);
        return item.city === city && item.visible && current?.status === "published" && item.revision === current.revision;
      }).map(({ resourceId }) => resourceId);
    },
    deliver(message) {
      const result = advanceProjection(state, message);
      state = result.snapshot;
      return result.status;
    },
    setAuditAvailableForFixture(value) { auditAvailable = value === true; },
    checkpoint() { return { snapshot: copy(state), anchor: head(state) }; },
  });
}
