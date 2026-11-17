import test from "node:test";
import assert from "node:assert/strict";
import { getCity, getListings, normalizeCategory, normalizeSearchQuery } from "../lib/directory.ts";

test("category input selects the first recognized slug", () => {
  assert.equal(normalizeCategory(["", "\ufffd", "unknown", "  LIFESTYLE ", "creative"]), "lifestyle");
  assert.equal(normalizeCategory(["creative", "lifestyle"]), "creative");
  for (const invalid of [undefined, null, 42, {}, [], ["", "\u0000creative"], "unknown"]) {
    assert.equal(normalizeCategory(invalid), undefined);
  }
});

for (const [city, creative, lifestyle] of [
  ["dubai", "d1", "d2"],
  ["muscat", "m1", "m2"],
  ["doha", "q1", "q2"],
]) {
  test(`${city} combines case-insensitive search and category without leaking other cities`, () => {
    const results = (q, category) =>
      getListings(city, normalizeSearchQuery(q), normalizeCategory(category)).map(({ id }) => id);

    assert.deepEqual(results(["", "  CrEaTiVe  ", "lifestyle"], ["invalid", "creative"]), [creative]);
    assert.deepEqual(results("creative", "lifestyle"), []);
    assert.deepEqual(results(undefined, "lifestyle"), [lifestyle]);
    assert.deepEqual(results(" ", ["unknown", "\ufffd"]), [creative, lifestyle]);
  });
}

test("unknown city has no configuration or listings", () => {
  assert.equal(getCity("unknown"), undefined);
  assert.deepEqual(getListings("unknown", "creative", "creative"), []);
});
