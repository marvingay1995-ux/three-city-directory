# Threat tests, verification and G2 evidence gaps

**G2 NOT CLEARED.** This package is suitable for design review. It is insufficient for independent launch sign-off. D-001 remains NO-GO for Dubai, Muscat and Doha, and every G1–G6 gate remains open.

**Evidence labels:** DESIGN describes a proposed requirement. OFFLINE VERIFIED describes only a specific existing fixture or loopback assertion. UNIMPLEMENTED means no production control or production test evidence exists. This PR adds no reference implementation or new executable tests.

## Threat and negative-test matrix

An independent reviewer must execute the future tests only on an expressly authorized candidate and environment, with synthetic data. Each test should capture exact commit, environment, fixture, expected and observed outcomes, authority before/after, relevant data access and audit/receipt evidence.

| Threat and impact | DESIGN control | OFFLINE VERIFIED / UNIMPLEMENTED | Required future negative result |
| --- | --- | --- | --- |
| Forged role, actor or city, false ownership | Server-derived principal and scope, scoped record lookup and authority check | OFFLINE VERIFIED fixture role and owner/city rejection. UNIMPLEMENTED real principal and resource binding. | Calling a protected command with asserted identity, role or swapped city/owner is denied. No state, receipt or success event. |
| Missing/expired/revoked identity or stale authorization | Strict session validation, grant revisions, re-authentication and commit fence | UNIMPLEMENTED end-to-end. | Reject wrong issuer/audience, expiry, missing or mismatched nonce for login, revoked session/grant, expired step-up and stale keys. Test cookie fixation and CSRF with the selected session pattern. |
| Cross-city reads, writes, caches and exports | Mandatory city/object scope through API, repository, cache, worker and artifact | OFFLINE VERIFIED profile 404s, directory ordering and scoped fixture reads/writes. UNIMPLEMENTED private multitenancy and caches. | Test each access path across approved/forbidden cities, colliding IDs, private/public status, export recipients and stale caches. No cross-city/private content or existence leak. |
| Direct API or worker bypass | Enforce every boundary with service identity, city scope and current command authority | OFFLINE VERIFIED nine named ad/admin URLs return 404. UNIMPLEMENTED real worker/API checks. | Direct requests and injected/replayed synthetic queue messages with missing, broad or wrong-city grants are rejected. A forbidden message stays quarantined. |
| Self-approval, escalation or ownership fraud | Separate submitter, approver, verifier and publisher by stable principal plus current scope | OFFLINE VERIFIED Phase 4 separates review from publication. UNIMPLEMENTED compound production conflicts/evidence policy. | Same or affiliated principal cannot approve/publish its own case, including after role change. Old owner and stale policy/version cannot publish after transfer. No widening own grant. |
| Replay after revocation or changed payload | Scope receipts; reauthorize under commit fence; verify fingerprint and revision | OFFLINE VERIFIED exact replay and conflicting/stale request for synthetic instances. UNIMPLEMENTED actual revocation races and multi-worker semantics. | Run revocation and old receipt lookup on both commit orderings. Denial after revocation discloses no receipt. Same key with a changed payload conflicts, even across retries. |
| Concurrent duplicate or stale writes | Atomic conditional revision, locked scope and unique receipt | OFFLINE VERIFIED process-local stale/duplicate cases. UNIMPLEMENTED concurrency across workers. | At one revision, exactly one valid mutation commits with one event and receipt; competing requests conflict, or exact authorized replay returns that result. |
| Audit/receipt failure, lost acknowledgement or queue crash | One transaction, explicit outbox, rollback and retry reconciliation | OFFLINE VERIFIED failed fixture mutations leave snapshots unchanged. UNIMPLEMENTED durable failures. | Fault before event/receipt commit leaves no write. Failure after commit before response returns the same receipt on retry under current authorization. Dedupe repeated worker delivery and reconcile. |
| Malicious reason content or sensitive metadata | Allowlisted reason codes; no raw input in audit, redacted structured logging | OFFLINE VERIFIED synthetic reason rules. UNIMPLEMENTED collection/redaction. | Unknown reasons, oversized text and unsafe encoding reject; benign reason codes do not introduce content into HTML/logs. Private narrative stays out of audit exports. |
| Audit tampering, retention abuse or recovery discrepancy | Independent custody, role isolation, consistency checkpoints and restore reconciliation | UNIMPLEMENTED. | Synthetic unauthorized changes/deletion are denied or detected; key and hold changes require independent role. Recover a consistent checkpoint and prove replay, tombstones and reconciliation before unfreezing mutations. |
| Ad grant or approval bypass | Distinct scoped reviewers; exact creative/version audit; no auto-activation | OFFLINE VERIFIED city/category checks and separate scheduling. UNIMPLEMENTED production ad controls. | Cross-city and self-approved creative cannot advance. Revoked rights hold approved artifacts. No ad outcome changes organic ranking. |
| Incident or compromised operator | Scope-limited remediation, revocation, hold and separately audited break-glass | UNIMPLEMENTED. | Revoke or isolate affected sessions, grants and workers, keep unrelated cities bounded, and record chain of custody, reconciliation and independent reopening approval. |

## G2 blocker-to-evidence matrix

| Blocker | Accountable owner and reviewer | Independent exit evidence |
| --- | --- | --- |
| P0 identity/session and lifecycle | IAM owner + independent application security | Signed issuer/session design, negative identity/CSRF/recovery cases and revocation test on the approved candidate |
| P0 tenant/object authorization and separation | App Security + Trust & Safety | Independently reviewed grant matrix and tests covering APIs, worker, repository, cache, exports, publication and ad separation |
| P0 consistent state, audit and recovery | Data and independent audit custodian | Transaction/failure and concurrency evidence, replay/revocation proof, independently reconciled append-only custody and recovery drills |
| P0 privacy, approved data flows and jurisdiction | Privacy, local counsel and independent security | Signed country decisions, approved residency/transfers and data rights, reviewed vendors, secret/key access and backup/hold handling |
| P1 dependency provenance, exact perimeter and response | Release and Platform Security + independent reviewer | Fresh audit and compatibility disposition, approved branch/monitoring controls, actual headers/ingress/egress, incident runbook and representative capacity/recovery evidence |

Required sign-off includes named independent reviewer and qualifications, authorized scope, exact artifact and regions, dated tests and remediation, residual exceptions and expiry. No design or demo result gives that approval. G1, G3, G4, G5 and G6 remain separate from G2. Follow the [Phase 6 gate register](../../launch-readiness/release-gates.md).

## Verification of the unchanged demo

Local Windows x64, Node 22.22.0 and npm 10.9.4, base `7c56eedd8e9dc3e4710375548f351c6050ea02b8`. Functional verification ran 2026-11-18 11:37:53–11:41:09 UTC. Fresh SEC-003 audit 11:41:25–11:41:29 UTC. Existing generation outputs were moved aside for the production build. No public routes, config, dependencies, simulators or workflows changed.

| Command | Result |
| --- | --- |
| `npm ci --no-audit --no-fund --cache ../npm-cache --offline` | Exit 0, 28 installed packages from workspace cache. |
| `npm test` | 63/63 tests passed. Existing non-failing module-type warnings. |
| `npm run typecheck` and `npm run build` | Both exit 0. Production build generated 13 pages. |
| `node tests/profile-http.mjs http://127.0.0.1:43138` | Production loopback pass. Six profile pages, filtered links, noindex and sponsor and fictional disclosures, 12 cross-city 404s, four invalid routes, two malformed encodings and nine named admin/ad 404s. Additional loopback smoke verified the exact organic ordering of each city with filters, empty cases and noindex. |
| `node tools/audit-evidence.mjs collect ../sec004-local-evidence <npm-cli-path>`, then `node tools/audit-evidence.mjs evaluate ../sec004-local-evidence success` | Official registry fresh audit, npm exit 0, decision `clean`, zero counts at every severity, evaluator exit 0. The [SEC-003 controls](../SEC-003-ci-controls.md) specify complete flags. Report is a dated snapshot. |

The PR records the Node 22 hosted run and retained evidence. No production or external security test was performed.
