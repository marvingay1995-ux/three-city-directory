import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const read = name => readFileSync(new URL("../" + name, import.meta.url), "utf8");
const script = read("tools/interactive-acceptance.mjs");
const report = read("docs/reviews/UX-007-FINAL-DESIGN-ACCEPTANCE.md");

test("UX-007 browser matrix covers three cities and a representative profile in each", () => {
  for (const width of ["320", "375", "390", "768", "1024"]) {
    assert.match(script, new RegExp("\\b" + width + "\\b"));
  }
  for (const path of ["/dubai", "/muscat", "/doha", "/dubai/listing/creative-studio", "/muscat/listing/design-workshop", "/doha/listing/modern-atelier", "/muscat?q=not-a-fixture-name&category=creative"]) {
    assert.ok(script.includes('"' + path + '"'), path);
  }
  assert.match(script, /document\.documentElement\.scrollWidth/);
  assert.match(script, /fictional notice visible|All listings are fictional\./);
});

test("UX-007 verifies same-city empty search recovery and retains interaction checks", () => {
  assert.match(script, /Zero-result recovery/);
  assert.match(script, /Clear search term/);
  assert.match(script, /Remove category filter/);
  assert.match(script, /emptyState\.alternatives\.every\(path => path\.startsWith\("\/muscat\/listing\/"\)\)/);
  assert.match(script, /Gallery enhanced controls/);
  assert.match(script, /Keyboard focus/);
  assert.match(script, /Skip link/);
  assert.match(script, /Comparison/);
});

test("visual approval and launch authorization remain separate and unsigned", () => {
  assert.match(report, /PENDING OWNER VISUAL APPROVAL/);
  assert.match(report, /NOT CONFIRMED/);
  assert.match(report, /NO-GO/);
  assert.match(report, /not.*authorize deployment/i);
});
