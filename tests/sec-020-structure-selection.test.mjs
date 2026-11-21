import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read = name => readFileSync(new URL("../docs/security/sec-020/"+name,import.meta.url),"utf8");
const [overview,comparison,decision,facts,handoff]=["README.md","structure-comparison.md","decision.md","eligibility-questions.md","handoff.md"].map(read);
test("SEC-020 refuses to infer an owner choice from the milestone request",()=>{
  assert.match(overview,/NO BUSINESS STRUCTURE SELECTED/);
  assert.match(decision,/D20-01 — OWNER-SELECTED BUSINESS STRUCTURE: PENDING \/ UNSELECTED/);
  for(let n=1;n<=7;n++) assert.ok(decision.includes("D20-"+String(n).padStart(2,"0")));
  for(let n=1;n<=10;n++) assert.ok(facts.includes("F20-"+String(n).padStart(2,"0")));
});
test("SEC-020 preserves owner eligibility unknown and compares all valid research scenarios",()=>{
  for(let n=1;n<=4;n++) assert.ok(comparison.includes("RP-"+String(n).padStart(2,"0")));
  assert.match(comparison,/UNSELECTED \/ UNKNOWN ELIGIBILITY/);
  assert.match(comparison,/DEFERRED \/ NO PARENT EVIDENCED/);
  assert.match(facts,/registration has \*\*not been confirmed\*\*/);
  assert.match(handoff,/owner structure choice not provided/);
});
test("SEC-020 preserves no-spend, no-registration and release NO-GO",()=>{
  assert.match(decision,/NOT AUTHORIZED/);
  assert.match(decision,/G1–G6 OPEN; G2 NOT CLEARED/);
  assert.match(decision,/D-001 NO-GO for Muscat, Dubai and Doha/);
  assert.match(overview,/D7-08 and D7-12 BLOCKED/);
  assert.match(decision,/Merging this PR is not an owner route selection/);
});
