import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
test("home page links to city routes", () => {const home=read("app/page.tsx");assert.match(home,/cities\.map/);assert.match(home,/href=\{`\/\$\{city\.slug\}`\}/);});
test("city route rejects unknown slugs", () => {const page=read("app/[city]/page.tsx");assert.match(page,/if\(!city\)notFound\(\)/);});
test("demo-only release boundaries remain explicit", () => {const readme=read("README.md");for(const term of ["No deployment","No authentication","No payments"])assert.ok(readme.toLowerCase().includes(term.toLowerCase())||readme.includes("No authentication, contact, booking, checkout, payment processing"));});
test("robots are set to noindex", () => assert.match(read("app/layout.tsx"),/index: false/));
