# SEC-014 — Candidate sponsored advertising product

**Design-only specification; no live offer, ad inventory, client or pricing is approved.** Paid content must not be indistinguishable from organic listings.

## Candidate placements to evaluate (no build authorization)

| Candidate | Hypothetical presentation | Integrity requirement | Decision |
| --- | --- | --- | --- |
| City sponsored card | A discrete sponsored card on a Muscat directory route | Persistent text label “Sponsored”; never presented as algorithmic/organic recommendation or verified endorsement | PROPOSED |
| Category sponsored card | Eligible placement scoped to an approved category | Label visible at mobile widths, independent of color and position; no cross-city leakage | PROPOSED |
| Sponsored editorial feature | Clearly separated paid feature page, distinct from organic profile | Both prominent sponsorship and accurate advertiser identity disclosure after legal review; claims and intellectual-property permissions verified | DEFERRED |
| Priority ranking in organic list | Payment alters purportedly organic order | Incompatible with honest separation unless surfaced as explicitly sponsored inventory | REJECT AS UNDISCLOSED RANKING |
| Pop-up, contact handoff or direct solicitation | Interruptive promotion or communication to users | Adds privacy/contact, service and safety obligations beyond current scope | EXCLUDED |

No fixed slot count, placement visibility, impressions, reach or inventory yield is evidenced. Fictional demo sponsorship styling must remain labeled and cannot be sold.

## Proposed review and publishing controls

**Proposed lifecycle (not implemented):** draft → advertiser identity and category screening → rights/claim verification → independent manual creative decision → scheduled eligibility gate → publication only after exact approval → continuous complaint/takedown/expiry → retention/appeal disposition.

Required proofs before any actual operation:
- Advertiser legal identity, authorized representative, licensing/classification and eligibility for the specific city and category; no self-verified or auto-approved claims.
- Source/license/consent provenance for each image and claim; no real personal images or unverifiable testimonials.
- Explicit sponsor label and advertiser disclosure, understandable to screen readers and legible on narrow mobile. Avoid endorsements/verified badges without substantiation.
- Clear separation of advertising placements from organic relevance ordering; sponsored candidates must not contaminate unsponsored ranking or city scope.
- Human review, emergency suspension, complaint/removal/appeal routes, conflict-of-interest controls and immutable review evidence consistent with future authorized data retention rules.
- Frequency, dates, creative version, city/category targeting and eligibility decisions, all fail-closed if incomplete, stale, suspended, ineligible or unapproved.
- Data minimization: campaign reporting concepts may use only aggregated, privacy-approved measures *after separate authorization*; no pixels, profiling, precise location, behavioral tracking or personal-level analytics now.
- Accessible and localized disclosure only after independent review; actual Arabic requirements and translations not decided.

## Explicit prohibitions and scope boundaries

No real advertiser onboarding, ad delivery, public campaigns, conversion tracking, payment collection, contact forwarding, booking, third-party audience import or external ad network activation. No regulated/sexual-service/escort content, unlawful services, deceptive advertising, impersonation or exploitation-related material. Do not propose that “not promoted publicly” creates a legal or platform-policy exemption.

## Tests to design in a later authorized engineering phase

Negative tests for missing/invalid business identity, denied category, wrong city, absent sponsor disclosure, altered creative after approval, unauthorized approval, invalid start/end dates, expired permissions, removed licensing, takedown override, missing rights and data leakage. Test color contrast, screen reader labels, 320px presentation and organic ranking determinism. Existing synthetic tests are not a substitute for real production safeguards.

**None of these features are authorized for implementation by SEC-014.**
