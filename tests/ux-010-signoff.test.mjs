import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const doc=readFileSync(new URL("../docs/reviews/UX-010-VISUAL-DESIGN-SIGNOFF.md",import.meta.url),"utf8");
test("UX-010 records explicit owner approval for visual design only",()=>{
  assert.match(doc,/Current decision: APPROVE VISUAL DESIGN ONLY/);
  assert.match(doc,/Explicit decision: \*\*APPROVE VISUAL DESIGN ONLY\*\*/);
  assert.match(doc,/2026-11-21/);
  assert.match(doc,/76f560b1c16f579246f1282dff26f93023a33037/);
  assert.match(doc,/RELEASE: NO-GO/);
  assert.match(doc,/not release authorization/i);
});
test("owner visual approval does not fabricate individual screenshot, accessibility or launch approvals",()=>{
  assert.match(doc,/Evidence inspected by owner: \*\*NOT CONFIRMED\*\*/);
  assert.match(doc,/NOT REVIEWED/);
  assert.match(doc,/assistive technology/);
  assert.match(doc,/country legal, privacy, security, safety/i);
  assert.match(doc,/This does not authorize public deployment or commercial launch/);
});
test("UX-010 provenance ties approval to explicit owner statement and baseline",()=>{
  assert.match(doc,/I approve the visual design only for UX-010/);
  assert.match(doc,/df9052de02ed5e40a4cf52c3ff15f58abd53eb51/);
  assert.match(doc,/44914776628/);
  assert.match(doc,/14711745073/);
});
