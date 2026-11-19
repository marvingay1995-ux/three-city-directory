import { createHash } from "node:crypto";
import { initialResources, resourceKey } from "./commands.mjs";

export const copy = (value) => structuredClone(value);
export const digest = (value) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
export const head = (snapshot) => snapshot.audit.at(-1)?.hash ?? "genesis";
export const timestamp = (sequence) => new Date(Date.UTC(2026, 0, 1, 0, 0, sequence)).toISOString();

export function emptySnapshot() {
  return { resources: initialResources(), audit: [], receipts: [], outbox: [], delivered: [], projection: [], quarantine: [] };
}

export function projectionMessage(record, event) {
  return {
    eventId: event.id, city: event.city, resourceId: event.resourceId, revision: event.revision,
    visible: record.status === "published",
  };
}

function sameMessage(left, right) {
  return left && right && typeof left === "object" &&
    Object.keys(left).length === Object.keys(right).length &&
    Object.entries(right).every(([key, value]) => left[key] === value);
}

function project(projection, message) {
  const key = resourceKey(message);
  const prior = projection.find((item) => resourceKey(item) === key);
  if (message.revision !== (prior?.revision ?? 0) + 1) return undefined;
  return [...projection.filter((item) => resourceKey(item) !== key), message];
}

export function advanceProjection(snapshot, message) {
  const expected = snapshot.outbox.find((item) => item.eventId === message?.eventId);
  const matches = sameMessage(message, expected);
  if (matches && snapshot.delivered.includes(expected.eventId)) return { snapshot, status: "duplicate" };
  const projection = matches ? project(snapshot.projection, expected) : undefined;
  if (projection) {
    return { snapshot: { ...snapshot, projection, delivered: [...snapshot.delivered, expected.eventId] }, status: "delivered" };
  }
  const entry = { eventId: expected?.eventId ?? null, reason: matches ? "out-of-order" : "unknown-or-mismatched" };
  const quarantine = snapshot.quarantine.some((prior) => prior.eventId === entry.eventId && prior.reason === entry.reason)
    ? snapshot.quarantine : [...snapshot.quarantine, entry];
  return { snapshot: { ...snapshot, quarantine }, status: "quarantined" };
}

// The expected head represents a separately held synthetic checkpoint, not production custody.
export function reconciles(snapshot, expectedHead) {
  try {
    if (head(snapshot) !== expectedHead ||
        snapshot.receipts.length !== snapshot.audit.length || snapshot.outbox.length !== snapshot.audit.length) return false;
    const records = new Map(initialResources().map((record) => [resourceKey(record), record]));
    const usedScopes = new Set();
    let previous = "genesis";
    for (const [index, event] of snapshot.audit.entries()) {
      const { hash, ...body } = event;
      const receipt = snapshot.receipts[index];
      const key = resourceKey(event);
      const prior = records.get(key);
      if (!prior || event.version !== 1 || event.id !== `event-${index + 1}` || event.at !== timestamp(index + 1) ||
          event.revision !== prior.revision + 1 || event.previous !== previous || hash !== digest(body) ||
          receipt.at !== event.at || receipt.eventId !== event.id || usedScopes.has(receipt.scope) || receipt.scope !== event.scope ||
          receipt.fingerprint !== event.fingerprint || event.stateDigest !== digest(receipt.record) ||
          resourceKey(receipt.record) !== key || receipt.record.revision !== event.revision ||
          !sameMessage(snapshot.outbox[index], projectionMessage(receipt.record, event))) return false;
      usedScopes.add(receipt.scope);
      records.set(key, receipt.record);
      previous = hash;
    }
    if (digest([...records.values()]) !== digest(snapshot.resources)) return false;

    const seen = new Set();
    let projection = [];
    for (const eventId of snapshot.delivered) {
      if (seen.has(eventId)) return false;
      const item = snapshot.outbox.find((message) => message.eventId === eventId);
      if (!item) return false;
      projection = project(projection, item);
      if (!projection) return false;
      seen.add(eventId);
    }
    return digest(projection) === digest(snapshot.projection) &&
      Array.isArray(snapshot.quarantine) && snapshot.quarantine.every(({ eventId, reason }) =>
        (eventId === null || snapshot.outbox.some((item) => item.eventId === eventId)) &&
        ["unknown-or-mismatched", "out-of-order"].includes(reason));
  } catch {
    return false;
  }
}
