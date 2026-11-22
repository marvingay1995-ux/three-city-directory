import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const form = readFileSync(new URL("../components/account-demo.tsx", import.meta.url), "utf8");
const page = readFileSync(new URL("../app/account/page.tsx", import.meta.url), "utf8");
const header = readFileSync(new URL("../components/directory-ui.tsx", import.meta.url), "utf8");
test("UI-005 provides navigable demo registration, login and recovery", () => {
  for (const term of ["Create an account","Sign in","Recover access","Visitor","Advertiser","Preview registration","Preview sign in","Preview recovery"]) assert.ok(form.includes(term), term);
  assert.match(page, /<AccountDemo\s*\/>/);
  assert.match(header, /href="\/account"/);
});
test("UI-005 does not create real credentials, sessions or remote requests", () => {
  assert.match(form, /No accounts are created/);
  assert.doesNotMatch(form, /fetch\(|localStorage|sessionStorage|setCookie|document\.cookie|axios|https?:\/\//);
});
