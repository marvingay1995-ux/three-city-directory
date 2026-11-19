import test from "node:test";
import assert from "node:assert/strict";
import { getListings, normalizeListingSort, normalizeCategory, normalizeSearchQuery } from "../lib/directory.ts";
import { readFileSync } from "node:fs";

test("sort normalization accepts only explicit allowlisted values", () => {
  for (const value of ["original", "name-asc", "name-desc"]) assert.equal(normalizeListingSort(value), value);
  assert.equal(normalizeListingSort(["invalid", "name-desc"]), "name-desc");
  for (const bad of [null, undefined, 42, [], {}, "Name-Asc", "__proto__", "featured", "name-asc\u0000"]) {
    assert.equal(normalizeListingSort(bad), "original");
  }
});

test("original sorting preserves every city's existing organic order", () => {
  for (const [city, order] of [["dubai", ["d1", "d2"]], ["muscat", ["m1", "m2"]], ["doha", ["q1", "q2"]]]) {
    assert.deepEqual(getListings(city, "", undefined, "original").map(x => x.id), order);
    assert.deepEqual(getListings(city).map(x => x.id), order);
  }
});

test("alphabetical sorting works within the city while retaining filters and sponsor disclosure", () => {
  assert.deepEqual(getListings("dubai", "", undefined, "name-asc").map(x => x.title), ["City Concierge", "Creative Studio"]);
  assert.deepEqual(getListings("dubai", "", undefined, "name-desc").map(x => x.title), ["Creative Studio", "City Concierge"]);
  assert.deepEqual(getListings("muscat", "", undefined, "name-asc").map(x => x.title), ["Design Workshop", "Local Experiences"]);
  assert.deepEqual(getListings("doha", "", undefined, "name-asc").map(x => x.title), ["Community Guide", "Modern Atelier"]);
  assert.deepEqual(getListings("unknown", "", undefined, "name-desc"), []);
  assert.deepEqual(getListings("dubai", normalizeSearchQuery("creative"), normalizeCategory("creative"), "name-asc").map(x => x.id), ["d1"]);
  assert.deepEqual(getListings("dubai", "creative", "lifestyle", "name-desc"), []);
  assert.equal(getListings("dubai", "", undefined, "name-asc").find(x => x.id === "d1")?.sponsoredExample, true);
});

test("city search markup retains category and sort across search and filter navigation", () => {
  const city = readFileSync(new URL("../app/[city]/page.tsx", import.meta.url), "utf8");
  const search = readFileSync(new URL("../components/directory-search.tsx", import.meta.url), "utf8");
  assert.match(city, /normalizeListingSort\(input\.sort\)/);
  assert.match(city, /sortHref\(path, query, category, "name-asc"\)/);
  assert.match(city, /categoryHref\(path, query, slug, sort\)/);
  assert.match(search, /name="sort"/);
  assert.match(search, /name="category"/);
});
