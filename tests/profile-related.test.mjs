import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { demoListings, getListings, getListingPath } from "../lib/directory.ts";

test("related fictional profiles are scoped to each city and exclude the active profile", () => {
  for (const active of demoListings) {
    const related = getListings(active.city).filter(item => item.id !== active.id).slice(0, 3);
    assert.equal(related.length, 1);
    assert.ok(related.every(item => item.city === active.city && item.id !== active.id));
    assert.ok(related.every(item => getListingPath(item).startsWith("/" + active.city + "/listing/")));
  }
});

test("profile uses city-only related links with invented editorial labelling", () => {
  const source = readFileSync(new URL("../app/[city]/listing/[slug]/page.tsx", import.meta.url), "utf8");
  assert.match(source, /getListings\(city\.slug\)\.filter\(item => item\.id !== listing\.id\)/);
  assert.match(source, /getListingPath\(item\)/);
  assert.match(source, /More fictional profiles in \{city\.name\}/);
  assert.match(source, /not recommendations of real people or businesses/);
  assert.doesNotMatch(source, /window\.location|localStorage|fetch\(/);
});
