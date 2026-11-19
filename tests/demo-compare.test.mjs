import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { getListings, getListingPath } from "../lib/directory.ts";

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("fictional comparison requires no account, persistence, network, or personal information", () => {
  const source = read("components/demo-compare.tsx");
  assert.match(source, /"use client"/);
  assert.match(source, /useState/);
  assert.match(source, /const MAX_COMPARE = 2/);
  assert.match(source, /aria-pressed=/);
  assert.match(source, /Fictional demo — not verified/);
  assert.match(source, /No results are saved/);
  assert.doesNotMatch(source, /localStorage|sessionStorage|indexedDB|fetch\(|XMLHttpRequest|document\.cookie|mailto:|tel:/);
});

test("comparison is integrated only with current city-scoped directory results", () => {
  const page = read("app/[city]/page.tsx");
  assert.match(page, /getListings\(city\.slug, query, category, sort\)/);
  assert.match(page, /<DemoCompare listings=\{listings\} city=\{city\.name\}/);
  assert.match(page, /No matching demo listings/);
  const component = read("components/demo-compare.tsx");
  assert.match(component, /getListingPath\(item\)/);
  assert.match(component, /SponsoredExample/);
  assert.match(component, /Fictional profile/);
});

test("comparison fixture inputs retain separate cities and original ordering", () => {
  for (const city of ["dubai", "muscat", "doha"]) {
    const items = getListings(city);
    assert.equal(items.length, 2);
    assert.ok(items.every(item => item.city === city));
    assert.ok(items.every(item => getListingPath(item).startsWith(`/${city}/listing/`)));
  }
});
