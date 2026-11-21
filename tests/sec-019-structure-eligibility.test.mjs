import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read = name => readFileSync(new URL("../docs/security/sec-019/"+name,import.meta.url),"utf8");
const [overview,matrix,facts,decision,handoff]=["README.md","eligibility-matrix.md","owner-facts.md","decision.md","handoff.md"].map(read);
test("SEC-019 keeps applicant eligibility and legal-form decision unresolved",()=>{
  assert.match(overview,/OWNER LEGAL-FORM SELECTION PENDING; REGISTRATION UNCONFIRMED/);
  assert.match(matrix,/NO STRUCTURE SELECTED; ELIGIBILITY OF THE PROSPECTIVE OWNER UNKNOWN/);
  for(let n=1;n<=4;n++) assert.ok(matrix.includes("RP-"+String(n).padStart(2,"0")));
  for(let n=1;n<=10;n++) assert.ok(facts.includes("E19-"+String(n).padStart(2,"0")));
  for(let n=1;n<=9;n++) assert.ok(decision.includes("D19-"+String(n).padStart(2,"0")));
  assert.match(decision,/DECISION D19-01: STRUCTURE SELECTION PENDING/);
});
test("SEC-019 does not equate a planning intention with issued registration",()=>{
  assert.match(overview,/individual planning to establish a business in Oman, with no registration confirmed/);
  assert.match(matrix,/NOT SELECTED — ELIGIBILITY UNKNOWN/);
  assert.match(matrix,/DEFERRED — NO PARENT EVIDENCED/);
  assert.match(facts,/NOT CONFIRMED/);
  assert.match(handoff,/NO GO for any application/);
});
test("SEC-019 keeps all contact, money and release barriers",()=>{
  assert.match(decision,/external legal or regulator contact/);
  assert.match(decision,/No legal entity selected/);
  assert.match(decision,/G1–G6 OPEN; G2 NOT CLEARED/);
  assert.match(decision,/D-001 NO-GO for Muscat, Dubai and Doha/);
  assert.match(overview,/D7-08 and D7-12 BLOCKED/);
  assert.match(decision,/Merging the PR is \*\*not\*\* approval/);
});
