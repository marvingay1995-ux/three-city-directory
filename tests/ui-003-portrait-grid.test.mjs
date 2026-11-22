import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const css = readFileSync(new URL("../app/style.css", import.meta.url), "utf8");
const cards = readFileSync(new URL("../components/demo-compare.tsx", import.meta.url), "utf8");
test("UI-003 forces two compact portrait columns at phone widths", () => {
  assert.match(css, /UI-003 — screenshot-guided compact portrait directory/);
  assert.match(css, /\.results \.listing-grid \{[\s\S]*?grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);/);
  assert.match(css, /\.listing-grid \.listing-visual \{[\s\S]*?aspect-ratio: 3 \/ 4;/);
  assert.match(css, /\.listing-grid \.listing-content \{ padding: 12px; gap: 6px; \}/);
});
test("UI-003 preserves profile and compare actions", () => {
  assert.match(cards, /View profile/);
  assert.match(cards, /Compare this profile/);
  assert.match(cards, /Fictional profile/);
});
