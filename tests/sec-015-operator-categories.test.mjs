import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read = name => readFileSync(new URL("../docs/security/sec-015/"+name,import.meta.url),"utf8");
const [overview,operator,categories,evidence,decision] = ["README.md","operator-roles.md","advertising-categories.md","evidence-and-counsel.md","decision.md"].map(read);
test("SEC-015 preserves unknown operator and pending owner choice",()=>{
  assert.match(overview,/OPERATOR UNKNOWN; CATEGORY ELIGIBILITY NOT CLEARED/);
  assert.match(decision,/STATUS: PENDING OWNER DEFINITION/);
  assert.match(decision,/SEC-014 selected \*\*sponsored advertising directory for evaluation only\*\*/);
  for(let n=1;n<=10;n++) assert.ok(operator.includes("O15-"+String(n).padStart(2,"0")));
  for(let n=1;n<=8;n++) assert.ok(decision.includes("D15-"+String(n).padStart(2,"0")));
  for(const role of ["OR-1","OR-2","OR-3"]) assert.ok(operator.includes(role));
});
test("SEC-015 category candidates are never silently approved",()=>{
  for(let n=1;n<=6;n++) assert.ok(categories.includes("CAT-"+String(n).padStart(2,"0")));
  assert.match(categories,/RESEARCH CANDIDATE — NOT LEGALLY CLEARED/);
  assert.match(categories,/Owner category decision — PENDING/);
  assert.match(categories,/No real ads or businesses can be admitted/);
  assert.match(categories,/No attempt to disguise the activity/);
});
test("SEC-015 retains independent Oman review and NO-GO conditions",()=>{
  assert.match(overview,/D-001 \*\*NO-GO\*\*/);
  assert.match(overview,/G1–G6 OPEN/);
  assert.match(decision,/G1–G6 OPEN; G2 NOT CLEARED/);
  assert.match(decision,/D7-08 and D7-12 BLOCKED/);
  assert.match(decision,/SEC-012 study decision remains pending/);
  assert.match(evidence,/No external review, contracts, spending, technical implementation, public site or commercial launch is approved/);
  assert.match(decision,/Merge of the documentation is \*\*not a product, licence, category or release approval\*\*/);
});
