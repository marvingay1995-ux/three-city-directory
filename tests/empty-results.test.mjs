import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { getListings } from "../lib/directory.ts";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");

test("zero-match alternatives remain city-scoped and use only existing fictional fixtures", () => {
  for (const city of ["dubai", "muscat", "doha"]) {
    assert.deepEqual(getListings(city, "intentionally-no-matches"), []);
    const examples = getListings(city);
    assert.equal(examples.length, 2);
    assert.ok(examples.every(item => item.city === city));
  }
});

test("empty-state links provide separate query and category recovery while retaining sort", () => {
  const source = read("components/empty-results.tsx");
  assert.match(source, /recoveryHref\(city, "", category, sort\)/);
  assert.match(source, /recoveryHref\(city, query, undefined, sort\)/);
  assert.match(source, /if \(sort !== "original"\) params\.set\("sort", sort\)/);
  assert.match(source, /Browse all \{cityName\} examples/);
  assert.match(source, /getListingPath\(item\)/);
  assert.match(source, /alternatives\.slice\(0, 2\)/);
  assert.match(source, /suggestions are invented/);
});

test("city route wires only city-filtered synthetic alternatives on empty result", () => {
  const city = read("app/[city]/page.tsx");
  assert.match(city, /const alternatives = listings\.length \? \[\] : getListings\(city\.slug\)/);
  assert.match(city, /<EmptyResults city=\{city\.slug\} cityName=\{city\.name\}/);
});
