# SEC-005 verification and residual evidence gaps

The model and verification target merged SEC-004 [PR #26](https://github.com/marvingay1995-ux/three-city-directory/pull/26), Issue #27 and the [SEC-004 G2 matrix](../sec-004/verification.md). The retained Phase 3–5 ADRs describe the surrounding demo and are unchanged.

## Evidence mapping

| G2 blocker | VERIFIED OFFLINE in `tests/security-contracts.test.mjs` | DESIGN / NOT IMPLEMENTED |
| --- | --- | --- |
| Identity, revocation and recovery | Unregistered/copied handles, missing permissions, expiry, session rotation, stale grant and policy, revocation before commit and before/after replay, authority preserved across simulated restart | Actual identity proof, cookie/CSRF, issuer lifecycle, distributed freshness and a production transaction fence |
| City, resource and separation | Identical IDs in different cities, same denial for missing/foreign targets, caller claims rejected, current owner checks, transfer and withdrawal invalidation, reason codes, role changes on one principal, separate verification and publication | Current real ownership, affiliates/conflict checks, role provisioning controls, private query/cache/export enforcement and externally reviewed equivalent denial behavior |
| State and idempotency | Expected revision, legal transitions, rejected content resubmission, detached responses, conflicting retries, contenders in both write orders and exact concurrent-key replay | Database concurrency, unique constraints, lock/transaction behavior across workers and key expiry/retention |
| Atomic audit and reconciliation | Five precommit fail points, postcommit response loss, snapshot recovery, corruption checks over state/audit/receipt/outbox/projection, scoped audit read, simulated audit outage | Durable storage, trusted time, independent anchor custody and key roles, true restore and retention drills, tamper resistance against privileged operators |
| Outbox and safe visibility | Exact event delivery, duplicates after restore, cross-city and revision-mismatch quarantine, out-of-order retry, withdrawal and audit-path holds | Queue lease, delivery ledger and authorization, isolation, cache invalidation, external side effects and recovery timelines |
| Existing public boundaries | Production loopback asserts all six profiles, city isolation, noindex, fictional/sponsor labeling, nine named ad/admin 404s, and unchanged organic order and filters | Release environment, deployed ingress and independent attack-surface review |

The suite adds 16 deterministic test groups. It uses fixed synthetic IDs and logical time. Fault injection never executes database, external queue or filesystem operations. No public application code imports the harness.

## Baseline verification procedure

On Node 22: `npm ci --no-audit --no-fund`, `npm test`, `npm run typecheck`, `npm run build`, followed by `node tests/profile-http.mjs http://127.0.0.1:43138` against a local production server. Local install uses the workspace cache with `--offline`. The separate fresh audit uses `node tools/audit-evidence.mjs collect ../sec005-local-evidence <npm-cli-path>` and `node tools/audit-evidence.mjs evaluate ../sec005-local-evidence success` after successful collection. The PR records exact results, the audit time, hosted CI and the retained evidence link. [SEC-003 policy](../SEC-003-ci-controls.md)

## Outstanding review

Request a qualified independent design review and separate owner authorization for a synthetic, isolated prototype of authoritative revocation, durable transaction/outbox and custody boundaries. Agree on receipt retention, trusted timestamp and signing/anchor ownership, delivery consistency, visibility freeze/recovery objectives, and independently reviewed privacy/data-location constraints before any vendor or environment decision. Real concurrency, recovery, header and egress, prompt incident revocation and all country-specific clearance remain future evidence. The synthetic harness supplies no production certification, external security testing or release permission.

**D-001 remains NO-GO in Dubai, Muscat and Doha. G1–G6 remain open. G2 is NOT CLEARED.**
