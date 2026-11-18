# G2 evidence, deficiencies and recommendation

**G2 remains open and the package is not yet eligible for independent launch sign-off.** A qualified reviewer can use it to scope a future assessment. D-001 remains NO-GO for all three cities, and G1–G6 remain open. No gate status was edited. See [Phase 6 decision](../../launch-readiness/release-gates.md).

| Priority / issue | Owner | Evidence and test status | Consequence and exit criteria |
| --- | --- | --- | --- |
| P0 — Production identity, tenant authorization and publication separation absent | IAM and App Security | [IAM review](iam-audit.md). Prototype tests passed; real control unimplemented. | Changes cannot be attributed or safely scoped in production. Independent negative tests for real identity, revocation, object/city/method scope and separation of duties. |
| P0 — Durable audit, transaction and replay guarantees absent | Data engineering and App Security | [IAM review](iam-audit.md). Process-local checks passed. | Concurrent writes, rollback and tamper risks remain. Validate atomic state/audit commits, unique scoped receipts, immutable retention, recovery and reconciliation. |
| P0 — Production ingress, egress, private-data and cache isolation unverified | Platform and Security | [Boundary checks](boundaries.md) cover loopback only. | No assurance against production disclosure or access bypass. Signed perimeter review, cache-isolation tests, threat-model and controlled security assessment of exact release scope. |
| P1 — Framework support for the external PostCSS pin is unverified | Runtime owner and Release Security | [Dependency review](dependencies.md). Demo build and HTTP exercised; upstream support not established. | Untested pipeline regressions and new advisories remain possible. Obtain upstream native safe path or document a bounded accepted exception with compatibility evidence, monitoring and exit date. |
| P1 — CI audit exit semantics and evidence retention | Release Engineering | [Workflow review](dependencies.md). Static finding; no live workflow altered. | Lower-severity audit failures can mask the separate severity check and functional results. Reproduce offline audit-result handling and independently verify auditable failure signaling and retained machine-readable evidence. |
| P1 — Build provenance and continuous detection gaps | Release Engineering | [Workflow review](dependencies.md). Mutable action tags and absent jobs confirmed in file. Org settings unknown. | Supply-chain drift and stale evidence. Approve pinned actions, provenance/SBOM, secret/dependency scan policy, triage and registry outage handling. Review access/branch controls separately. |
| P2 — Resource abuse and data minimization limits not set or tested | App and Platform | [Boundary checks](boundaries.md). Bounded smoke only. | Oversized queries and logs can raise availability/privacy risks. Demonstrate workload limits, redacted URLs, safe error behavior and incident alarms before any affected feature goes live. |

## G2 sign-off evidence matrix

| Gate evidence | Status | Required independent evidence |
| --- | --- | --- |
| Dependency inventory and fix version | Reproduced for demo baseline | Exact release artifact lockfile, package identity/integrity provenance, fresh audit and triage, fail-closed result handling and bounded compatibility exception or upstream support |
| Current application isolation | Sampled demo checks passed | Repeat on exact candidate; review platform defaults, route manifests, error behavior, cache partition, deployed headers and egress in an approved environment |
| Real IAM, write isolation and audit | Design only | Threat-model and design review followed by authorized negative tests and recovery/reconciliation with durable controls |
| Supply chain and process | Repo workflow reviewed; settings unverified | Reviewer verifies protected branches, required checks and independent reviews, credentials/runners, pins, scanning, provenance, retention and incident procedure |
| Independent security testing | Outstanding | Qualified reviewer independent of implementation runs a written, authorized assessment, verifies all critical findings closed, and tracks residual risk with accountable owners, expiry and retest triggers |
| Signed scope and clearance | Outstanding | Dated reviewer name, independence and qualifications, exact commit/artifact/regions, threat/model coverage, results, unresolved exceptions, expiry and written decision. Product release needs G1–G6 and separate owner authorization. |

## SEC-003 proposal, subject to owner approval

1. Reproduce the confirmed audit-step ordering gap using synthetic exit codes and an offline fixture. Define a policy for low/moderate reporting, high/critical enforcement, and registry/tool failure that never treats missing evidence as success.
2. Propose a narrowly scoped workflow change to retain full audit evidence and independently surface tests and severity decisions. Verify success, low/moderate, high/critical and registry error cases before opening a separate PR.
3. Propose pinned action revisions and version provenance for the confirmed mutable-tag and evidence gaps. Record a rotation/update path. Do not change repository permissions or add external services under SEC-002.
4. Escalate a dependency patch only if independently confirmed evidence shows a fresh unresolved advisory or an actual compatibility problem. Follow the documented override exception and supported-upstream review process. No package upgrade is requested by this assessment.

Production controls and any live security testing require separately approved scope. This document records their absence and required evidence without authorizing implementation.
