# Proposed decision record — identity, policy and transactional audit

**Status: proposed for review. No provider, database, region, architecture or implementation is approved.** Prior decisions for fixture isolation and the offline moderation/advertising demonstrations remain in force.

## Patterns considered

| Concern | A. Server-mediated browser sessions and co-located write policy | B. Bearer/API-first sessions and separately evaluated policy |
| --- | --- | --- |
| Identity | Standards-based OIDC code + PKCE. A server retains tokens and exposes a short-lived opaque browser session. | OIDC code + PKCE with short-lived audience-bound access tokens for independently scoped APIs. Verify issuer and current revocation/session state at enforcement. |
| Main benefit | Keeps reusable tokens out of browser scripting, simplifies central revocation and semantic cookie/CSRF policy. | Suitable for multiple separately scoped clients/services and explicit service identities, with fewer shared session-store dependencies. |
| Main tradeoff | Session storage and key custody require approved regional operation and resumption/failure semantics. Cookie requests need strong CSRF controls. | Token compromise/replay, signing rotation and browser storage risks are higher. Requires reviewed token transport, audience restrictions, revocation/introspection and freshness controls. |
| Authorization | Server-side versioned policy at service and storage boundary, with tenant/query guards and in-transaction revocation fencing. | A centralized policy decision service can reuse policies across services. Service and storage enforcement must verify decision scope/version and fence revocation at commit. An unavailable or stale decision denies. |
| Mutation and audit | Atomic commit of state, receipt, append-only local event and outbox, then independent custody replication with reconciliation. | Distribution increases retry and split-brain complexity. Keep event plus receipt and transactional outbox at the authoritative writer. A remote audit call and state write alone cannot guarantee atomicity. |
| Recovery and risk | Simpler single-writer consistency, still a failure domain; prove regional isolation, backup/restore and audit segregation. | Larger availability/custody and actor delegation surface; prove cross-service trust and failure semantics before use. |

**Proposal for a later gated design review:** evaluate pattern A first for an initial browser application because it narrows the token exposure surface and gives a clear transaction fence. Keep independent audit custody separate. A single authoritative writer per relevant tenant partition is a consistency proposal, not a selected database. Pattern B remains viable if separately authorized clients and operations justify the added complexity, and all policy freshness and audit invariants survive review.

## Decision register

| ID / open decision | Accountable reviewers | Evidence required before choosing |
| --- | --- | --- |
| S1 identity/session architecture | IAM, App Security and Privacy | Threat model, identity/session assurance and recovery, regional flows, supporting standards and qualified review |
| S2 grants, role conflicts and ownership model | App Security, Trust & Safety and product | Reviewed matrix including dual-control, grant revision and withdrawal semantics, negative tests |
| S3 transaction, receipt and queue consistency | Data and Release Security | Proven authoritative-write, revocation, uniqueness and replay invariants with crash/concurrency evidence |
| S4 audit custody, retention, access and key separation | Independent custodian, privacy and country counsel | Approved retention/hold rules, permitted keys/regions, joint restore and tamper evidence |
| S5 privacy and suppliers | UAE/Oman/Qatar counsel, privacy and owner | Written applicable-law and flow decisions per country, vendor and region approval |
| S6 operating scope and resources | Operations, Trust & Safety and owner | Named staffing, incident/rollback authority, budget, scope and written separate approval |

First close the design and legal questions. If separately authorized, validate isolated synthetic contracts, then implement in an authorized private environment with explicit data restrictions. Commission independent testing on the exact candidate. No production sign-off can occur until independent G2 evidence is complete and the product owner obtains all G1–G6 approvals. Each vendor choice, environment, rollout or ad/payment activation needs independent scope and authorization.
