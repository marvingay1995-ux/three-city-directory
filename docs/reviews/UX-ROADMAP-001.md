# UX-ROADMAP-001 — Scoped next work after PR #45

Status: **proposal only**. No approval to enable additional runtime services or change content policy.

## Acceptance-first order

| Work item | Rank | Scope | Evidence for acceptance | Explicit exclusions |
| --- | --- | --- | --- | --- |
| SCOPE-001 — product direction reconciliation | P0 / first | Documentation-only decision on owner's adult-oriented ambition vs current approved general-business scope; map separately which UI concepts are acceptable to prototype | Owner-approved written outcome, explicit update list, archived contradictions and all affected documents identified | No law bypass, no real adult ads, no policy override by inference |
| COPY-001 — accuracy of claims | P1 / next safe code PR | Remove/qualify "age-gated" claim until actual protection exists; ensure demo-only text remains prominent at all viewports | Unit copy assertions and screenshot evidence | No fake age-verification badge or sign-in |
| UX-001 — visual scorecard | P1 | Inspect 10 captured views plus 320/375/768/1024 widths and gallery/compare states; record defect IDs and screenshots | Review rubric rated pass/fail, defect repro steps, owner signoff | No launch claims from automated checks |
| FIXTURE-001 — quality of fictional data | P1 | Provide **non-transactional, wholly fictional** editorial variants, diverse lengths, image placeholders and a safe static content model without changing routes | Deterministic fixture tests, no PII/contact/payment data, city isolation and noindex | No actual adult-service offers or unconsented photos |
| A11Y-001 — accessibility acceptance | P1 | Add keyboard, focus-order, screen reader/manual criteria, reduced motion, 320px no-overflow checks | WCAG 2.2 AA-targeted issue list, verified recorded outcomes, exceptions | No claim of third-party certification |
| IMG-001 — media design contract | P2 | Specify gallery image rights, consent/provenance, fallbacks, aspect ratios and sensitive-content moderation *as a design contract* | Reviewable data model and examples | No media ingestion, external storage or actual upload |
| FUTURE-001 — provider/commercial launch | Blocked | Separate legal, privacy, security, safety, country and owner decisions | All G1–G6 gates closed with evidence | No deployment, real ads, contacts, booking, billing or payments without new explicit authorization |

## Design-review rubric (each route/viewport)

Record **PASS / FAIL / NOT TESTED** for information hierarchy, visual consistency, navigational clarity, readable text and contrast, visible focus, keyboard access, consistent fictional disclosure, error and empty states, 320px horizontal overflow, profile gallery state, compare state and sorting/filter continuity. Record reviewer, date, screenshot route/viewport, actual result, expected result and reproduction steps.

## Definition of done for the next documentation milestone

- Product review and implementation backlog linked to existing source-of-truth documents.
- Every finding distinguishes *verified* from *not inspected*.
- No changes to runtime routes, live flags, fixtures or city release decision.
- Existing test/build/CI remains unchanged and green.
- Explicit owner decision on whether the approved general-business product specification should be separately reconsidered.
