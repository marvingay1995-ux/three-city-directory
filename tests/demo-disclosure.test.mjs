import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("fictional preview does not claim actual age verification", () => {
  const home = read("app/page.tsx");
  const ui = read("components/directory-ui.tsx");
  assert.doesNotMatch(home, /age-gated concept styling/i);
  assert.match(home, /No age verification is implemented/);
  assert.match(ui, /No age verification, contact or transactions/);
  assert.match(ui, /All listings are fictional/);
  assert.match(home, /Every profile is invented/);
});
