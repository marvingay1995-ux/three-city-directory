import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../app/style.css", import.meta.url), "utf8");
const layout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");
const header = readFileSync(new URL("../components/directory-ui.tsx", import.meta.url), "utf8");
const search = readFileSync(new URL("../components/directory-search.tsx", import.meta.url), "utf8");

test("UI-001 mobile layout has single-column search and wrapped navigation", () => {
  assert.match(css, /UI-001 — narrow-screen overflow/);
  assert.match(css, /@media \(max-width: 650px\)/);
  assert.match(css, /\.search-controls \{ grid-template-columns: minmax\(0, 1fr\); \}/);
  assert.match(css, /\.city-nav \{ justify-content: flex-start; gap: 4px; \}/);
  assert.match(css, /\.compare-table-wrap \{ max-inline-size: 100%; overflow-x: auto;/);
});
test("UI-001 preserves accessible navigation and demo-only boundaries", () => {
  assert.match(layout, /skip-link/);
  assert.match(layout, /index: false, follow: false/);
  assert.match(header, /aria-label="Browse cities"/);
  assert.match(header, /All listings are fictional/);
  assert.match(search, /<label htmlFor="q">/);
});
