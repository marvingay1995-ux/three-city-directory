import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = file => readFileSync(new URL("../docs/security/sec-012/" + file, import.meta.url), "utf8");
const [scope, facts, flows, decision] = ["README.md","operator-and-facts.md","service-boundary.md","scope-decision.md"].map(read);

test("SEC-012 proposes a Muscat research study without business or launch authority", () => {
  assert.match(scope, /PROPOSED FOR PRODUCT-OWNER SCOPE DECISION/);
  assert.match(scope, /NO-GO for public deployment and commercial launch/);
  assert.match(facts, /no legal advice or clearance/i);
  assert.match(scope, /general-business/);
  assert.match(scope, /Dubai and Doha/);
  assert.match(scope, /G1–G6 OPEN/);
  assert.match(scope, /SEC-007\/v1 unsigned and unadopted/);
});
test("SEC-012 preserves unknown operator facts and explicit prohibitions", () => {
  for (let i = 1; i <= 12; i++) {
    assert.ok(facts.includes("M-" + String(i).padStart(2,"0")), "M-" + i);
  }
  assert.match(facts, /UNKNOWN/);
  assert.match(facts, /NOT AUTHORIZED/);
  assert.match(flows, /NO/);
  assert.match(scope, /no provider\/region selected/i);
  assert.match(flows, /No precise geolocation is needed/);
});
test("SEC-012 owner-scope decision remains unsigned and separate from engagement", () => {
  assert.match(decision, /DECISION: PENDING/);
  assert.match(decision, /owner has not approved/);
  assert.match(decision, /NOT PROVIDED/);
  assert.match(decision, /G1–G6 OPEN; G2 NOT CLEARED/);
  assert.match(decision, /NO-GO for Muscat, Dubai and Doha/);
  assert.match(decision, /do not send briefs/i);
  assert.match(decision, /Merging SEC-012 does \*\*not\*\* count as selecting A/);
});
