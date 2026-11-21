import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read = path => readFileSync(new URL("../docs/security/sec-014/"+path,import.meta.url),"utf8");
const [overview,product,economics,compliance,decision]=["README.md","advertising-product.md","unit-economics.md","operator-compliance.md","decision.md"].map(read);
test("SEC-014 records the owner's sponsored-advertising preference as evaluation only",()=>{
  assert.match(decision,/SPONSORED ADVERTISING DIRECTORY SELECTED FOR EVALUATION ONLY/);
  assert.match(decision,/not authorization for launch or spending/);
  assert.match(overview,/SELECTED FOR INTERNAL EVALUATION ONLY/);
  assert.match(decision,/Entity\/individual operator and legal establishment \| UNKNOWN/);
  assert.match(decision,/SEC-012 Muscat-first scope authorization \| PENDING/);
});
test("SEC-014 enforces legible sponsorship and preserves organic and city separation",()=>{
  assert.match(product,/Persistent text label “Sponsored”/);
  assert.match(product,/no cross-city leakage/);
  assert.match(product,/REJECT AS UNDISCLOSED RANKING/);
  assert.match(product,/No real advertiser onboarding/);
  assert.match(product,/None of these features are authorized for implementation/);
});
test("SEC-014 describes economics without fabricated revenue, budgets or legal clearance",()=>{
  for(const variable of ["Q","V","I","F","N","C_acq","C_review","C_fixed","C_var","R","Tax","B"]) assert.ok(economics.includes("| "+variable+" |"),variable);
  assert.match(economics,/NO PRICE/);
  assert.match(economics,/NOT AUTHORIZED/);
  for(let number=1;number<=10;number++) assert.ok(compliance.includes("A14-"+String(number).padStart(2,"0")));
});
test("SEC-014 keeps launch and security boundaries unchanged",()=>{
  assert.match(decision,/D-001 NO-GO; G1–G6 OPEN; G2 NOT CLEARED/);
  assert.match(overview,/sexual-service\/escort advertising/);
  assert.match(compliance,/D7-08 residency\/processing and D7-12 architecture adoption remain \*\*BLOCKED\*\*/);
  assert.match(decision,/SEC-007\/v1 remains unsigned and unadopted/);
  assert.match(decision,/No public preview, production deployment/);
  assert.match(decision,/Merging this record does not approve/);
});
