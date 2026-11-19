import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("fictional profile gallery has an accessible local-only selector", () => {
  const gallery = read("components/demo-gallery.tsx");
  assert.match(gallery, /"use client"/);
  assert.match(gallery, /useState/);
  assert.match(gallery, /aria-pressed=\{active === frame\.key\}/);
  assert.match(gallery, /Overview image placeholder/);
  assert.match(gallery, /Detail image placeholder/);
  assert.match(gallery, /No real images, individuals or services/);
  assert.doesNotMatch(gallery, /https?:\/\/|fetch\(|XMLHttpRequest|navigator\.|localStorage|sessionStorage/);
});

test("profile includes its fictional gallery and same-city navigation", () => {
  const source = read("app/[city]/listing/[slug]/page.tsx");
  assert.match(source, /DemoGallery title=\{listing\.title\}/);
  assert.match(source, /Explore more in \{city\.name\}/);
  assert.match(source, /Reporting is unavailable in this demo/);
  assert.match(source, /Back to the \{city\.name\} directory/);
});
