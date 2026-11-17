import assert from "node:assert/strict";
import test from "node:test";
import { cities, demoListings, getCity, getListing, getListingPath, getListings } from "../lib/directory.ts";

const profilePaths = [
  "/dubai/listing/creative-studio",
  "/dubai/listing/city-concierge",
  "/muscat/listing/design-workshop",
  "/muscat/listing/local-experiences",
  "/doha/listing/modern-atelier",
  "/doha/listing/community-guide",
];

test("six distinct profile paths round-trip to the correct city and listing", () => {
  assert.deepEqual(demoListings.map(getListingPath), profilePaths);
  for (const listing of demoListings) {
    assert.equal(getListing(listing.city, listing.slug), listing);
  }
});

test("all profiles are isolated from the other city routes", () => {
  for (const listing of demoListings) {
    for (const { slug } of cities.filter((city) => city.slug !== listing.city)) {
      assert.equal(getListing(slug, listing.slug), undefined);
    }
  }
});

test("unknown cities and invalid listing slugs are rejected", () => {
  assert.equal(getCity("unlisted-city"), undefined);
  for (const { slug } of cities) {
    for (const listingSlug of ["", "unknown", "../creative-studio", "%FF", "Creative-Studio"]) {
      assert.equal(getListing(slug, listingSlug), undefined);
    }
  }
});

test("the fictional sponsor example keeps the original search and directory order", () => {
  assert.deepEqual(demoListings.filter((listing) => listing.sponsoredExample).map(getListingPath), [profilePaths[0]]);
  for (const { slug } of cities) {
    assert.deepEqual(getListings(slug).map(getListingPath), profilePaths.filter((path) => path.startsWith(`/${slug}/`)));
  }
  assert.deepEqual(getListings("dubai", "  CrEaTiVe  ", "creative").map(getListingPath), [profilePaths[0]]);
  assert.deepEqual(getListings("dubai", "creative", "lifestyle"), []);
});
