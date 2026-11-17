import test from "node:test";
import assert from "node:assert/strict";
import { getListings, normalizeSearchQuery } from "../lib/directory.ts";

for (const [city, term, matchingId, otherId] of [
  ["dubai", "studio", "d1", "d2"],
  ["muscat", "workshop", "m1", "m2"],
  ["doha", "atelier", "q1", "q2"],
]) {
  const search = (query) => getListings(city, normalizeSearchQuery(query)).map(({ id }) => id);

  test(`${city} search matches names case-insensitively and stays city-scoped`, () => {
    assert.deepEqual(search(term), [matchingId]);
    assert.deepEqual(search(`  ${term.toUpperCase()}  `), [matchingId]);
    assert.deepEqual(search("creative"), [matchingId]);
  });

  test(`${city} search uses the first usable repeated parameter`, () => {
    assert.deepEqual(search(["", "  ", "\ufffd", term, "lifestyle"]), [matchingId]);
    assert.deepEqual(search(["lifestyle", term]), [otherId]);
  });

  test(`${city} empty search returns only that city's listings`, () => {
    for (const query of [undefined, "", "  ", ["", " "]]) {
      assert.deepEqual(search(query), [matchingId, otherId]);
    }
  });
}

test("normalization safely handles malformed values and preserves display case", () => {
  assert.equal(normalizeSearchQuery([null, 3, {}, ["studio"], "bad\u0000term", "\ufffd", "  Creative  "]), "Creative");
  for (const query of [null, 3, {}, [], "\ufffd", "bad\u0000term"]) {
    assert.equal(normalizeSearchQuery(query), "");
  }
});
