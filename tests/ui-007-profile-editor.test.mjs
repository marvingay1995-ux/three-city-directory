import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const editor = readFileSync(new URL("../components/profile-editor-demo.tsx", import.meta.url), "utf8");
const page = readFileSync(new URL("../app/profile-editor/page.tsx", import.meta.url), "utf8");
const dashboard = readFileSync(new URL("../components/dashboard-demo.tsx", import.meta.url), "utf8");
test("UI-007 provides an editable fictional profile with preview", () => {
  for (const value of ["Dubai", "Muscat", "Doha", "Creative", "Lifestyle", "Preview card", "Review fictional draft", "Reset example"]) assert.ok(editor.includes(value), value);
  assert.match(page, /<ProfileEditorDemo\s*\/>/);
  assert.match(dashboard, /href="\/profile-editor"/);
});
test("UI-007 does not store, upload or publish real profiles", () => {
  assert.match(editor, /does not save data, upload images/);
  assert.match(editor, /Nothing was submitted or published/);
  assert.doesNotMatch(editor, /fetch\(|localStorage|sessionStorage|document\.cookie|FormData|https?:\/\//);
});
