import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const source=readFileSync(new URL("../lib/directory.ts",import.meta.url),"utf8");
test("all three city slugs exist",()=>{for(const slug of ["dubai","muscat","doha"])assert.match(source,new RegExp(`slug:"${slug}"`));});
test("six fictional listings are present",()=>assert.equal((source.match(/description:"Fictional demonstration business profile."/g)||[]).length,6));
test("no real contact or payment data",()=>assert.doesNotMatch(source,/https?:\/\/|@|\+\d{8,}/));
