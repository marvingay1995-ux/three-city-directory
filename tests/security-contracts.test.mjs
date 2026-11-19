import assert from "node:assert/strict";
import test from "node:test";
import { createHarness } from "./security-contracts/harness.mjs";

const city = "dubai";
const id = (role) => `${city}-${role}`;
const roles = {
  submit: "owner", start_review: "moderator", approve: "moderator", reject: "moderator",
  verify: "verifier", publish: "administrator", transfer: "administrator", withdraw: "owner",
};
const command = (action, expectedRevision, options = {}) => ({
  version: 1, city, resourceId: "listing-one", action, expectedRevision, key: `${action.replaceAll("_", "-")}-${expectedRevision}`,
  payload: {}, ...options,
});
const context = (h, role) => h.authority.context(id(role));
const apply = (h, cmd, handle = context(h, roles[cmd.action]), fault) => h.execute(handle, cmd, fault);
function success(h, cmd, handle) {
  const result = apply(h, cmd, handle);
  assert.equal(result.ok, true, JSON.stringify(result));
  assert.equal(result.replayed, false);
  return result.receipt;
}
function refusal(h, cmd, code, handle = context(h, roles[cmd.action]), fault) {
  const before = h.checkpoint();
  assert.deepEqual(apply(h, cmd, handle, fault), { ok: false, code });
  assert.deepEqual(h.checkpoint(), before);
}
function seed(h, end = "publish") {
  for (const [revision, action] of ["submit", "start_review", "approve", "verify", "publish"].entries()) {
    const receipt = success(h, command(action, revision));
    if (action === end) return receipt.record;
  }
}

test("deny by default without leaking object existence, city or caller assertions", () => {
  const h = createHarness();
  const submit = command("submit", 0);
  for (const handle of [null, {}, Object.freeze({ actorRef: id("owner") }), context(h, "visitor"), context(h, "alternate"),
    context(h, "moderator"), h.authority.context("muscat-owner"), createHarness().authority.context(id("owner"))]) {
    refusal(h, submit, "denied", handle);
  }
  assert.equal(h.authority.context("unknown"), undefined);
  assert.deepEqual(h.execute(undefined, submit), { ok: false, code: "denied" });
  for (const changes of [{ city: "doha" }, { city: "unknown" }, { resourceId: "missing" },
    { actorRef: id("owner") }, { role: "owner" }, { version: 2 }, { action: "grant_role" },
    { expectedRevision: -1 }, { payload: { role: "administrator" } }]) {
    refusal(h, { ...submit, ...changes }, "denied", context(h, "owner"));
  }
  assert.deepEqual(h.commit({}), { ok: false, code: "denied" });
});

test("stale policy/grant/session, expired sessions and revoked principals deny without writes", () => {
  for (const change of [
    (a) => a.bumpPolicy(), (a) => a.setRole(id("owner"), "owner"), (a) => a.rotateSession(id("owner")),
    (a) => a.expire(), (a) => a.revoke(id("owner")),
  ]) {
    const h = createHarness();
    const old = context(h, "owner");
    change(h.authority);
    refusal(h, command("submit", 0), "denied", old);
  }
  for (const change of [(a) => a.expire(), (a) => a.revoke(id("owner"))]) {
    const h = createHarness();
    change(h.authority);
    refusal(h, command("submit", 0), "denied");
  }
});

test("approve, verify and publish have distinct roles, states and revisions", () => {
  const h = createHarness();
  refusal(h, command("approve", 0), "illegal_transition");
  refusal(h, command("submit", 1), "stale_revision");
  const approved = seed(h, "approve");
  assert.equal(approved.status, "approved");
  assert.equal(approved.verified, false);
  refusal(h, command("publish", 3), "illegal_transition");
  refusal(h, command("verify", 3), "denied", context(h, "administrator"));
  const verified = success(h, command("verify", 3)).record;
  assert.equal(verified.status, "approved");
  assert.equal(verified.verified, true);
  refusal(h, command("verify", 4), "illegal_transition");
  const published = success(h, command("publish", 4)).record;
  assert.equal(published.status, "published");
  assert.equal(published.revision, 5);
  assert.equal(published.contentVersion, 1);
});

test("the same principal cannot review, verify or publish across role changes", () => {
  const h = createHarness();
  success(h, command("submit", 0));
  h.authority.setRole(id("owner"), "moderator");
  refusal(h, command("start_review", 1), "denied", context(h, "owner"));
  success(h, command("start_review", 1));
  h.authority.setRole(id("alternate"), "moderator");
  refusal(h, command("approve", 2), "illegal_transition", context(h, "alternate"));
  success(h, command("approve", 2));
  h.authority.setRole(id("moderator"), "verifier");
  refusal(h, command("verify", 3), "denied", context(h, "moderator"));
  success(h, command("verify", 3));
  for (const role of ["owner", "moderator", "verifier"]) {
    h.authority.setRole(id(role), "administrator");
    refusal(h, command("publish", 4), "denied", context(h, role));
  }
  success(h, command("publish", 4));
});

test("rejection permits resubmission but unknown reasons or text never enter audit", () => {
  const h = createHarness();
  seed(h, "start_review");
  for (const payload of [{}, { reason: "<b>synthetic text</b>" }, { reason: "missing-evidence", note: "text" }]) {
    refusal(h, command("reject", 2, { payload }), "denied");
  }
  success(h, command("reject", 2, { payload: { reason: "missing-evidence" } }));
  const resubmitted = success(h, command("submit", 3)).record;
  assert.equal(resubmitted.contentVersion, 2);
  assert.equal(resubmitted.status, "submitted");
  assert.equal(resubmitted.reviewer, null);
  const { events } = h.readAudit(context(h, "auditor"), city);
  assert.equal(events[2].reason, "missing-evidence");
  assert.ok(!JSON.stringify(events).includes("synthetic text"));
});

test("owner transfer and withdrawal invalidate prior version decisions and owner replays", () => {
  const h = createHarness();
  seed(h, "verify");
  refusal(h, command("transfer", 4, { payload: { owner: "muscat-owner" } }), "illegal_transition");
  refusal(h, command("transfer", 4, { payload: { owner: id("administrator") } }), "illegal_transition");
  const updated = success(h, command("transfer", 4, { payload: { owner: id("alternate") } })).record;
  assert.equal(updated.status, "draft");
  assert.equal(updated.approvedBy, null);
  assert.equal(updated.verified, false);
  refusal(h, command("submit", 0), "denied");
  refusal(h, command("publish", 5), "illegal_transition");
  assert.equal(success(h, command("submit", 5), context(h, "alternate")).record.contentVersion, 2);
  const withdrawn = success(h, command("withdraw", 6), context(h, "alternate")).record;
  assert.equal(withdrawn.status, "withdrawn");
  assert.equal(withdrawn.submittedBy, null);
  refusal(h, command("submit", 7), "illegal_transition", context(h, "alternate"));
});

test("exact retries are detached; changed payload and changed revision conflict with the same key", () => {
  const h = createHarness();
  seed(h, "start_review");
  const reject = command("reject", 2, { payload: { reason: "missing-evidence" }, key: "decision" });
  const receipt = success(h, reject);
  const before = h.checkpoint();
  assert.deepEqual(apply(h, reject), { ok: true, replayed: true, receipt });
  receipt.record.status = "published";
  assert.equal(apply(h, reject).receipt.record.status, "rejected");
  refusal(h, { ...reject, payload: { reason: "outside-policy" } }, "request_conflict");
  refusal(h, { ...reject, expectedRevision: 3 }, "request_conflict");
  assert.deepEqual(h.checkpoint(), before);
});

test("scripted competing writes permit only one winning mutation at a revision", () => {
  for (const first of ["approve", "reject"]) {
    const h = createHarness();
    seed(h, "start_review");
    const moderator = context(h, "moderator");
    const a = h.prepare(moderator, command("approve", 2));
    const r = h.prepare(moderator, command("reject", 2, { payload: { reason: "outside-policy" } }));
    assert.equal(a.ok && r.ok, true);
    const [winner, loser] = first === "approve" ? [a, r] : [r, a];
    assert.equal(h.commit(winner.plan).ok, true);
    const before = h.checkpoint();
    assert.deepEqual(h.commit(loser.plan), { ok: false, code: "stale_revision" });
    assert.equal(before.snapshot.audit.length, 3);
    assert.deepEqual(h.checkpoint(), before);
  }
});

test("revocation ordered before commit blocks writes and after commit blocks replay", () => {
  for (const update of [(a) => a.revoke(id("owner")), (a) => a.rotateSession(id("owner")), (a) => a.bumpPolicy()]) {
    const h = createHarness();
    const old = context(h, "owner");
    const pending = h.prepare(old, command("submit", 0));
    update(h.authority);
    const before = h.checkpoint();
    assert.deepEqual(h.commit(pending.plan), { ok: false, code: "denied" });
    assert.deepEqual(h.checkpoint(), before);
  }
  const h = createHarness();
  const old = context(h, "owner");
  const submit = command("submit", 0);
  success(h, submit, old);
  const replay = h.prepare(old, submit);
  h.authority.revoke(id("owner"));
  const before = h.checkpoint();
  assert.deepEqual(h.commit(replay.plan), { ok: false, code: "denied" });
  refusal(h, submit, "denied", old);
  const restored = createHarness({ checkpoint: before, authority: h.authority });
  refusal(restored, submit, "denied");
});

test("rollback at every stage leaves no write, audit, receipt or outbox", () => {
  for (const stage of ["before-state", "state", "audit", "receipt", "outbox"]) {
    const h = createHarness();
    seed(h, "verify");
    const publish = command("publish", 4);
    refusal(h, publish, "simulated_failure", context(h, "administrator"), stage);
    assert.equal(success(h, publish).record.revision, 5);
  }
});

test("lost acknowledgement after commit recovers original receipt across restart", () => {
  const h = createHarness();
  seed(h, "verify");
  const publish = command("publish", 4);
  assert.deepEqual(apply(h, publish, context(h, "administrator"), "after-commit"), { ok: false, code: "response_lost" });
  const checkpoint = h.checkpoint();
  const restarted = createHarness({ checkpoint, authority: h.authority });
  const replay = apply(restarted, publish);
  assert.equal(replay.replayed, true);
  assert.deepEqual(replay.receipt, checkpoint.snapshot.receipts.at(-1));
  assert.equal(replay.receipt.at, checkpoint.snapshot.audit.at(-1).at);
  assert.equal(replay.receipt.record.revision, 5);
  assert.deepEqual(restarted.checkpoint(), checkpoint);
});

test("audit path outage holds publication, and audit readers are separate and city scoped", () => {
  const h = createHarness();
  seed(h, "verify");
  h.setAuditAvailableForFixture(false);
  refusal(h, command("publish", 4), "audit_unavailable");
  for (const role of ["owner", "moderator", "verifier", "administrator", "visitor"]) {
    assert.deepEqual(h.readAudit(context(h, role), city), { ok: false, code: "denied" });
  }
  assert.deepEqual(h.readAudit(context(h, "auditor"), "muscat"), { ok: false, code: "denied" });
  const read = h.readAudit(context(h, "auditor"), city);
  assert.equal(read.events.length, 4);
  assert.deepEqual(Object.keys(read.events[0]), ["id", "version", "at", "city", "resourceId", "actor", "action", "reason", "revision"]);
  read.events[0].actor = "detached";
  assert.notEqual(h.readAudit(context(h, "auditor"), city).events[0].actor, "detached");
  refusal(h, command("publish", 4), "denied", context(h, "auditor"));
  h.setAuditAvailableForFixture(true);
  success(h, command("publish", 4));
});

test("outbox rejects cross-city and out-of-order work and deduplicates after checkpoint recovery", () => {
  const h = createHarness();
  seed(h);
  const items = h.checkpoint().snapshot.outbox;
  assert.equal(h.deliver({ ...items[0], city: "doha" }), "quarantined");
  assert.equal(h.deliver(items[4]), "quarantined");
  assert.deepEqual(h.checkpoint().snapshot.projection, []);
  assert.equal(h.deliver(items[0]), "delivered");
  const restarted = createHarness({ checkpoint: h.checkpoint(), authority: h.authority });
  assert.equal(restarted.deliver(items[0]), "duplicate");
  for (const item of items.slice(1)) assert.equal(restarted.deliver(item), "delivered");
  assert.equal(restarted.deliver({ ...items[4], revision: 1 }), "quarantined");
  const projection = restarted.checkpoint().snapshot.projection;
  assert.deepEqual(projection, [items[4]]);
  assert.equal(projection[0].visible, true);
  assert.deepEqual(restarted.visibleIn(city), ["listing-one"]);
  assert.deepEqual(restarted.visibleIn("doha"), []);
  restarted.setAuditAvailableForFixture(false);
  assert.deepEqual(restarted.visibleIn(city), []);
  restarted.setAuditAvailableForFixture(true);
  success(restarted, command("withdraw", 5));
  assert.deepEqual(restarted.visibleIn(city), []);
  assert.equal(restarted.deliver(restarted.checkpoint().snapshot.outbox.at(-1)), "delivered");
  assert.equal(restarted.checkpoint().snapshot.projection[0].visible, false);
});

test("checkpoint reconciliation detects tampering in state, audit, receipt, outbox and delivery", () => {
  const h = createHarness();
  seed(h);
  h.deliver(h.checkpoint().snapshot.outbox[0]);
  const clean = h.checkpoint();
  assert.deepEqual(createHarness({ checkpoint: clean }).checkpoint(), clean);
  for (const mutate of [
    ({ snapshot }) => { snapshot.resources[0].revision++; },
    ({ snapshot }) => { snapshot.audit[0].actor = "tampered"; },
    ({ snapshot }) => { snapshot.receipts[0].at = "tampered"; },
    ({ snapshot }) => { snapshot.receipts[0].record.status = "tampered"; },
    ({ snapshot }) => { snapshot.outbox[0].city = "muscat"; },
    ({ snapshot }) => { snapshot.delivered.push(snapshot.delivered[0]); },
    ({ snapshot }) => { snapshot.projection[0].visible = true; },
    (checkpoint) => { checkpoint.anchor = "wrong-head"; },
  ]) {
    const checkpoint = structuredClone(clean);
    mutate(checkpoint);
    assert.throws(() => createHarness({ checkpoint }), /Checkpoint reconciliation failed/);
  }
});

test("cities with the same resource ID stay independent and fixtures are deterministic", () => {
  const a = createHarness(), b = createHarness();
  const submit = command("submit", 0);
  success(a, submit);
  success(b, submit);
  assert.deepEqual(a.checkpoint(), b.checkpoint());
  success(a, { ...submit, city: "doha" }, a.authority.context("doha-owner"));
  assert.equal(a.readAudit(a.authority.context("doha-auditor"), "doha").events.length, 1);
  assert.equal(b.readAudit(b.authority.context("doha-auditor"), "doha").events.length, 0);
  assert.equal(a.readAudit(a.authority.context("muscat-auditor"), "muscat").events.length, 0);
  assert.deepEqual(a.checkpoint().snapshot.resources.map((record) => record.revision), [1, 0, 1]);
});

test("concurrent exact requests replay once and prepared commands detach from caller mutation", () => {
  const h = createHarness();
  const owner = context(h, "owner");
  const input = command("submit", 0);
  const first = h.prepare(owner, input);
  const competing = h.prepare(owner, structuredClone(input));
  assert.equal(first.ok && competing.ok, true);
  input.city = "doha";
  input.expectedRevision = 99;
  const committed = h.commit(first.plan);
  assert.equal(committed.ok, true);
  assert.equal(committed.receipt.record.city, "dubai");
  assert.deepEqual(h.commit(competing.plan), { ...committed, replayed: true });
  assert.deepEqual(h.commit(first.plan), { ok: false, code: "denied" });
  const { audit, receipts, outbox } = h.checkpoint().snapshot;
  assert.deepEqual([audit.length, receipts.length, outbox.length], [1, 1, 1]);
});
