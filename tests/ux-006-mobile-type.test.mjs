import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../app/style.css", import.meta.url), "utf8");

test("mobile navigation labels and interactive targets receive legible styles", () => {
  const section = css.slice(css.indexOf("/* UX-006 — increase readability"));
  assert.ok(section.startsWith("/* UX-006"));
  assert.match(section, /@media \(max-width:620px\)/);
  for (const selector of [".city-nav a", ".category-nav a", ".sort-nav a"]) {
    const escaped = selector.replaceAll(".", "\\.").replaceAll(" ", "\\s+");
    assert.match(section, new RegExp(escaped + " \\{[^}]*min-height:44px"));
  }
  assert.match(section, /\.demo-gallery-note/);
  assert.match(section, /\.empty-recovery \.empty-disclaimer/);
  assert.match(section, /font-size:\.85rem/);
});

test("new typography rules do not hide fictional notices or overflow the page intentionally", () => {
  const section = css.slice(css.indexOf("/* UX-006 — increase readability"));
  assert.doesNotMatch(section, /display:\s*none|visibility:\s*hidden|overflow:\s*hidden|position:\s*absolute/);
});
