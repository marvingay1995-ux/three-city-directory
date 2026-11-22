import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const css = readFileSync(new URL("../app/style.css", import.meta.url), "utf8");
const cards = readFileSync(new URL("../components/demo-compare.tsx", import.meta.url), "utf8");
test("UI-002 mobile layout reduces card height and prioritizes profile action", () => {
  assert.match(css, /UI-002 — compact mobile editorial cards/);
  assert.match(css, /\.listing-visual \{ min-block-size: 170px; \}/);
  assert.match(css, /\.listing-open \{ order: 1;/);
  assert.match(css, /\.compare-toggle \{ order: 2;/);
});
test("UI-002 retains fictional profile routes and compare functionality", () => {
  assert.match(cards, /getListingPath\(item\)/);
  assert.match(cards, /View profile/);
  assert.match(cards, /Compare this profile/);
  assert.match(cards, /Fictional profile/);
  assert.doesNotMatch(cards, /"✳"/);
});
