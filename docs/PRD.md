# Product Requirements Document — Three-City Directory v1.0

Status: approved for specification and demo-only development; NOT approved for production activation.

## Roles
Visitor (anonymous); prospective business owner (future); advertiser (future); moderator (future); administrator (future). Only visitor/demo functionality is enabled initially.

## Functional requirements
### P0 — Demo discovery
- FR-001: Landing page explicitly offers Dubai, Muscat, Doha, with clear country labels.
- FR-002: Each city has a stable canonical path /dubai, /muscat, /doha; invalid city slug returns 404.
- FR-003: City page shows fictional listing cards with category, title, short description, and visible DEMO label.
- FR-004: Case-insensitive text search is scoped to current city; empty and no-results states are understandable.
- FR-005: City navigation preserves explicit selection; no automatic geolocation.
- FR-006: Responsive layouts support narrow mobile screens and keyboard navigation.
- FR-007: Metadata marks demo pages noindex; no public deployment implied.
- FR-008: Test fixtures must be obviously fictional and must not contain real phone numbers, personal photos, email addresses or outbound booking links.

### P1 — Extended demo UX
- FR-009: Category browse/filter and optional sort; filtering is deterministic and testable.
- FR-010: Fictional profile detail route with gallery placeholders, hours/location placeholders, verification-state explanation and report-action mock.
- FR-011: Query/category state can be shared via URL; back/forward navigation behaves correctly.
- FR-012: English copy first; internationalization framework and RTL readiness without inventing translations.
- FR-013: Clear sponsored-listing visual treatment in sample fixtures; paid ordering remains disabled.
- FR-014: Loading, empty, error and not-found states have accessible text.

### P2 — Internal data and moderation (disabled until approved)
- FR-015: PostgreSQL schema/migrations for city, category, listing, media, submission, report, moderation decision, audit event, sponsor placement and campaign.
- FR-016: Typed repository/service layer with seeded synthetic data and deterministic tests.
- FR-017: Admin/moderator RBAC designed with least privilege; actual auth/provider activation requires separate approval.
- FR-018: Draft -> submitted -> review -> approved/rejected -> published/archived lifecycle, with immutable audit history.
- FR-019: Listing claims and duplicate detection must be manually reviewed before publication.
- FR-020: Reports and appeals support reason codes, timestamps and decision records.

### P3 — Future advertiser capability (design only)
- FR-021: Sponsored placement inventory per city/category with clear "Sponsored" disclosure.
- FR-022: Ad creative review, city eligibility rules, placement start/end dates and frequency safeguards.
- FR-023: Campaign analytics limited to aggregate, privacy-reviewed events.
- FR-024: Pricing plans, billing and payments remain disabled pending explicit approval and legal/commercial review.

## Content and compliance
General legitimate business categories only. Prohibit sexual services, trafficking-related material, illegal goods/services, deceptive advertisements, discriminatory content, impersonation, minors in adult contexts, and unauthorized personal information. Maintain city-specific policy matrix. No unlicensed data ingestion or scraping. Real business claims, imagery and advertising require rights/consent checks. Country-specific legal and advertising review is mandatory before launch.

## Nonfunctional requirements
- Security: no secrets committed; server-side validation; deny-by-default authorization for future admin APIs; rate limits and abuse controls before enabling submissions.
- Privacy: data minimization, retention/deletion plan, no tracking without review, no unnecessary precise geolocation.
- Accessibility: WCAG 2.2 AA target; semantic landmarks, visible focus, labeled forms, contrast, RTL readiness.
- Performance: set measurable budgets in later phase; avoid blocking third-party scripts.
- Reliability: deterministic unit tests, build/typecheck in CI, no external dependency required for demo.
- SEO: noindex during demo; city/category structured data only after legal and factual review.
- Observability: no personal-data logging; documented errors; no paid telemetry without approval.

## Release gates
P0/P1 may be coded and reviewed locally without deployment. P2/P3 may be modeled behind disabled flags only; production DB, real auth, real submissions, tracking, ads, payments and public preview all require separately documented owner approval. A successful build is not authorization to deploy.
