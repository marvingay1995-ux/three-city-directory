import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read = name => readFileSync(new URL("../docs/security/sec-018/"+name,import.meta.url),"utf8");
const [overview,paths,activities,sources,decision]=["README.md","registration-paths.md","activity-classification.md","sources-and-evidence.md","decision.md"].map(read);
test("SEC-018 retains unconfirmed registration and no selected legal form",()=>{
  assert.match(overview,/LEGAL FORM AND ACTIVITY CODE UNSELECTED; REGISTRATION NOT CONFIRMED/);
  assert.match(overview,/individual planning to establish a business in Oman, with no registration confirmed/);
  for(let n=1;n<=4;n++) assert.ok(paths.includes("RP-"+String(n).padStart(2,"0")));
  assert.match(paths,/NOT SELECTED; ELIGIBILITY UNKNOWN/);
  assert.match(decision,/LEGAL FORM UNSELECTED/);
});
test("SEC-018 documents registration sources without inventing licence codes or eligibility",()=>{
  for(let n=1;n<=8;n++){
    assert.ok(activities.includes("AC18-"+String(n).padStart(2,"0")));
    assert.ok(sources.includes("SRC18-"+String(n).padStart(2,"0")));
  }
  assert.match(activities,/CLASSIFICATION STATUS: OPEN/);
  assert.match(activities,/no codes assigned/i);
  assert.match(sources,/Exact advertising and website activity codes \| \*\*NOT VERIFIED\*\*/);
  assert.match(overview,/no licence or sector clearance has been independently verified/i);
});
test("SEC-018 preserves explicit NO-GO and prohibition of filings and spend",()=>{
  assert.match(overview,/D-001 NO-GO/);
  assert.match(overview,/G1–G6 OPEN/);
  assert.match(decision,/D-001 NO-GO — MUSCAT, DUBAI, DOHA/);
  assert.match(decision,/NOT AUTHORIZED/);
  assert.match(decision,/SEC-007\/v1 unsigned\/unadopted/);
  assert.match(decision,/No deployment, spending, legal contact, filing or public advertising is authorized/);
});
