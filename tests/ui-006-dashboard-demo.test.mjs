import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const dashboard = readFileSync(new URL("../components/dashboard-demo.tsx", import.meta.url), "utf8");
const page = readFileSync(new URL("../app/dashboard/page.tsx", import.meta.url), "utf8");
const account = readFileSync(new URL("../components/account-demo.tsx", import.meta.url), "utf8");
test("UI-006 provides visitor and advertiser dashboard previews", () => {
  for (const label of ["Visitor preview", "Advertiser preview", "Saved examples", "Plan preview", "Listing preview", "Overview"]) assert.ok(dashboard.includes(label), label);
  assert.match(page, /<DashboardDemo\s*\/>/);
  assert.match(account, /href="\/dashboard"/);
});
test("UI-006 does not persist data, authenticate or activate advertisements", () => {
  assert.match(dashboard, /No account, login session, stored favorites/);
  assert.match(dashboard, /Creation and publication are disabled/);
  assert.doesNotMatch(dashboard, /fetch\(|localStorage|sessionStorage|document\.cookie|axios|https?:\/\//);
});
