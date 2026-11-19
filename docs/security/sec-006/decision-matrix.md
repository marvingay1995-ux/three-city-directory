# Proposed ADR SEC-006 — Identity and authoritative writes

**Status: PROPOSED for design review. Decision owner: product owner.** IAM, App Security, Data, Privacy, counsel and the independent security reviewer advise. The following is a comparative design judgment, not a vendor recommendation or approval.

| Dimension | A. Server-mediated browser session and co-located authority fence | B. Bearer/API-first access and separately evaluated policy |
| --- | --- | --- |
| Trust and exposure | Browser handles an opaque host-scoped session; the server holds issuer tokens. Smaller browser token exposure. Session store and web origin become high-value boundaries. | Short-lived audience-scoped API tokens support more clients and services. More token transport, replay, signing key and delegation boundaries. |
| CSRF and cookies | Cookie transport needs origin checks, bound anti-CSRF protection, narrow cookie scope and cross-origin/browser testing. | Authorization-header access reduces ambient cookie use. Login callbacks and any cookie-mediated refresh still need state/CSRF protections. Browser token storage and XSS risk need separate review. |
| Revocation | Co-located grant/session version fence makes commit ordering directly testable. Session lookup failure denies privileged work. | API validation and separately evaluated policy improve reuse. A TTL or signed decision alone allows stale permits. Requires current resource-, action- and version-bound decision plus an authoritative commit fence. |
| City and ownership | Central scope and ownership checks plus mandatory query scope; use logical city namespaces even if physical separation is later required. | Multiple enforcement points, workers and caches need identical scope contracts, compatible policy versions and denied-by-default failures. |
| Transactions and custody | Atomic writer event plus outbox to separate custody. Simpler consistency boundary, but outage of writer blocks scoped mutations. | Writer still owns atomic state/event/receipt. Distributed policy/custody introduces lag and correlated failures. A remote audit write does not make the state change atomic. |
| Reliability and recovery | Test session-store restore, fail-closed access, per-city writer recovery and backpressure. Public data may degrade independently under approved rules. | Additional trust and dependency failures, key rotation and network recovery modes. Assess freshness guarantees under partitions and safe rollout/rollback across services. |
| Staffing and cost | Assumes fewer separately operated services initially. Includes session/key upkeep, on-call, audit custody, restoration and local counsel. | Assumes more principal/key lifecycle, policy deployment, queue/telemetry and integration tests. Possible savings from shared policy across authorized services have not been measured. |

**Preference and conditions:** A is the provisional first candidate for a browser-led directory. The SEC-005 harness demonstrates the value of a single explicit commit point and reauthorization before replay. It does not prove production session or storage guarantees. Advance A only if Privacy and counsel can approve the needed data flows, Data can prove the fence and restore path, and Release Security can scope independent testing. Never trade a stale privileged write for availability. Reopen the comparison if approved external clients need native API access, city residency prevents a shared consistency design, or independent testing cannot satisfy the revocation or resilience objectives. B requires the same safety invariants.

## Decision register

| ID / status | Decision and owner | Evidence, dependency or reversal trigger |
| --- | --- | --- |
| D6-01 PROPOSED | Evaluate A first. Product owner with IAM and Security. | Browser/client scope, identity assurance, reviewed revocation design and written review. Reopen on new clients or failed containment. |
| D6-02 OPEN | Identity issuer, session/step-up and authoritative grant storage. IAM and Privacy. | Approved issuance/recovery/revocation and country flow analysis; dependent on operator and customer model. |
| D6-03 OPEN | Transaction engine, tenant partition layout and migration strategy. Data and Platform. | Atomicity and fencing proof, constraint design, fault and recovery test evidence. No engine selected. |
| D6-04 OPEN | Audit custody, time, keys, signing, retention and restore. Independent custodian with Privacy. | Independent access/restore exercise, segregation, local counsel and agreed evidence custody. |
| D6-05 OPEN | Country flows, vendors, staff/access locations and approvals. Country counsel and Privacy. | Signed UAE/Oman/Qatar decisions. Any processor, hosting region or data-class change reopens review. |
| D6-06 OPEN | Operating capacity, staffing, spend and any pilot. Operations and product owner. | Approved budget, incident/rollback owners, G1–G6 clearances for exact scope, separate authorization. |

The comparison carries forward [SEC-004 alternatives](../sec-004/adr.md) and distinguishes them from the [SEC-005 single-process evidence](../sec-005/contracts.md).
