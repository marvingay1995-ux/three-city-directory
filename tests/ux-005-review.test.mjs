import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const visual = readFileSync(new URL("../tools/visual-acceptance.mjs", import.meta.url), "utf8");

test("full-site review covers 17 genuine browser captures including all three cities", () => {
  const entries = [...visual.matchAll(/^\s*\["([^"]+)",\s*"([^"]+)",\s*(\d+),\s*(\d+)\],?$/gm)];
  assert.equal(entries.length, 17);
  assert.equal(new Set(entries.map(m=>m[1])).size, 17);
  for (const name of [
    "home-desktop","home-mobile","home-narrow-320",
    "muscat-directory-desktop","muscat-directory-mobile","muscat-directory-narrow-320","muscat-zero-results",
    "muscat-search-filter","muscat-sorted","muscat-profile-desktop","muscat-profile-mobile",
    "dubai-directory","dubai-directory-mobile","dubai-profile-mobile",
    "doha-directory","doha-directory-mobile","doha-profile-mobile",
  ]) assert.ok(entries.some(m=>m[1]===name), name);
});

test("review gallery offers full-size image links, anchors and manual acceptance criteria", () => {
  for(const term of ["reviewLinks", "reviewCards", "Human visual acceptance rubric", "Open full-size image", "manual signoff required", "screenshots"]) {
    assert.ok(visual.toLowerCase().includes(term.toLowerCase()), term);
  }
  assert.match(visual, /loopback only/);
  assert.match(visual, /noindex, nofollow/);
  assert.match(visual, /sha256/);
  assert.match(visual, /File|files may be opened locally/i);
});
