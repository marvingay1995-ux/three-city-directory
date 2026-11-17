# ADR-0001 — Domain boundary and in-memory repository

Status: proposed for Phase 3 review, 2026-11-18.

## Context
Three city-specific fictional directories and six profile URLs already exist. Phase 3 requires validation and future persistence contracts without operating a database or changing the UI.

## Decision
Keep the public `lib/directory.ts` fixture API stable. Introduce:
- `lib/domain/model.ts`: pure types, input validation, integrity checks and transition rules.
- `lib/data/in-memory.ts`: a typed, city-required repository contract and independently created, clone-on-read/write, in-memory implementation.
- One deterministic adapter `createDemoSeed()` mapping the existing six fixture entries into typed entities; use fixed timestamps and unverified status.

The public pages and their search/category filtering remain unchanged. The in-memory adapter does **not** replace those page imports until a later separately authorized phase; Phase 3 defines an integration seam, not a production read model.

## Architectural flow
```text
Existing Next.js routes -> lib/directory.ts (unchanged demo read facade)
                               |
                               +--> six synthetic source fixtures
                                           |
                                           v
                                   createDemoSeed()
                                           |
                                           v
                                    typed model validation
                                           |
                                           v
                          ListingRepository interface (city required)
                                           |
                                           v
                            InMemoryListingRepository (no IO)
```

## Validation
IDs and slugs have constrained formats, city code/currency mappings are checked, listing references must exist, and (cityId, slug) is unique. The repository requires a validated city selector for reads/writes. Failed mutations are validated on a prospective copy before commit. Optimistic revision checks prevent stale transitions. Returned records are clones. Every new test repository instance receives its own data.

Lifecycle: draft -> submitted -> under_review -> approved/rejected; approved -> published/archived; rejected -> draft/archived; published -> archived. Identical-state requests are idempotent, provided the expected revision matches. Approval **never** means verified and does not automatically publish. These are *domain-only* state guards, not authentication or authority checks; a future service must enforce actor permissions before any real mutations.

## Tradeoffs and exclusions
- Currently in-memory state only: no persistence beyond process lifetime, no concurrency guarantees across workers, no network, no public write APIs.
- Deterministic synthetic data only: no actual contact details or real identities.
- Additional state models (media, reports, submissions, moderation decisions, audit) are type-only; no workflow UI or public endpoints.
- No authentication, DB packages, external drivers, storage, providers, payments, sponsored delivery or tracking.
- A PostgreSQL design sketch is not executable migration authorization.
- No production-read refactor in this phase protects Phase 1/2 from accidental regressions.

## Follow-up before any production use
Actor authorization, audit persistence, idempotency keys, transaction isolation, robust slug/collision policy, schema migrations, consent/rights review, retention/deletion, residency requirements, and jurisdictional legal assessment.
