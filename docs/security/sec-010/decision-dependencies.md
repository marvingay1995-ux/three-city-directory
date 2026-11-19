# D7 dependencies for proposed Muscat-first review

States mirror the [SEC-007 decision register](../sec-007/decision-register.md) and [SEC-009 reconciliation](../sec-009/decision-reconciliation.md). Oman scope input cannot close a global or cross-market decision.

| ID and current state | Accountable role | Oman dependency and decision evidence |
| --- | --- | --- |
| D7-01 PROPOSED | Product owner with AppSec/IAM, Data and independent Security | Indirect. Compare provisional server-mediated direction and API-first alternative for approved Muscat scope after D7-02/03/08/11. No direction selected. |
| D7-02 OPEN | IAM and Privacy | Direct. Identity fields, issuer and support access, step-up, expiry, revocation and recovery must fit approved Oman flows. Issuer undecided. |
| D7-03 OPEN | Data and IAM | Indirect. Approved residency and trust boundaries constrain storage and commit fencing. Prove revocation ordered first denies commit/replay, and commit ordered first retains history while subsequent unauthorized replay denies. Engine undecided. |
| D7-04 OPEN | Independent custodian and Security with Privacy | Direct. Review custody, trusted time, keys, recovery and remote access under D7-08/09. No custody topology or key authority selected. |
| D7-05 OPEN | Trust & Safety, AppSec and product owner | Direct for evidence and complaints. Verify-before-publish for the exact version stays the stricter candidate for later protected features. Affiliate conflicts, transfer dual control, withdrawal/reactivation and exceptions remain undecided. |
| D7-06 OPEN | Data, Privacy and Operations | Direct for retention. Receipt TTL, tombstones and key reuse must reconcile authorized retries with D7-03/09. No silent re-execution after expiry. |
| D7-07 OPEN | Platform and Operations with Security | Direct for restores and incident obligations. Agree enforceable visibility hold, purge/custody limits and RTO/RPO against D7-03/04/09/10. No live SLA. |
| D7-08 BLOCKED | Qualified Oman, UAE and Qatar counsel with Privacy for their markets | Direct. Obtain signed operator, processing, processor, region, staff, backup and transfer determinations for Oman. No approved region or supplier. Dubai and Doha require separate decisions. |
| D7-09 OPEN | Privacy and custody owner | Direct. Signed retention, hold, erasure and restore-tombstone schedule by approved class and flow, after D7-08. |
| D7-10 OPEN | Product owner, Operations and Finance | Direct for feasibility. Identify Muscat coverage, language, incident and escalation ownership. Reconcile recovery objectives and capacity. No spending or staffing authority. |
| D7-11 OPEN | Qualified independent reviewer and product owner | Indirect. Review the exact candidate and its approved Oman scope assumptions; record unresolved counsel and Privacy inputs separately. Engagement requires its own authorization. |
| D7-12 BLOCKED | Product owner | Indirect. Formal scoped adoption requires applicable signed decisions and independent design disposition. Authorize any next work separately. All later release gates remain open. |

## Order for review

1. Authorize counsel/Privacy work separately and obtain scoped Oman facts and decisions for D7-08/09. Reviewer scope planning for D7-11 can proceed internally while findings are pending.
2. After separate authorization, independent AppSec and Data review the candidate. Resolve D7-02/03 first for the authority boundary, then evaluate D7-04/05/06, and iterate D7-07/10 against approved flows and realistic staffing. Record where proof needs a later authorized implementation.
3. Return D7-01 and D7-12 to the owner for separately recorded architecture and adoption decisions. Maintain the freeze and stop if mandatory inputs are missing.
4. Follow separate checkpoints for synthetic proof, private implementation and future independent G2 assessment. G1, G3, G4, G5 and G6 keep their own clearance criteria. [Authorization checkpoints](authorization-checkpoints.md)
