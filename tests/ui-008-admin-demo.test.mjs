import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const component = readFileSync(new URL("../components/admin-demo.tsx", import.meta.url), "utf8");
const page = readFileSync(new URL("../app/admin-demo/page.tsx", import.meta.url), "utf8");
test("UI-008 shows fictional moderation queue and review actions", () => {
  for (const label of ["Review queue", "Approve in demo", "Reject in demo", "Decision reason (required)", "Temporary decision history", "Reset demo"]) assert.ok(component.includes(label), label);
  assert.match(page, /<AdminDemo\s*\/>/);
});
test("UI-008 remains a public non-publishing prototype without persistence", () => {
  assert.match(component, /not a secure administrator area/);
  assert.match(component, /Nothing is approved or published on the live directory/);
  assert.doesNotMatch(component, /fetch\(|localStorage|sessionStorage|document\.cookie|axios|https?:\/\//);
});
