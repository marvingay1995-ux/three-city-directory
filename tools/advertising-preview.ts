import { createAdvertisingPrototype } from "../lib/advertising/prototype.ts";
import { disclosure } from "../lib/advertising/policy.ts";
import { getListings } from "../lib/directory.ts";

const prototype = createAdvertisingPrototype();
const cases = [
  ["dubai", "dubai-first", ["submit", "start_review", "decide", "schedule", "complete"]],
  ["muscat", "muscat-sample", ["submit", "start_review", "decide"]],
  ["doha", "doha-sample", ["submit", "start_review", "decide"]],
] as const;
const rows = cases.map(([city, campaignId, actions]) => {
  for (const [expectedRevision, action] of actions.entries()) {
    const result = prototype.apply({
      requestId: action, city, campaignId, action, expectedRevision,
      at: action === "complete" ? "2026-02-11T00:00:00.000Z" : "2026-02-02T00:00:00.000Z",
    });
    if (!result.ok) throw new Error(result.code);
  }
  const result = prototype.list(city)?.find((item) => item.id === campaignId);
  if (!result) throw new Error("Missing fixture campaign");
  return [city, result] as const;
});
const escape = (value: string) => value.replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[char] ?? char);
const organic = getListings("dubai");
const sample = rows[0][1];
const sponsored = organic.find(({ id }) => id === sample.listingId);
if (!sponsored) throw new Error("Missing fictional listing");

console.log(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'">
<title>Offline advertising prototype</title>
<style>
:root { color-scheme:dark; color:#f4f2ec; background:#111419; font:1rem/1.55 system-ui,sans-serif }
* { box-sizing:border-box } body { margin:0 }
main { max-inline-size:1100px; margin-inline:auto; padding:clamp(16px,5vw,56px) }
h1 { font-size:clamp(2rem,6vw,3.6rem); line-height:1.08; margin-block:.2em }
h2,h3,p { margin-block:0 .55em } p { color:#bdc0c8 }
.notice { color:#e3cb92; font-weight:700 }
.grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr)); gap:16px; margin-block:28px }
aside,section { border:1px solid #414650; background:#1c2026; padding:20px; border-radius:14px }
aside { border-color:#e3cb92; background:#2c271f }
aside h2 { color:#e3cb92 }
ol,ul { padding-inline-start:1.5em; margin-block:0 }
li { margin-block:.35em; overflow-wrap:anywhere }
</style>
</head>
<body><main>
<p class="notice">Offline prototype · fictional listings</p>
<h1>Sponsored placements</h1>
<p>Dubai directory example and campaign outcomes from a fixed simulation.</p>
<div class="grid">
<aside aria-labelledby="sponsored"><h2 id="sponsored">${disclosure}</h2>
<h3>${escape(sponsored.title)}</h3>
<p>Dubai · Creative category panel</p>
<p>Fictional placement shown for design review.</p></aside>
<section aria-labelledby="organic"><h2 id="organic">Organic results</h2>
<ol>${organic.map(({ title }) => `<li>${escape(title)}</li>`).join("")}</ol></section>
</div>
<section aria-labelledby="outcomes"><h2 id="outcomes">Simulated campaign outcomes</h2>
<ul>${rows.map(([city, { status, review }]) => `<li><strong>${city[0].toUpperCase() + city.slice(1)}</strong> · ${status.replaceAll("_", " ")} · ${review?.reason ?? ""}</li>`).join("")}</ul>
</section></main></body></html>`);
