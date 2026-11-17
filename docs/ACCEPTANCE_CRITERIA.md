# Acceptance Criteria — Three-City Directory v1.0

## General gates (all phases)
- AC-G01: Feature branch and PR target main; no direct main modifications.
- AC-G02: npm test, npm run typecheck and npm run build pass in CI.
- AC-G03: No deployment or preview URL, payments, tracking, credentials, real advertiser data, or paid services introduced.
- AC-G04: All demo profiles are explicitly fictional; no real phone numbers, photos or contact routes.
- AC-G05: No cross-city data leakage; city slug is validated.
- AC-G06: No secrets committed; dependency changes documented.
- AC-G07: PR includes evidence, known limitations and owner review request.

## Phase 0
- AC-001: Current repository inventory and merged foundation state documented with evidence.
- AC-002: Baseline CI/test/build outcome recorded; failures resolved or explicitly documented.
- AC-003: No functionality change beyond essential baseline repair.

## Phase 1
- AC-101: Each city selector navigates to correct route.
- AC-102: City switcher never silently changes user selection.
- AC-103: Search is case-insensitive, URL-synced and city-scoped.
- AC-104: Category filtering works with search and preserves shareable state.
- AC-105: Empty results, invalid city and missing content have accessible states.
- AC-106: No horizontal overflow at 320px; keyboard navigation and visible focus.
- AC-107: Screenshots show homepage plus all three city pages.

## Phase 2
- AC-201: Every fictional listing detail page has city-specific URL and breadcrumb.
- AC-202: Invalid slug/cross-city lookup returns not found.
- AC-203: Profile prominently states demo/fictional.
- AC-204: Any sponsored sample is clearly labeled, never delivered as a paid campaign.
- AC-205: No contact, booking, payment or user submission endpoint exists.

## Phase 3
- AC-301: Typed entities and repository interfaces are tested with synthetic fixtures.
- AC-302: City scoping enforced in all reads/writes.
- AC-303: Draft/review/published state transitions reject unauthorized transitions.
- AC-304: No external database provisioned or connected.

## Phase 4
- AC-401: Mock role matrix and moderation workflow are documented and tested.
- AC-402: Mock admin UI is inaccessible as a public functional service.
- AC-403: No real identity provider, upload or persistence activated.

## Phase 5
- AC-501: Sponsored inventory is visually distinguishable from organic results.
- AC-502: Campaign states are simulated; no delivery, billing or tracking.
- AC-503: City-specific policy eligibility is represented and tested.

## Phase 6
- AC-601: Legal, privacy, security and accessibility reviews are documented separately.
- AC-602: Deployment remains blocked until explicit go-live authorization.
- AC-603: Product owner approves or rejects release against documented gates.
