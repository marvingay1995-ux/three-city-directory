# Blank adoption instrument — SEC-007/v1

**Template only. ADOPTION REQUESTED has not been recorded.** Complete this instrument only after a separate owner instruction. Record unresolved items and stop where prerequisites are missing. A design adoption decision does not close G2.

## Required fields

| Field | To complete during authorized review |
| --- | --- |
| Instrument version and decision record ID | |
| Exact contract commit/tree and reviewed PRs | |
| Scope, environments, named regions, data classes, feature and actor boundaries | |
| Assumptions, exclusions, evidence IDs and unresolved D7 items | |
| Exceptions or explicitly recorded absence, expiry and retest triggers | |
| Written decision, date and scope of any authorized follow-up | |

## Sign-off checklist

Leave all boxes unchecked until supporting written evidence exists. For each required role record a name, competence and independence where applicable, decision, dated signature/reference and expiration or review trigger. Do not use a merge, chat response or automated report as a signature.

| Role | Required checks | Decision / signature / date |
| --- | --- | --- |
| Product owner | Fix exact adopted version and scope, assign named accountable owners, reconcile D7 decisions, separate adoption from implementation, spend and release. | |
| AppSec and IAM | Verify authority and session boundaries, revocation fence, role conflict and tenancy/worker/cache/export controls. | |
| Data | Confirm revision, receipt, transaction and outbox invariants, restore/tombstones and the limits of offline results. | |
| Privacy | Review inventory, minimization, purpose, access, processors, retention, holds and transfer dependencies. | |
| Trust & Safety | Verify affiliation, owner transfer dual control, verify-before-publish candidate, reactivation, appeal and incident responsibilities. | |
| Qualified UAE, Oman and Qatar counsel as applicable | Establish exact operator/jurisdiction and reviewed market scope; sign applicable flow, storage, rights and transfer decisions. Do not infer other markets' clearance. | |
| Qualified independent security reviewer | Declare skill and independence from author/build/operator decision, disclose conflicts, review exact scope/commit and record supported controls, gaps and required negative proof. | |

- [ ] Record all dispositions, named signatories and dates.
- [ ] Resolve discrepancies with the [D7 closure plan](decision-closure-plan.md) and trace all frozen IDs.
- [ ] Record explicit expiry/review date and reopening triggers. Reopen on scope, jurisdiction, feature, provider or infrastructure changes, changed assurance/authority or threat assumptions, serious incidents, invalidated evidence or expired exceptions.
- [ ] Record what is adopted, deferred or refused and what remains prohibited.
- [ ] For any follow-on work, obtain a separate written work order with permitted files, environment, data, limits and stop authority.

**G2 certification requires more:** qualified independent review and independently repeated tests of a real authorized candidate covering identity, multiworker authority/transaction isolation, real custody, perimeter and recovery. Link exact artifact, scope, evidence, remediation/retest, remaining risk, reviewer and signed date. It remains separate from design adoption and from all other [release gates](../../launch-readiness/release-gates.md).
