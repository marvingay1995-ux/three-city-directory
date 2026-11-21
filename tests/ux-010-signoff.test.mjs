import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const doc=readFileSync(new URL("../docs/reviews/UX-010-VISUAL-DESIGN-SIGNOFF.md",import.meta.url),"utf8");
test("UX-010 decision remains unsigned and scoped to visual design only",()=>{
  assert.match(doc,/Current decision: PENDING/);
  assert.match(doc,/RELEASE: NO-GO/);
  assert.match(doc,/APPROVE VISUAL DESIGN ONLY/);
  assert.match(doc,/REQUEST REVISIONS/);
  assert.match(doc,/REJECT VISUAL DESIGN/);
  assert.match(doc,/NOT CONFIRMED/);
  assert.match(doc,/not automatically change.*PENDING/i);
});
test("UX-010 evidence points to verified PR57 artifacts and retains review caveats",()=>{
  assert.match(doc,/df9052de02ed5e40a4cf52c3ff15f58abd53eb51/);
  assert.match(doc,/44914776628/);
  assert.match(doc,/14711745073/);
  assert.match(doc,/full-page-index\.html/);
  assert.match(doc,/14 days/);
  assert.match(doc,/screen reader|assistive technology/i);
});
