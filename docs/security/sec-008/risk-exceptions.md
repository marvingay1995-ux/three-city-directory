# Risks and controlled exceptions

Priority is a proposal for review, not evidence of an incident. Each item remains open pending named owners and independent review.

| Priority / risk | IDs / owner roles | Required control and evidence |
| --- | --- | --- |
| P0 issuer or session spoofing, stale grants and unauthorized commits | A7-01/02/05, T7-02 · IAM, AppSec, Data | Verified issuer/session and scoped grants, cross-worker revocation ordering and fail-closed replay. Deny if freshness unknown. |
| P0 cross-city scope, ownership, affiliation, cache and export leakage | A7-03/04/06, T7-05 · AppSec, Trust & Safety, Platform | Mandatory scope at API, repository, worker, cache and export; distinct actor/control; non-enumerating failures; cleanup of stale visibility. |
| P0 partial state/audit/receipt/outbox or double commit | T7-01–04 · Data, independent reviewer | Scoped engine constraints, competing writers, fault/rollback and original receipt tests. No published effect from an uncommitted intent. |
| P0 tampered or missing audit, untrusted time/key custody and broken restore | T7-06, P7-01/02/04 · Independent custodian, Security | Segregated custody, trusted checkpoint, reconciliation and signed recovery/incident reopen. Hold on unverified integrity. |
| P0 unlawful personal-data transfer or support/custody access | P7-03/04 · Privacy and country counsel | Approve exact flow and location by jurisdiction. Block any unapproved transfer, access or retention. |
| P1 expiry or stale visibility during lag; recovery and incident capacity | A7-06, T7-03/05/06 · Platform, Operations | Define agreed ceilings, incident freeze authority, receipt lifetimes and restore/deduped replay proof. |
| P1 staffing, permission oversight and dependence on dated supply-chain evidence | A7-02/06, P7-02 · Owner, Operations, Release Security | Named capacity and review roles, pinned/build evidence, fresh audit, alerting and privileged revocation exercises. |
| P2 premature optimization, cost/vendor assumptions and documentation drift | All IDs · Owner, Finance and reviewer | Revalidate cost and architecture assumptions against signed scope; maintain evidence traceability and reopen on relevant change. |

## Blank exception proposal

Record exception ID, exact requirement/decision IDs, scoped environment/regions and version, named accountable owner, business reason, data impact, likelihood/impact and affected actors, alternatives, compensating controls with test evidence, remaining risk, monitoring and stop/remediation plan. Record qualified reviewer independence, Privacy/counsel input where applicable, dated written owner decision, expiry, retest deadline and links. Fields are intentionally unfilled.

An exception MUST NOT permit P0 unauthorized writes, invalid replay, missing atomic event requirements, unapproved personal-data transfer or silent G2 clearance. It cannot bypass a gate, authorize implementation or alter a frozen requirement without a reviewed superseding decision. If evidence is missing, stop and escalate. Review compensating controls and enforce expiry; reopen on incident, scope change or failed evidence. Record closure after retest or revoke the exception and hold the affected scope.
