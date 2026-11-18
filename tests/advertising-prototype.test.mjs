import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { getListings } from "../lib/directory.ts";
import { listPlacements, placementIssue, reviewCreative } from "../lib/advertising/policy.ts";
import { createAdvertisingPrototype } from "../lib/advertising/prototype.ts";

const at = "2026-02-02T00:00:00.000Z";
const end = "2026-02-11T00:00:00.000Z";
const make = (action, expectedRevision, options = {}) => ({
  campaignId: "dubai-first", city: "dubai", requestId: action, action, expectedRevision, at, ...options,
});
const fixture = () => createAdvertisingPrototype().list("dubai")[0];
const snapshot = (p) => ["dubai", "muscat", "doha"].map((city) => p.list(city));
function fail(p, cmd, code) {
  const before = snapshot(p);
  assert.deepEqual(p.apply(cmd), { ok: false, code });
  assert.deepEqual(snapshot(p), before);
}
function apply(p, cmd) {
  const result = p.apply(cmd);
  assert.equal(result.ok, true, JSON.stringify(result));
  assert.equal(result.replayed, false);
  return result.campaign;
}
function decide(p, options = {}) {
  apply(p, make("submit", 0, options));
  apply(p, make("start_review", 1, options));
  return apply(p, make("decide", 2, options));
}

test("inventory is scoped and detached; placement validates city, slot, category and window", () => {
  const campaign = fixture();
  assert.deepEqual(listPlacements("dubai").map(({ id }) => id), ["dubai-creative"]);
  assert.deepEqual(listPlacements("unknown"), []);
  assert.equal(placementIssue(campaign, at), undefined);
  assert.equal(placementIssue(null, at), "invalid-placement");
  for (const [changes, reason] of [
    [{ city: "other" }, "unknown-city"], [{ category: "other" }, "unknown-category"],
    [{ placementId: "other" }, "unknown-placement"], [{ slot: "other" }, "unknown-slot"],
    [{ slot: "directory-panel" }, "slot-mismatch"], [{ city: "doha" }, "placement-city-mismatch"],
    [{ category: undefined }, "category-mismatch"], [{ category: "lifestyle" }, "category-mismatch"],
    [{ listingId: "d2" }, "category-mismatch"], [{ listingId: "q1" }, "listing-city-mismatch"],
    [{ listingId: "unknown" }, "unknown-listing"], [{ startsAt: end }, "invalid-window"],
    [{ startsAt: "2026-02-30T00:00:00.000Z" }, "invalid-window"],
  ]) assert.equal(placementIssue({ ...campaign, ...changes }, at), reason);
  assert.equal(placementIssue(campaign, end), "expired-window");
  assert.equal(placementIssue(campaign, "invalid"), "invalid-time");
});

test("creative review fails closed with explicit reasons for rejection and manual review", () => {
  const campaign = fixture();
  assert.equal(reviewCreative(campaign, campaign.creative, at).status, "approved");
  for (const [field, value, status, reason] of [
    ["id", "", "rejected", "invalid-creative"],
    ["city", "muscat", "rejected", "creative-scope-mismatch"],
    ["listingId", "d2", "rejected", "creative-scope-mismatch"],
    ["disclosure", "", "rejected", "missing-disclosure"],
    ["content", "outside-scope", "rejected", "disallowed-content"],
    ["source", "third-party", "rejected", "disallowed-source"],
    ["rights", "denied", "rejected", "denied-rights"],
    ["destination", "external", "rejected", "disallowed-destination"],
    ["rights", "unresolved", "blocked", "unresolved-rights"],
    ["source", "unresolved", "blocked", "unresolved-source"],
    ["content", "unclassified", "blocked", "manual-policy-review"],
  ]) assert.deepEqual(reviewCreative(campaign, { ...campaign.creative, [field]: value }, at), { status, reason });
});

test("campaign reads and writes fail closed across city boundaries and on invalid input", () => {
  const p = createAdvertisingPrototype();
  assert.equal(p.list("invalid"), undefined);
  assert.deepEqual(p.list("doha").map(({ id }) => id), ["doha-sample"]);
  fail(p, make("submit", 0, { city: "doha" }), "not_found");
  fail(p, make("submit", 0, { city: "unknown" }), "unknown_city");
  fail(p, make("__proto__", 0), "invalid");
  fail(p, make("submit", 0, { at: end }), "ineligible");
  fail(p, make("submit", 0, { at: "malformed" }), "invalid");
  fail(p, make("submit", 0, { at: "2026-01-30T00:00:00.000Z" }), "invalid");
  fail(p, make("schedule", 0), "illegal_transition");
});

test("approval, time-bounded scheduling and completion are separate operations", () => {
  const p = createAdvertisingPrototype();
  assert.equal(decide(p).status, "approved");
  fail(p, make("complete", 3, { at: end }), "illegal_transition");
  fail(p, make("schedule", 3, { at: "2026-02-10T12:00:00.000Z" }), "outside_window");
  assert.equal(apply(p, make("schedule", 3)).status, "simulated_scheduled");
  fail(p, make("complete", 4), "outside_window");
  assert.equal(apply(p, make("complete", 4, { at: end })).status, "simulated_completed");
  fail(p, make("cancel", 5, { at: end }), "illegal_transition");
});

test("blocked and rejected decisions cannot schedule", () => {
  const p = createAdvertisingPrototype();
  for (const [city, reason, status] of [
    ["muscat", "unresolved-rights", "blocked"], ["doha", "denied-rights", "rejected"],
  ]) {
    const options = { city, campaignId: city + "-sample" };
    assert.deepEqual(decide(p, options).review, { status, reason });
    fail(p, make("schedule", 3, options), "illegal_transition");
  }
});

test("replays are detached; request conflicts and stale revisions never mutate state", () => {
  const p = createAdvertisingPrototype();
  const first = make("submit", 0);
  const receipt = apply(p, first);
  apply(p, make("start_review", 1));
  assert.deepEqual(p.apply(first), { ok: true, replayed: true, campaign: receipt });
  receipt.creative.rights = "denied";
  assert.equal(p.apply(first).campaign.creative.rights, "fixture-cleared");
  fail(p, make("submit", 0, { campaignId: "dubai-alternate" }), "request_conflict");
  fail(p, make("decide", 1), "stale");
  assert.equal(apply(p, make("decide", 2)).revision, 3);
  assert.equal(createAdvertisingPrototype().list("dubai")[0].revision, 0);
});

test("overlapping allocations fail and cancelling releases the simulated slot", () => {
  const p = createAdvertisingPrototype();
  decide(p);
  for (const [revision, action] of ["submit", "start_review", "decide"].entries()) {
    apply(p, make(action, revision, { campaignId: "dubai-alternate", requestId: "alt-" + action }));
  }
  apply(p, make("schedule", 3));
  const alternate = make("schedule", 3, { campaignId: "dubai-alternate", requestId: "alt-schedule" });
  fail(p, alternate, "slot_conflict");
  assert.equal(apply(p, make("cancel", 4)).status, "cancelled");
  assert.equal(apply(p, alternate).status, "simulated_scheduled");
});

test("simulation cannot change organic ordering, filters or the public sponsor example", () => {
  const p = createAdvertisingPrototype();
  decide(p);
  apply(p, make("schedule", 3));
  assert.deepEqual(getListings("dubai").map(({ id }) => id), ["d1", "d2"]);
  assert.deepEqual(getListings("dubai", "creative", "creative").map(({ id }) => id), ["d1"]);
  assert.deepEqual(getListings("dubai", "creative", "lifestyle"), []);
  assert.equal(getListings("dubai")[0].sponsoredExample, true);
});

test("offline renderer separates sponsored and organic regions without live controls", () => {
  const path = fileURLToPath(new URL("../tools/advertising-preview.ts", import.meta.url));
  const html = execFileSync(process.execPath, [path], { encoding: "utf8" });
  assert.match(html, /<aside aria-labelledby="sponsored">/);
  assert.match(html, /Sponsored — simulation only/);
  assert.match(html, /Organic results/);
  assert.match(html, /unresolved-rights/);
  assert.doesNotMatch(html, /<(?:script|form|img|iframe|button)\b|https?:\/\//i);
});
