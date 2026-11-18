# Privacy, jurisdictions and operational dependencies

Status: DESIGN. Today the demo uses synthetic data. The following boundaries are required before real data, staff accounts, media or commercial workflows can be considered.

## Country decision gates

| Planned market | Open decision and required evidence |
| --- | --- |
| Dubai, UAE | Qualified UAE counsel determines the applicable federal, free-zone and sector rules for the actual operator. Approve lawful bases, primary/backup regions, employees' remote access, processors, exception and transfer path, retention, incident and subject-rights processes. Record signed applicability and approvals before supplier selection. |
| Muscat, Oman | Qualified Oman counsel reviews the Personal Data Protection framework and relevant executive rules, including consent or other grounds, processing permit triggers, transfer safeguards, evidence handling, breach and complaint routes. Verify primary, backup and outsourced moderation/support access for this exact data flow. |
| Doha, Qatar | Qualified Qatar counsel confirms the operative framework for the actual operator, including any special-jurisdiction differences, protected data handling, permitted storage/transfer and support access, incident and rights obligations. Secure signed scope before choosing locations or processor arrangements. |

The [Phase 6 country source ledger](../../launch-readiness/jurisdictions.md) records dated official evidence and limits. This proposal assumes neither a shared-region solution nor mandatory localization. Qualified counsel must decide case by case. Primary storage, backups, audit replicas, media quarantine, analytics if ever separately approved, identity, key custody and vendor/employee access each need a flow decision. Block unapproved transfers including support tickets and diagnostic artifacts. No legal clearance or actual requirement interpretation is granted here.

## Data minimization and complaints

Use pseudonymous internal IDs and scoped grants; collect no optional identity evidence without an approved purpose. Prefer verified registry references and minimal attestations over identity document copies. Restrict necessary originals to encrypted private stores, deny default exports, and keep them out of analytics, logs, receipts, screenshots and ordinary audit. Store private reports and appeals separately from public records, preserve reporter confidentiality, and disclose only the minimum needed to resolve a case. Use a separate verification queue and an independent appeal reviewer.

Before collection, specify ownership/controller and processor roles, purpose, sensitivity, countries, access roles, consent/basis where required, retention, deletion deadlines, exceptions and hold owners. A proportionately verified rights request must be traced across storage, projections, region/custody and processors. Delete or redact under the signed policy, purge caches, expire backups as approved, and reapply tombstones on restore to avoid resurrection. Escalate holds and appeal requests independently. No formal retention durations or vendor terms are selected.

## Operations and recovery owners

| Owner role | Exit evidence |
| --- | --- |
| IAM on-call | Privileged revocation and recovery drill including terminated staff, stale sessions and queued tasks; regular access reconciliation. |
| Platform and data | Approved SLO, backup interval and RTO/RPO per data class and city, verified fail-safe and visibility purge, restore and consistency drill. |
| Security / independent audit custodian | Separate custody and key roles, access log review, tamper drills, alert escalation and audit backlog/mutation-freeze thresholds. |
| Privacy and local counsel | Approved flow inventory and transfer analysis, incident notification and rights deadlines, processor due diligence, retention and appeals runbook. |
| Trust & Safety | City-appropriate staff coverage, conflict checks, verification/appeals escalation and incident hold procedures, no commercial approval shortcut. |
| Product owner | Named people, budget, staffing, explicit scope and stop authority. Reapprove after material change. |

Monitor permission changes, revocation lag, anomalous privilege use, denied writes, audit/projection lag, data export and restore consistency without collecting unapproved tracking. Incidents require a named commander, least-privileged evidence capture, revocation, city isolation, reviewed regulator/user communication and independent post-incident checks. The design sets no SLA or cloud/vendor choice. See [operations baseline](../../launch-readiness/operations.md).
