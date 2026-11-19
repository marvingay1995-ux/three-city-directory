# SEC-007 — Security contract freeze and architecture decision package

**Freeze candidate SEC-007/v1 is FROZEN FOR REVIEW. It remains unsigned. D-001 remains NO-GO for Dubai, Muscat and Doha. G1–G6 remain OPEN and G2 is NOT CLEARED.**

The candidate covers a future browser-led directory with the three fixed city IDs `dubai`, `muscat` and `doha`. Protected command families in scope are owner submission and reassignment, moderation and decision, verification, publication and withdrawal, scoped audit/export, and post-commit processing and recovery. The current baseline remains a fictional demo. Real identity, business onboarding, production APIs, database, ads, payments, tracking and providers are outside the authorized work.

| Label | Meaning |
| --- | --- |
| FROZEN FOR REVIEW | Versioned requirement wording is submitted for review. Changes require a documented revision and impact review. Merge is not approval. |
| PROPOSED / OPEN | Candidate recommendation / unresolved owner or reviewer decision. |
| VERIFIED OFFLINE | A named existing test or loopback check reproduced a bounded synthetic or demo result. |
| UNIMPLEMENTED | Production control and proof are absent. |
| REQUIRES INDEPENDENT REVIEW | A qualified reviewer independent of implementation must evaluate the exact authorized candidate. |

**MUST / MUST NOT** defines an acceptance invariant for any later authorized implementation of this candidate. It conveys no current deployment, spending, provider or implementation approval. Numerical settings, policy exceptions and unresolved trade-offs are tracked separately.

- [Authorization contract](authorization-contract.md) defines A7 requirements.
- [Transaction contract](transaction-contract.md) defines T7 requirements.
- [Audit and privacy contract](audit-privacy-contract.md) defines P7 requirements.
- [Proposed architecture decision](architecture-decision.md) compares A and B.
- [Decision register](decision-register.md) records D7 items and approval effects.
- [Verification handoff](verification-handoff.md) traces each invariant to earlier decisions, offline evidence, future negative tests and G2 blockers.

The source baseline is `d82d24edba63aefafb885e2f629dfc446050d66d`, merged [SEC-006 PR #30](https://github.com/marvingay1995-ux/three-city-directory/pull/30). The design derives from [SEC-004](../sec-004/README.md), [SEC-005](../sec-005/README.md), [SEC-006](../sec-006/README.md), Phase 3–5 ADRs, the [SEC-003 workflow](../SEC-003-ci-controls.md) and the [Phase 6 gate register](../../launch-readiness/release-gates.md). Application, simulator, workflow and harness files are unchanged.

Required signatories for later adoption are the product owner, AppSec/IAM, Data, Privacy, applicable qualified country counsel, and a qualified security reviewer independent of implementation. Refer material changes in identity or authority, data flows, writer/custody topology, legal scope, exposed surfaces, proof assumptions or incident evidence back to those reviewers. Preserve the old invariant ID and record a superseding version. SEC-007 does not authorize SEC-008.
