# SEC-006 — Security architecture decision and implementation readiness

**D-001 remains NO-GO for Dubai, Muscat and Doha. G1–G6 are OPEN. G2 is NOT CLEARED.** This package recommends a direction for review. It grants no implementation, vendor, environment or release authorization.

Baseline `0e697e067b86f304d29892988d30c64e48097654` includes [SEC-005 PR #28](https://github.com/marvingay1995-ux/three-city-directory/pull/28), the [SEC-004 design](../sec-004/README.md) and [SEC-003 CI controls](../SEC-003-ci-controls.md). The demo still reads six fictional fixtures. SEC-005 exercises deterministic synthetic contracts from the test tree. No production identity, grant store, database, API, queue, audit custody, external service or hosting has been activated.

**Provisional direction:** Review a server-mediated browser session with a city-scoped authoritative write boundary. Place authorization freshness, expected revision, state, a minimal audit event, receipt and outbox under one consistency contract. Separate durable audit custody and published projections. Keep an API-first pattern open if separately approved clients justify the additional trust and operating cost.

| Document | Review purpose |
| --- | --- |
| [Decision matrix and register](decision-matrix.md) | Alternatives, provisional preference, owners, dependencies and reversal triggers |
| [Authorization and data contract](authorization-data-contract.md) | Trusted identity, city and object enforcement, data invariants and migration safeguards |
| [Transaction and audit options](transaction-audit-options.md) | Consistency alternatives, replay, outbox, custody and failure recovery |
| [Privacy and operational prerequisites](privacy-operations-dependencies.md) | Country-specific questions, regions, staff, incidents and cost assumptions |
| [Implementation approval gates](implementation-gates.md) | Sequenced candidate work packages, file and surface boundaries, stop conditions |
| [Verification and G2 evidence](verification.md) | Offline baseline, threats, negative-test plan, blockers and sign-off requirements |

The product owner retains all approval authority. SEC-006 does not authorize SEC-007. See the [Phase 6 decision](../../launch-readiness/release-gates.md).
