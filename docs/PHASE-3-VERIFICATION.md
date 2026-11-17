# Phase 3 — Verification and boundary notes

## Deliverables
- Typed entities for cities, categories, listings, media, submissions, moderation decisions, reports and audit events
- Design-only advertising interfaces, without activation
- Pure validators, integrity rules, city-scoped repository interface
- Deterministic fixture adapter for existing six fictional listings
- Independent in-memory instances with clone-on-read/write and optimistic revision transitions
- ADR and NOT EXECUTED PostgreSQL draft

## How to verify
```sh
npm ci --no-audit --no-fund
npm test
npm run typecheck
npm run build
# CI additionally runs production HTTP regression: node tests/profile-http.mjs (loopback only)
```

## Boundaries
- No database is connected or provisioned. SQL is documentation, not a live migration.
- No credentials, storage, hosting, third-party services, paid services, live reports, submissions, advertisements or payments.
- The public UI continues to use the original demo fixture API; this phase adds a clean future integration seam.
- No real authorization exists: lifecycle guards are not substitutes for permissions or audit records.
- Before Phase 4, review RBAC and audit assumptions. Before migration, review transaction isolation, schema constraints, retention and country-specific regulations.

## Owner approval
PR review and owner merge approval required. No release or deployment authorized.
