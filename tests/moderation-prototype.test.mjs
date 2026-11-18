import assert from "node:assert/strict";
import test from "node:test";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { permitsMockAction } from "../lib/moderation/policy.ts";
import { createModerationPrototype } from "../lib/moderation/prototype.ts";
import { createDemoRepository } from "../lib/data/in-memory.ts";

const at = "2026-01-02T00:00:00.000Z";
const submit = {
  requestId: "submit-1", actorRef: "owner-dubai", city: "dubai", listingId: "review-d2",
  action: "submit", expectedRevision: 0, occurredAt: at,
};
const review = { ...submit, requestId: "review-1", actorRef: "moderator-dubai", action: "start_review", expectedRevision: 1 };
const approve = { ...review, requestId: "approve-1", action: "approve", expectedRevision: 2, reasonCode: "meets-demo-policy" };
const reject = { ...review, requestId: "reject-1", action: "reject", expectedRevision: 2, reasonCode: "missing-demo-details" };
const publish = { ...approve, requestId: "publish-1", actorRef: "administrator-demo", action: "publish", expectedRevision: 3, reasonCode: undefined };
const reconsider = { ...publish, requestId: "reconsider-1", action: "reconsider", reasonCode: "ready-for-resubmission" };
const queue = (prototype) => prototype.inspect("moderator-dubai", "dubai");
const succeed = (prototype, command) => {
  const result = prototype.apply(command);
  assert.equal(result.ok, true, JSON.stringify(result));
  assert.equal(result.replayed, false);
  return result.receipt;
};
const queues = (prototype) => ["dubai", "muscat", "doha"].map((city) => prototype.inspect(`moderator-${city}`, city));
const fail = (prototype, command, code) => {
  const before = queues(prototype);
  assert.deepEqual(prototype.apply(command), { ok: false, code });
  assert.deepEqual(queues(prototype), before);
};

test("role matrix only grants explicitly scoped permissions", () => {
  const actions = ["view_queue", "submit", "start_review", "approve", "reject", "reconsider", "publish", "unknown"];
  for (const [actor, owner, allowed] of [
    ["visitor-demo", undefined, []],
    ["owner-dubai", "owner-dubai", ["submit"]],
    ["owner-dubai", "owner-muscat", []],
    ["moderator-dubai", undefined, ["view_queue", "start_review", "approve", "reject"]],
    ["administrator-demo", undefined, ["view_queue", "reconsider", "publish"]],
  ]) {
    assert.deepEqual(actions.filter((action) => permitsMockAction(actor, "dubai", action, owner)), allowed);
  }
  assert.equal(permitsMockAction("administrator-demo", "muscat", "publish"), false);
  assert.equal(permitsMockAction("administrator-demo", "doha", "publish"), true);
  assert.equal(permitsMockAction("moderator-muscat", "muscat", "approve"), true);
  assert.equal(permitsMockAction("moderator-dubai", "doha", "approve"), false);
  assert.equal(permitsMockAction("administrator-demo", "unknown", "publish"), false);
  assert.equal(permitsMockAction({ ref: "visitor-demo", role: "administrator" }, "dubai", "publish"), false);
  assert.equal(permitsMockAction("unknown-role", "dubai", "publish"), false);
});

test("forged actors, unknown targets and cross-city requests fail closed without writes", () => {
  const p = createModerationPrototype();
  for (const actorRef of [undefined, "unknown", "__proto__", { ref: "administrator-demo", role: "administrator" }]) {
    fail(p, { ...submit, actorRef }, "forbidden");
  }
  for (const command of [
    { ...submit, actorRef: "visitor-demo", role: "business_owner" },
    { ...submit, listingId: "review-d1" },
    { ...submit, actorRef: "owner-muscat" },
    { ...submit, actorRef: "moderator-dubai" },
    { ...approve, actorRef: "owner-dubai", role: "moderator" },
    { ...publish, actorRef: "moderator-dubai", role: "administrator" },
    { ...publish, city: "muscat", listingId: "review-m1" },
    { ...publish, city: "unknown" },
    { ...submit, action: "view_queue" },
    { ...submit, action: "constructor" },
  ]) fail(p, command, "forbidden");
  fail(p, { ...review, listingId: "review-m1" }, "not_found");
  fail(p, { ...review, listingId: "missing" }, "not_found");
  assert.equal(p.inspect("visitor-demo", "dubai"), undefined);
  assert.equal(p.inspect("moderator-dubai", "muscat"), undefined);
  assert.equal(p.inspect("administrator-demo", "unknown"), undefined);
});

test("approval applies a reasoned decision; only a separate administrator action publishes", () => {
  const p = createModerationPrototype();
  fail(p, { ...review, expectedRevision: 0 }, "illegal_transition");
  fail(p, { ...publish, expectedRevision: 0 }, "illegal_transition");
  succeed(p, submit);
  fail(p, { ...submit, requestId: "submit-again" }, "stale");
  fail(p, { ...publish, expectedRevision: 1 }, "illegal_transition");
  succeed(p, review);
  fail(p, { ...approve, reasonCode: undefined }, "invalid");
  fail(p, { ...approve, reasonCode: "outside-demo-scope" }, "invalid");
  fail(p, { ...reject, reasonCode: " " }, "invalid");
  assert.equal(succeed(p, approve).listing.status, "approved");
  assert.equal(queue(p).decisions[0].outcome, "approved");
  assert.equal(queue(p).submissions[0].status, "decided");
  assert.equal(queue(p).listings.find((item) => item.id === submit.listingId).verificationStatus, "unverified");
  fail(p, { ...publish, actorRef: "moderator-dubai" }, "forbidden");
  const published = succeed(p, publish);
  assert.equal(published.listing.status, "published");
  assert.equal(published.listing.verificationStatus, "unverified");
  assert.equal(published.event.decision, undefined);
  assert.equal(queue(p).decisions.length, 1);
});

test("rejected submissions are immutable history and reconsideration requires resubmission", () => {
  const p = createModerationPrototype();
  succeed(p, submit);
  succeed(p, review);
  succeed(p, reject);
  fail(p, publish, "illegal_transition");
  fail(p, { ...reconsider, actorRef: "moderator-dubai" }, "forbidden");
  fail(p, { ...reconsider, reasonCode: undefined }, "invalid");
  succeed(p, reconsider);
  fail(p, { ...review, requestId: "review-2", expectedRevision: 4 }, "illegal_transition");
  succeed(p, { ...submit, requestId: "submit-2", expectedRevision: 4 });
  succeed(p, { ...review, requestId: "review-2", expectedRevision: 5 });
  succeed(p, { ...approve, requestId: "approve-2", expectedRevision: 6 });
  const snapshot = queue(p);
  assert.equal(snapshot.submissions.length, 2);
  assert.notEqual(snapshot.submissions[0].id, snapshot.submissions[1].id);
  assert.deepEqual(snapshot.decisions.map(({ outcome }) => outcome), ["rejected", "approved"]);
  assert.equal(snapshot.audits[3].reasonCode, "ready-for-resubmission");
});

test("exact retries replay an immutable original receipt and conflicting or stale retries never audit", () => {
  const p = createModerationPrototype();
  const original = succeed(p, submit);
  succeed(p, review);
  assert.deepEqual(p.apply(submit), { ok: true, replayed: true, receipt: original });
  fail(p, { ...submit, occurredAt: "2026-01-02T00:01:00.000Z" }, "request_conflict");
  fail(p, { ...submit, requestId: "new-id" }, "stale");
  fail(p, { ...review, requestId: "new-id", expectedRevision: 2 }, "illegal_transition");
  fail(p, { ...approve, occurredAt: "not-a-timestamp" }, "invalid");
  fail(p, { ...approve, occurredAt: "2026-01-01T00:00:00.000Z" }, "invalid");
  fail(p, { ...approve, expectedRevision: -1 }, "invalid");
  const after = succeed(p, approve);
  assert.equal(after.event.id, "audit-3");
  assert.equal(queue(p).audits.length, 3);
  original.event.actorRef = "tampered";
  const snapshot = queue(p);
  snapshot.audits[0].actorRef = "tampered";
  assert.equal(p.apply(submit).receipt.event.actorRef, "owner-dubai");
  assert.equal(queue(p).audits[0].actorRef, "owner-dubai");
});

test("audit entries are deterministic, city-scoped and detached from the Phase 3 adapter", () => {
  const a = createModerationPrototype();
  const b = createModerationPrototype();
  for (const p of [a, b]) {
    succeed(p, submit);
    succeed(p, review);
    const { event } = succeed(p, reject);
    assert.deepEqual(event, {
      id: "audit-3", requestId: "reject-1", cityId: "dubai", actorRef: "moderator-dubai",
      action: "reject", targetType: "listing", targetId: "review-d2", from: "under_review", status: "rejected",
      revision: 3, submissionId: "review-d2-submission-1", occurredAt: at,
      decision: "rejected", reasonCode: "missing-demo-details",
    });
  }
  assert.deepEqual(queue(a), queue(b));
  assert.deepEqual(a.inspect("moderator-muscat", "muscat").audits, []);
  assert.equal(createDemoRepository().findBySlug("dubai", "city-concierge").status, "published");
  assert.equal(queue(createModerationPrototype()).audits.length, 0);
});

test("offline preview contains the fixture queue and audit without interactive or network markup", () => {
  const path = fileURLToPath(new URL("../tools/moderation-preview.ts", import.meta.url));
  const html = execFileSync(process.execPath, [path], { encoding: "utf8" });
  for (const text of ["Offline prototype", "Dubai", "Muscat", "Doha", "Audit timeline", "Published in simulation", "Rejected"]) {
    assert.ok(html.includes(text));
  }
  assert.match(html, /default-src 'none'/);
  assert.doesNotMatch(html, /<(?:form|input|button|script|iframe)\b|https?:\/\//i);
});
