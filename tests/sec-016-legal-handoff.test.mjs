import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read = name => readFileSync(new URL("../docs/security/sec-016/"+name,import.meta.url),"utf8");
const [index,intake,brief,privacy,decision,evidence]=["README.md","operator-intake.md","counsel-brief-unsent.md","privacy-flow-appendix.md","authorization-and-decision.md","evidence-ledger.md"].map(read);
test("SEC-016 is an unsent, unapproved legal review with unknown operator",()=>{
  assert.match(index,/INTERNAL, UNSENT, NOT LEGAL ADVICE/);
  assert.match(index,/NO OPERATOR IDENTIFIED/);
  assert.match(intake,/Operator identity: UNKNOWN/);
  assert.match(brief,/DRAFT ONLY — DO NOT SEND OR TREAT AS ENGAGEMENT/);
  assert.match(decision,/EXTERNAL COUNSEL ENGAGEMENT: NOT AUTHORIZED/);
  for(let i=1;i<=12;i++){
    assert.ok(intake.includes("O16-"+String(i).padStart(2,"0")),"O16-"+i);
    assert.ok(brief.includes("L16-"+String(i).padStart(2,"0")),"L16-"+i);
  }
});
test("SEC-016 preserves category, operator and privacy unknowns without fabricated clearance",()=>{
  assert.match(index,/Each is \*\*NOT CLEARED\*\*/);
  assert.match(intake,/UNKNOWN \/ NOT VERIFIED/);
  assert.match(privacy,/NO HOSTING \/ NO APPROVED COLLECTION/);
  assert.match(privacy,/TRACKING NOT AUTHORIZED/);
  assert.match(privacy,/D7-08 and D7-12 are \*\*BLOCKED\*\*/);
  assert.match(evidence,/does not generate or validate personal identity documents/);
});
test("SEC-016 cannot authorize spend, external contact, or a country release",()=>{
  assert.match(index,/D-001 NO-GO for all three cities/);
  assert.match(index,/G1–G6 OPEN, G2 NOT CLEARED/);
  assert.match(decision,/SPENDING NOT AUTHORIZED/);
  assert.match(decision,/Permission to contact counsel, regulators, businesses or providers \| \*\*NONE\*\*/);
  assert.match(decision,/D-001 NO-GO — MUSCAT, DUBAI AND DOHA/);
  assert.match(index,/Merging this packet is not authorization/);
});
