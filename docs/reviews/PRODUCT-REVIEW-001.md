# Product Review 001 — Honest state and gap assessment

**Scope:** code-and-test evidence review of `main` as merged through PR #45 (`068725f08bfd653bea73bca8d91564a69b39ac0d`). Not a new independent visual inspection of the screenshot gallery, user study, security assessment, legal opinion or production-readiness signoff.

## Executive decision

**Continue as fictional, offline UI concept only.** The current application is an attractive but small demonstration of directory navigation. It is **not an adult-companionship advertising product**, not commercially deployable, and not a substantiated equivalent of any competitor. The owner's later stated intended direction is an adult-companionship advertising directory; the existing approved repository's `docs/PRODUCT_VISION.md`, `docs/PRD.md`, `docs/DESIGN_SYSTEM.md` and `AGENTS.md` still specify a general legitimate-business directory that excludes sexual services. This inconsistency must be explicitly resolved in a separately reviewed product specification **without** silently overriding the existing approval, security, or jurisdiction gates.

The user-approved visual improvements do not implicitly authorize adult advertising, real people, paid services, contact arrangements, hosting or launch.

## Evidence ledger

| Area | Verified implementation | Missing, unverified, or limited | Evidence |
| --- | --- | --- | --- |
| Main navigation | Homepage offers Dubai, Muscat and Doha; city route and manual city selector | No full user study or validated conversion funnel | `app/page.tsx`; `components/directory-ui.tsx` |
| Discovery | Search, Creative/Lifestyle categories, name A–Z and Z–A sorting, shareable URL state | No richer substantive taxonomy, facets, spelling suggestions, or meaningful real inventory | `app/[city]/page.tsx`; `lib/directory.ts` |
| Sample inventory | **Six fictional generic business profiles, exactly two per city**, with city isolation | No adult-companionship profiles or authentic advertisers; no verified individuals | `lib/directory.ts` |
| Profile detail | City breadcrumb, category, short description, artwork-view switch, verification explanation, inactive reporting | Both views are CSS-art placeholders, no genuine photo gallery, no usable action beyond browsing, no profile completeness measure | `app/[city]/listing/[slug]/page.tsx`; `components/demo-gallery.tsx` |
| Comparison | Up to two city-scoped fictional listings, local-only state; clear selection | Comparison relies on sparse duplicate metadata, so value to visitors is minimal | `components/demo-compare.tsx` |
| Sponsorship | One **synthetic** "Sponsored — example only" label | No active campaigns or payments. Paid ranking deliberately disabled | `lib/directory.ts`; `components/directory-ui.tsx` |
| Browser testing | Last verified main precursor PR #45 standard workflow and visual workflow passed; actual browser clicks tested gallery, compare, filters and 390px overflow. Previous visual workflow captured ten initial-render screenshots | Not a comprehensive 320px/375px/768px/1024px matrix, accessibility audit or human visual acceptance; tests do not prove production suitability | CI #44823195479, #44823195465; `tools/interactive-acceptance.mjs`; `tools/visual-acceptance.mjs` |
| Privacy/security | Noindex demo, local-only demo state, public moderation and ad endpoints still excluded by regression suite | No independent security signoff, real privacy program, hosting controls, operational incident response | `app/layout.tsx`; `tests/profile-http.mjs`; SEC-007 and release gate docs |
| Product documentation | Source-of-truth specification is general business directory | Owner's later adult-companionship objective conflicts with that specification. Also: wording on homepage says "age-gated concept styling," but no actual age-verification mechanism exists | `docs/PRODUCT_VISION.md`; `docs/PRD.md`; `app/page.tsx` |
| Release | Offline source and GitHub Actions review artifacts | No public or private hosted URL, and no access-control implementation. `noindex` does **not** make a URL private | `README.md`; `docs/launch-readiness/release-gates.md` |

## Severity-ordered findings

**P0 — Product identity conflict.** The actual approved requirements expressly prohibit sexual services, but the owner now describes the desired business as an adult-companionship advertising directory. We must obtain a clear, explicit scope decision and review appropriate content restrictions; do not quietly change PRD, seed real ads, or position the prototype as serving customers.

**P0 — Private does not mean access controlled.** A publicly accessible noindex page is still accessible. Do not assume withholding promotion, unlisted URLs, or noindex provide confidentiality or legal eligibility. No deployment until separate specific authorization and qualified review.

**P1 — Content quality.** Two generic fictional listings per city and repeated descriptions do not test realistic browsing, density or information hierarchy. Safe next step: richer **fictional non-transactional concept fixtures** that remain unmistakably synthetic and non-sexual-service offers, with more varied editorial content, without introducing real contact fields.

**P1 — Misleading age-gate wording.** The homepage refers to "age-gated concept styling" though there is no actual age-gate. Update wording to "18+ visual concept" or state clearly that age restriction is a display label, not age verification. Do not imply an implemented protective control.

**P1 — Gallery-to-product gap.** The gallery is two CSS placeholders. A reviewed design system should define image aspect ratios, loading/error behaviors, text alternatives, consent-provenance display requirements and moderation states *before* any real asset handling. No scraping or importing competitor imagery.

**P1 — Accessibility/manual review incomplete.** Automated comparison, gallery and narrow mobile checks succeeded, but full keyboard journey, screen reader announcements, reduced-motion and WCAG target require expanded, documented review. Existing `docs/ACCEPTANCE_CRITERIA.md` requires 320px overflow check, while confirmed interactive check covered 390px.

**P2 — Comparison utility.** Compare is working technically but has only category, city, fictional verification and a sponsorship label. Do not add arbitrary personal or transactional attributes to simulate sophistication. Reassess the feature after a suitable lawful content taxonomy is approved.

**P2 — No measurable UX baseline.** Without private usability testing and a design acceptance rubric, repeated cosmetic changes are subjective. Prefer screenshot review with tracked defects and a fixed design scorecard over another unprioritized feature.

## Capability boundary

The current prototype **does not** contain adult-companionship advertisements, verified individual profiles, booking, messaging, contact buttons, ad submission, payment, real reviews, age verification, or private hosting. These must not be described as shipped, even if visual design suggests them.

## Recommendation and owner decision requested

1. Approve or reject a **documentation-only product scope reconciliation** distinguishing the intended concept, permissible demo content, prohibited functionality and unresolved market questions.
2. Build a reviewed **fictional, non-transactional design reference**: complete mobile and desktop page compositions, realistic placeholder content volume, empty/loading/error states, accessibility scorecard.
3. Require the human owner to inspect the latest 10-image gallery and record specific visual defects; do not infer visual signoff from CI.
4. Keep SEC-007/v1 unsigned; D-001 **NO-GO** in Dubai, Muscat and Doha and G1–G6 **OPEN** until the designated decision-makers explicitly approve changes.

**Decision status:** Proposed review findings, not a change to approved product or launch authorization.
