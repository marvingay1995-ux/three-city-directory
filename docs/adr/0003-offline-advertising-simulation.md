# ADR-0003 — Offline advertising simulation

Status: proposed for Phase 5 review.

## Boundary and allocation

The simulator validates references against the six existing fictional listings and uses three synthetic placements and four synthetic campaign cases. Phase 3's advertising sketches remain untouched. The public directory continues to read its original fixture array and uses the same search, filters, ordering, sponsored example disclosure and noindex metadata. Nothing in the public app imports the simulator.

| Placement | City scope | Category scope | Slot |
| --- | --- | --- | --- |
| Dubai creative | Dubai | Creative | Category panel |
| Muscat lifestyle | Muscat | Lifestyle | Category panel |
| Doha directory | Doha | Any currently known demo category | Directory panel |

Category panels require an exact category match to the placement and listing. A directory panel may omit the category. When specified, the category must match the listing. A request identifies a registered placement and its exact slot. Unknown or mismatched inputs fail closed. Only registered fictional listings and creative references in the same city can pass.

First successful scheduling reserves one placement over its half-open UTC window. Overlapping scheduled or completed scenarios are excluded. Cancellation releases a simulated reservation. There is no auction, ranking boost, paid ordering or audience selection. The offline HTML renders the sponsored sample and unchanged organic ordering as distinct labeled regions.

## Policy and lifecycle

The pure review checks fictional content classification, the exact simulation disclosure, project fixture provenance, rights status, an offline destination and placement eligibility. Denied rights, third-party sources, external destinations and out-of-scope content yield reason-coded rejection. Unclassified content or unresolved source or rights yields a reason-coded blocked decision for manual policy review. A blocked fixture cannot resume through this prototype. Cancel and define a new reviewed fixture to model revised inputs.

```text
draft -> submitted -> under_review -> approved -> simulated_scheduled -> simulated_completed
                                  -> rejected (terminal)
                                  -> blocked
Open states including blocked and simulated_scheduled -> cancelled
```

Approval is separate from scheduling. Schedule on or before the start, complete at or after the end. Expired windows reject submission, review and scheduling. Each transition checks a monotonic fixture timestamp and expected revision. Exact successful retries keyed by city and request ID return the original detached receipt. A changed valid payload using the same key conflicts. Failed requests do not reserve keys or change campaigns. Transactions across workers, persistence and authenticated operators are outside the process-local model.

## Deferred jurisdiction and launch decisions

A fixture policy pass carries no authorization for actual publication. Obtain separate product-owner, legal and policy review in the UAE, Oman and Qatar before considering production. Open questions include permissible sectors and creative claims by jurisdiction, documented asset and destination rights, required disclosures and language, review/appeal and takedown procedures, and who owns policy changes. Production would also require independently reviewed server-side authorization, access controls, retention and concurrency. No targeting, reporting, tracking, billing, exposure counts or delivery is part of this prototype.

## Offline verification

Run `node tools/advertising-preview.ts > advertising-preview.html` with Node 22 and open the resulting file directly, outside the public route tree. It shows a completed Dubai simulation, a blocked Muscat fixture and a rejected Doha fixture. The results are lifecycle outcomes and contain no actual impressions or clicks.
