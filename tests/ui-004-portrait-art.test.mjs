import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const portrait = readFileSync(new URL("../components/demo-portrait.tsx", import.meta.url), "utf8");
const cards = readFileSync(new URL("../components/demo-compare.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../app/style.css", import.meta.url), "utf8");
test("UI-004 uses original SVG artwork for all six fictional listings", () => {
  for (const id of ["d1", "d2", "m1", "m2", "q1", "q2"]) assert.match(portrait, new RegExp(id + ":"));
  assert.match(portrait, /<svg className="demo-portrait"/);
  assert.match(cards, /<DemoPortrait variant=\{item.id\} \/>/);
});
test("UI-004 retains compact portrait grid and accessible profile links", () => {
  assert.match(css, /UI-004 — original fictional portrait artwork/);
  assert.match(css, /\.listing-grid \.listing-visual \{ position: relative; aspect-ratio: 3 \/ 4; \}/);
  assert.match(cards, /aria-label=\{\x60Explore \$\{item.title\}\x60\}/);
  assert.match(cards, /View profile/);
  assert.doesNotMatch(portrait, /https?:\/\//);
});
