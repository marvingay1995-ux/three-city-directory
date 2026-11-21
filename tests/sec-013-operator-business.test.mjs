import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = path => readFileSync(new URL("../docs/security/sec-013/" + path, import.meta.url), "utf8");
const [overview, operators, business, boundary, decision] = ["README.md","operator-register.md","business-model.md","operating-boundary.md","decision.md"].map(read);

test("SEC-013 keeps operator and business model unresolved", () => {
  assert.match(overview, /PROPOSED \/ OWNER DECISION PENDING/);
  assert.match(operators, /UNKNOWN/);
  assert.match(decision, /OWNER DISPOSITION: PENDING/);
  assert.match(decision, /Exact legal operator: \*\*UNKNOWN\*\*/);
  for (let i=1;i<=6;i++) assert.ok(decision.includes("D13-"+String(i).padStart(2,"0")));
  for (let i=1;i<=12;i++) assert.ok(operators.includes("OP-"+String(i).padStart(2,"0")));
});
test("SEC-013 models distinct noncommercial and future commercial paths without authorizing activity", () => {
  for (const name of ["Editorial / noncommercial","Paid directory listings","Sponsored advertising","Referral/lead introduction","Transaction/booking marketplace"]) assert.ok(overview.includes(name),name);
  assert.match(business, /UNKNOWN/);
  assert.match(business, /unit-economics template/);
  assert.match(overview, /NOT APPROVED/);
  assert.match(boundary, /Future operating capabilities: NOT AUTHORIZED/);
});
test("SEC-013 retains security and country NO-GO and no-spend boundaries", () => {
  assert.match(overview, /D-001 \*\*NO-GO\*\*/);
  assert.match(overview, /G1–G6 \*\*OPEN\*\*/);
  assert.match(boundary, /D7-08 and D7-12 BLOCKED/);
  assert.match(decision, /NO-GO — Muscat, Dubai and Doha/);
  assert.match(decision, /not change this disposition merely because PR #62 is merged/i);
  assert.match(overview, /No real listings/);
  assert.match(decision, /Authorizations for providers, counsel, real content, funds or public release: \*\*NONE\*\*/);
});
