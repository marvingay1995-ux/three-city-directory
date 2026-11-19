# Privacy, jurisdictions and operational prerequisites

Status: OPEN. This is a decision checklist that relies on the dated [Phase 6 source ledger](../../launch-readiness/jurisdictions.md). It makes no legal determination and selects no location or supplier.

| Market | Required qualified review before choosing data flows |
| --- | --- |
| Dubai, UAE | Counsel identifies the actual operator and applicable federal, free-zone or sector framework. Review issuer location, customer/staff identity flows, local and overseas support, backups, disaster recovery, media derivatives, audit custody/keys, subprocessors and transfer basis. |
| Muscat, Oman | Counsel determines applicable scope, permitted processing, any permits and lawful overseas transfers. Independently review staff and moderation access, storage and backup/restore destinations, incident/rights and complaint handling, custodian and processor obligations. |
| Doha, Qatar | Counsel confirms applicable national or special-zone rules for the operator. Sign off processing and rights, primary and secondary locations, remote support, protected evidence handling, audit recipients, international transfer safeguards and regulator/incident plan. |

A city scope is an authorization constraint and is not proof of physical residency. Map each collection, transfer, storage, staffed access and restore independently for identity, business verification, private evidence, queue/receipts, projections, audit, logs, exports, keys and alerting. Reject unknown destinations and overbroad support access. No shared-region assumption. Vendor selection is downstream of verified jurisdiction and data flow decisions.

Define minimal field-level inventory with purpose, owner, authorized access, processing grounds, sensitivity, approved recipients, retention, deletion and hold. Prefer certified registry references and pseudonymous IDs over raw identity evidence. Keep private media and verification material out of general logs, analytics, audit and receipt stores. For rights requests and appeals, verify identity proportionately, use separately scoped queues and reviewers, trace data through processors, hold per applicable policy, propagate deletion to projections/backups and reapply tombstones after restoration. Obtain written local counsel approval of scope and deadlines. No numerical retention is selected.

## Operational dependency owners

- **IAM and App Security:** named on-call, revocation and privileged recovery drills, grant review, evidence of least privilege and city separation. Thresholds for persistent stale grants and abuse require approval.
- **Platform and Data:** approved availability objectives and staffing, backlog/restore targets, redacted monitoring, failure containment across cities, reconciled recovery, tested rollback and stop authority.
- **Independent audit custodian and Privacy:** case-scoped access, key separation, access auditing, integrity checks, hold and deletion governance and privacy-safe incident evidence.
- **Country counsel, Trust & Safety and owner:** signed data and operating approvals, regulator/user communication criteria, locally appropriate verification and appeals coverage, approved budget. Advertising, tracking and payments remain outside the package.

Cost is **unverified**. Candidate drivers include identity operations/support hours, writer and backup capacity per approved partition, queue and storage retention, independent custody, restore exercises, privacy/legal review, staff coverage, incident response and contingency. Pattern B may cost more to operate initially due to service trust and monitoring. Verify quotes and staffing only in separately authorized scope. See [Phase 6 operating assumptions](../../launch-readiness/operations.md).
