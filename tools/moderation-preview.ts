import { createModerationPrototype } from "../lib/moderation/prototype.ts";
import type { CitySlug } from "../lib/domain/model.ts";
import type { ModerationAction } from "../lib/moderation/policy.ts";

const prototype = createModerationPrototype();
const steps = [
  ["dubai", "review-d2", "owner-dubai", "submit"],
  ["dubai", "review-d2", "moderator-dubai", "start_review"],
  ["dubai", "review-d2", "moderator-dubai", "approve", "meets-demo-policy"],
  ["muscat", "review-m1", "owner-muscat", "submit"],
  ["muscat", "review-m1", "moderator-muscat", "start_review"],
  ["muscat", "review-m1", "moderator-muscat", "reject", "missing-demo-details"],
  ["doha", "review-q1", "owner-doha", "submit"],
  ["doha", "review-q1", "moderator-doha", "start_review"],
  ["doha", "review-q1", "moderator-doha", "approve", "meets-demo-policy"],
  ["doha", "review-q1", "administrator-demo", "publish"],
] as const;
const revisions = new Map<string, number>();
for (const [index, [city, listingId, actorRef, action, reasonCode]] of steps.entries()) {
  const revision = revisions.get(listingId) ?? 0;
  const result = prototype.apply({
    requestId: `preview-${index + 1}`, actorRef, city, listingId, action, reasonCode, expectedRevision: revision,
    occurredAt: `2026-01-02T00:${String(index).padStart(2, "0")}:00.000Z`,
  });
  if (!result.ok) throw new Error(`Unable to prepare preview: ${result.code}`);
  revisions.set(listingId, result.receipt.listing.revision);
}
const labels: Record<ModerationAction, string> = {
  submit: "Submitted", start_review: "Review started", approve: "Approved",
  reject: "Rejected", reconsider: "Returned to draft", publish: "Published in simulation",
};
const cities: readonly [CitySlug, string][] = [["dubai", "Dubai"], ["muscat", "Muscat"], ["doha", "Doha"]];
const escape = (value: string) => value.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[character] ?? character);

const sections = cities.map(([city, name]) => {
  const snapshot = prototype.inspect(`moderator-${city}`, city);
  if (!snapshot) throw new Error("Fixture reviewer must have city access");
  return `<section aria-labelledby="${city}">
    <h2 id="${city}">${name}</h2>
    <ul class="queue" aria-label="${name} review queue">${snapshot.listings.map((listing) =>
      `<li><strong>${escape(listing.title)}</strong><span>${listing.status.replaceAll("_", " ")} · rev ${listing.revision}</span></li>`,
    ).join("")}</ul>
    <h3>Audit timeline</h3>
    <ol class="timeline">${snapshot.audits.map((event) =>
      `<li><time datetime="${event.occurredAt}">${event.occurredAt.slice(11, 16)} UTC</time>
        <strong>${labels[event.action]}</strong>
        <small>${escape(event.actorRef)} · ${escape(event.targetId)} · rev ${event.revision}
        ${event.reasonCode ? ` · ${escape(event.reasonCode)}` : ""}</small></li>`,
    ).join("")}</ol>
  </section>`;
}).join("");

console.log(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'">
<title>Moderation prototype · Three City Directory</title>
<style>
:root { color-scheme:dark; background:#111419; color:#f4f2ec; font:1rem/1.5 system-ui,sans-serif }
* { box-sizing:border-box }
body { margin:0 }
main { max-inline-size:1160px; margin-inline:auto; padding:clamp(16px,4vw,48px) }
h1 { font-size:clamp(2rem,6vw,3.8rem); line-height:1.1; margin-block:.25em }
p,small,time { color:#b7bac2 }
.notice { color:#e3cb92; font-weight:700 }
.grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,310px),1fr)); gap:16px; margin-block-start:28px }
section { background:#1c2026; border:1px solid #414650; border-radius:14px; padding:20px }
h2,h3 { margin-block:0 .65em }
ul,ol { padding:0; margin:0; list-style:none }
.queue { margin-block-end:22px }
.queue li,.timeline li { border-block-start:1px solid #414650; padding-block:10px }
.queue span,small { display:block; overflow-wrap:anywhere }
.queue span { color:#e3cb92 }
time { margin-inline-end:6px; font-variant-numeric:tabular-nums }
</style>
</head>
<body>
<main>
<header>
<p class="notice">Offline prototype · fictional data</p>
<h1>Moderation queue</h1>
<p>Read-only examples from independent city-scoped reviewer snapshots. Publication here is simulated.</p>
</header>
<div class="grid">${sections}</div>
</main>
</body>
</html>`);
