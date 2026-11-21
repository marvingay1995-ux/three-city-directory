import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");

test("gallery has two existing fictional accessible thumbnail controls", () => {
  const source = read("components/demo-gallery.tsx");
  assert.match(source, /key: "overview", label: "Overview image placeholder"/);
  assert.match(source, /key: "detail", label: "Detail image placeholder"/);
  assert.match(source, /aria-pressed=\{active === frame.key\}/);
  assert.match(source, /role="img"/);
  assert.match(source, /not a photograph/);
  assert.match(source, /No real images, individuals or services are represented/);
});

test("gallery navigation supports next, previous and keyboard arrows with focus", () => {
  const source = read("components/demo-gallery.tsx");
  for (const action of ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "Home", "End"]) {
    assert.ok(source.includes(`event.key === "${action}"`), action);
  }
  assert.match(source, /onClick=\{\(\) => switchTo\(index - 1\)\}/);
  assert.match(source, /onClick=\{\(\) => switchTo\(index \+ 1\)\}/);
  assert.match(source, /picker.current\[next\]\?\.focus\(\)/);
  assert.match(source, /aria-live="polite"/);
  assert.match(source, /\(nextIndex \+ frames.length\) % frames.length/);
});

test("gallery remains local CSS-only with no external image or media upload", () => {
  const source = read("components/demo-gallery.tsx");
  assert.doesNotMatch(source, /fetch\(|XMLHttpRequest|localStorage|sessionStorage|https?:\/\/|<img|<video|<iframe|FileReader|URL\.createObjectURL/);
  const css = read("app/style.css");
  assert.match(css, /\.gallery-nav-button:focus-visible/);
  assert.match(css, /aspect-ratio:4\/5/);
  assert.match(css, /prefers-reduced-motion:reduce/);
});
