import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../tools/full-page-acceptance.mjs", import.meta.url), "utf8");
const workflow = readFileSync(new URL("../.github/workflows/private-visual-acceptance.yml", import.meta.url), "utf8");

test("full-page acceptance captures seven locally hosted pages, including below-fold mobile states", () => {
  for (const name of [
    "full-home-desktop", "full-home-mobile", "full-dubai-directory-mobile",
    "full-muscat-directory-mobile", "full-doha-directory-mobile",
    "full-muscat-profile-mobile", "full-muscat-zero-results",
  ]) assert.ok(source.includes('"' + name + '"'), name);
  assert.match(source, /captureBeyondViewport: true/);
  assert.match(source, /Page\.getLayoutMetrics/);
  assert.match(source, /Page\.captureScreenshot/);
  assert.match(source, /full_page_height/);
});

test("full-page capture enforces demo/noindex boundaries and retains offline artifact", () => {
  assert.match(source, /All listings are fictional/);
  assert.match(source, /meta\[name=robots\]/);
  assert.match(source, /width <= initial\.viewport \+ 2/);
  assert.match(source, /full-page-index\.html/);
  assert.match(source, /full-page-manifest\.json/);
  assert.match(source, /sha256/);
  assert.match(workflow, /node tools\/full-page-acceptance\.mjs/);
  assert.match(workflow, /retention-days: 14/);
});
