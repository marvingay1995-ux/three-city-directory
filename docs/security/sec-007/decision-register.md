# SEC-007 decision and authorization register

All states are current for the review candidate. **No item is APPROVED.** APPROVED requires a written signed decision with exact scope, evidence, named approvals and any expiry. A merge or date does not qualify. No deadlines or expiries have been set.

| ID / state | Decision owner role | Prerequisites and evidence | Approval or stop effect |
| --- | --- | --- | --- |
| D7-01 PROPOSED | Product owner with AppSec/IAM, Data and independent Security | [Architecture ADR](architecture-decision.md), browser assumptions and alternate review. | Approves direction only with written agreement. Stop on scope changes or missing design controls. |
| D7-02 OPEN | IAM and Privacy | A7-01/A7-02, [identity contract](authorization-contract.md). Assurances, issuer/session/grant lifecycle, issuer and staff recovery. | No provider, session configuration, identity activation or provisioning. |
| D7-03 OPEN | Data and IAM | A7-05/T7-02, [transaction contract](transaction-contract.md). Authoritative grant storage, engine and lock/fence ordering proof. | No real engine or mutation path while authority/commit ordering remains unproven. |
| D7-04 OPEN | Independent custodian and Security with Privacy | P7-01/P7-02, [custody design](audit-privacy-contract.md). Trusted time, keys, anchor, custody and recovery evidence. | No durable audit implementation without isolated custody and integrity review. |
| D7-05 OPEN | Trust & Safety, AppSec and product owner | A7-04/T7-01. Define affiliation, transfer dual control, verify-before-publish exceptions and withdrawal/reactivation rules. | Deny unresolved conflicts. No exceptions or automatic reuse of approvals. |
| D7-06 OPEN | Data, Privacy and Operations | T7-03. Receipt retention/tombstone, expired key, timeout and retry rules against privacy and recovery needs. | No live replay policy or timestamps/retention chosen. |
| D7-07 OPEN | Platform and Operations with Security | T7-05/T7-06. Visibility revocation target, purge/outage/custody lag, RTO/RPO and fail-closed recovery tests. | No approved visibility SLA or live projections. Freeze if required boundaries are unproven. |
| D7-08 BLOCKED | Qualified UAE, Oman and Qatar counsel with Privacy | P7-03, [country questions](audit-privacy-contract.md). Confirm operator, approved city/data, residency, staff access, transfers and vendors. | No hosting region, transfer, supplier or processing authorization until qualified sign-off. |
| D7-09 OPEN | Privacy and custody owner | P7-04 and country outcomes. Retention, holds, erasure and restore tombstones. | No approved schedule or deletion exceptions. |
| D7-10 OPEN | Product owner, Operations and Finance | [Operational dependencies](../sec-006/privacy-operations-dependencies.md). Named staffing/on-call, costs, vendor options, stop authority and approved scope. | No spend, supplier, staff privileges or pilot. |
| D7-11 OPEN | Qualified independent security reviewer and product owner | [Handoff](verification-handoff.md). Exact candidate, authorized test scope, independence and qualifications, evidence custody and remediation/retest. | G2 stays NOT CLEARED until independent signed disposition. All other gates remain separately OPEN. |
| D7-12 BLOCKED | Product owner | Signed D7 adoption and explicitly scoped next work order. Later deployment requires separate G1–G6 clearance. | No SEC-008, production implementation or live release. |

Dependencies follow the [SEC-006 staged gates](../sec-006/implementation-gates.md). Record named reviewer roles and people, scope, signature, date, expiry, assumptions and reopen conditions before updating a status. No provider, infrastructure, authority escalation, or launch follows from this candidate.
