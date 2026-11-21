import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const assessment = readFileSync(new URL("../docs/security/sec-011/pre-release-readiness.md", import.meta.url), "utf8");
test("SEC-011 retains NO-GO and every release gate open", () => {
  assert.match(assessment, /D-001: \*\*NO-GO\*\*/);
  assert.match(assessment, /G1–G6: \*\*OPEN\*\*/);
  assert.match(assessment, /G2 \*\*NOT CLEARED\*\*/);
  for (const gate of ["G1 — Legal", "G2 — Security", "G3 — Privacy", "G4 — Accessibility", "G5 — Operations", "G6 — Product"]) {
    assert.ok(assessment.includes(gate), gate);
  }
});
test("SEC-011 neither adopts the frozen security design nor claims market clearance", () => {
  assert.match(assessment, /SEC-007\/v1 remains FROZEN FOR REVIEW, unsigned and unadopted/);
  assert.match(assessment, /Muscat-first research remains PROPOSED/);
  for(let number=1;number<=12;number++) {
    assert.match(assessment,new RegExp("D7-"+String(number).padStart(2,"0")));
  }
  assert.match(assessment, /No countersignature, no expenses, no engagement, no permissions, no deployment/);
});
test("SEC-011 distinguishes approved visual design and prior offline evidence from production evidence", () => {
  assert.match(assessment, /APPROVED — visual scope only/);
  assert.match(assessment, /HISTORIC FINDINGS; current status requires re-evaluation/);
  assert.match(assessment, /NOT ASSESSED \/ OPEN/);
  assert.match(assessment, /separately authorize/i);
});
