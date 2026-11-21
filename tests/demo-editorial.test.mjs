import test from "node:test";
import assert from "node:assert/strict";
import { demoListings, getListings } from "../lib/directory.ts";
import { demoEditorial, getDemoEditorial } from "../lib/demo-editorial.ts";
import { readFileSync } from "node:fs";

test("six source fixtures retain identifiers, routes, original descriptions and independent fictional identities", () => {
  assert.equal(demoListings.length, 6);
  assert.deepEqual(Object.keys(demoEditorial).sort(), demoListings.map(x=>x.id).sort());
  assert.equal(new Set(Object.values(demoEditorial).map(x=>x.tagline)).size, 6);
  assert.equal(new Set(Object.values(demoEditorial).map(x=>x.theme)).size, 6);
  for (const item of demoListings) {
    assert.equal(item.description, "Fictional demonstration business profile.");
    const editorial = getDemoEditorial(item.id);
    assert.ok(editorial);
    assert.ok(editorial.tagline.length >= 10);
    assert.ok(editorial.summary.length >= 35);
    assert.equal(editorial.highlights.length, 3);
    assert.equal(editorial.highlights.every(x=>typeof x === "string" && x.length > 2), true);
  }
  assert.equal(getDemoEditorial("__proto__"), undefined);
  assert.equal(getDemoEditorial("non-existent"), undefined);
});

test("new editorial copy contains no real-world contact, payment or booked-service instructions", () => {
  const content = JSON.stringify(demoEditorial);
  assert.doesNotMatch(content, /https?:\/\/|@[a-z0-9_.]+|\+\d{8,}|\b(whatsapp|telegram|book now|deposit|escort|payment|crypto|verified person)\b/i);
});

test("existing city isolation and organic fixture order remain intact", () => {
  assert.deepEqual(getListings("dubai").map(x=>x.id), ["d1","d2"]);
  assert.deepEqual(getListings("muscat").map(x=>x.id), ["m1","m2"]);
  assert.deepEqual(getListings("doha").map(x=>x.id), ["q1","q2"]);
});

test("profile and card render invented editorial themes with correct fictional labels", () => {
  const profile = readFileSync(new URL("../app/[city]/listing/[slug]/page.tsx",import.meta.url),"utf8");
  const compare = readFileSync(new URL("../components/demo-compare.tsx",import.meta.url),"utf8");
  assert.match(profile,/getDemoEditorial\(listing.id\)/);
  assert.match(profile,/editorial.highlights.map/);
  assert.match(profile,/invented editorial themes, not offered services/);
  assert.match(compare,/getDemoEditorial\(item.id\)/);
  assert.match(compare,/Editorial theme/);
});
