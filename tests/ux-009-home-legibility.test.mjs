import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../app/style.css", import.meta.url), "utf8");

test("UX-009 supersedes the older 12px mobile introductory copy", () => {
  const section = css.slice(css.indexOf("/* UX-009 — correct mobile homepage"), css.indexOf("/* UI-001 — narrow-screen overflow"));
  assert.ok(section.startsWith("/* UX-009"));
  assert.match(section, /@media \(max-width:620px\)/);
  assert.match(section, /\.home-hero \.hero-detail\s*\{\s*font-size:\.92rem !important/);
  assert.match(section, /\.studio-panel p\s*\{\s*font-size:\.92rem/);
  assert.match(section, /line-height:1\.7/);
});

test("UX-009 does not hide or truncate any content", () => {
  const section = css.slice(css.indexOf("/* UX-009 — correct mobile homepage"), css.indexOf("/* UI-001 — narrow-screen overflow"));
  assert.doesNotMatch(section, /display:\s*none|overflow:\s*hidden|text-overflow|line-clamp/);
});
