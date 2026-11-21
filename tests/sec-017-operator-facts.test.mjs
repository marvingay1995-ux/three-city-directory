import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read = name => readFileSync(new URL("../docs/security/sec-017/"+name,import.meta.url),"utf8");
const [index,facts,choices,decision,handoff]=["README.md","fact-register.md","scope-choices.md","legal-review-decision.md","readiness-handoff.md"].map(read);
test("SEC-017 records partial owner planning fact while remaining facts and choices are pending",()=>{
  assert.match(index,/FACT COMPLETION STILL BLOCKED/);
  assert.match(facts,/FACT COMPLETION STATUS: PARTIAL OWNER-SUPPLIED PLANNING FACT RECORDED/);
  for(let n=1;n<=12;n++) assert.ok(facts.includes("F17-"+String(n).padStart(2,"0")));
  assert.match(choices,/OR-1\/OR-2\/OR-3 NOT SELECTED/);
  assert.match(facts,/individual planning to establish a business in Oman; legal name and establishment\/registration not confirmed/);
  assert.match(facts,/no registration confirmed; actual registration and licences UNKNOWN \/ NOT VERIFIED/);
  for(const r of ["OR-1","OR-2","OR-3"]) assert.ok(choices.includes(r));
  for(let n=1;n<=6;n++) assert.ok(choices.includes("CAT-"+String(n).padStart(2,"0")));
});
test("SEC-017 does not conflate sponsored evaluation with commercial approval",()=>{
  assert.match(index,/sponsored advertising directory selected for evaluation only/);
  assert.match(choices,/NOT CLEARED/);
  assert.match(handoff,/OPERATOR FACT COMPLETION NOT READY/);
  assert.match(facts,/NO BUDGET; NO CONTACT AUTHORITY/);
});
test("SEC-017 explicitly defers legal outreach and keeps release NO-GO",()=>{
  assert.match(decision,/LEGAL-REVIEW ENGAGEMENT: DEFER \/ NOT AUTHORIZED/);
  assert.match(decision,/G1–G6 OPEN; G2 NOT CLEARED/);
  assert.match(index,/D-001 NO-GO for Muscat, Dubai and Doha/);
  assert.match(decision,/D7-08\/D7-12 \*\*BLOCKED\*\*/);
  for(let n=1;n<=10;n++) assert.ok(decision.includes("R17-"+String(n).padStart(2,"0")));
  assert.match(decision,/Approval of SEC-017 documentation does \*\*not\*\* change these conditions/);
});
