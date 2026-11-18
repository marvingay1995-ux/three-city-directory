# Launch risks and decision register

**Decision D-001, 2026-11-18: NO-GO.** Open evidence gaps are blockers. No numerical readiness score is used. Role names below are proposed accountable functions. The product owner must assign named people and obtain dated approvals. No gate is cleared by this PR.

| Priority | Risk | Owner and next action | Exit evidence |
| --- | --- | --- | --- |
| P0 | Unconfirmed activity, ad and sector permissions across three jurisdictions | Country counsel independently reviews the actual operator, model and regions | Three written opinions, verified licences/permits or documented exclusions, and approved complaint and disclosure rules |
| P0 | PostCSS advisory findings and no production identity/authorization boundary | Release Security and engineering triage, remediate and independently retest | Supported patched dependency baseline, no unresolved launch-blocking findings, negative auth/city/approval tests and written security approval |
| P0 | Prospective data processing and international transfers lack approved basis or controls | Privacy lead and country counsel map flows and processors | Signed data/transfer reviews and tested deletion, data rights, incident and processor controls |
| P0 | No proven readiness for incidents, backup/restore or fraud/complaint queues | Operations and Trust & Safety staff and rehearse procedures | Signed SLO and staffing plan, successful restore/rollback/incident and complaint drills |
| P0 | Product owner has not authorized a launch | Product owner accepts exact scope after independent clearances | Dated written decision with jurisdictions, feature flags, contingency and stop authority |
| P1 | Accessibility outcomes and browser support are incomplete | Independent accessibility reviewer expands manual and device coverage | WCAG 2.2 AA evaluation, blocker closure and documented residual exceptions approved before launch |
| P1 | Local smoke cannot establish production performance, cache isolation or elasticity | Platform owner defines and exercises targets | Approved representative load and city-cache test, recovery budget and monitoring review |
| P2 | Narrow RTL smoke does not establish Arabic localization or translated policy usability | Localization and editorial owners plan terminology, bidirectional and translation checks | City-reviewed copy and assistive technology results if required by G1 or G4 |
| P2 | Commercial decisions and unit economics are unverified | Finance and owner review staffed scenarios and request quotes only after authorization | Approved quotes, budget and separate commercial review |

| Mandatory gate | Independent reviewer | Minimum exit criteria | Status |
| --- | --- | --- | --- |
| G1 Legal and advertising eligibility | Qualified UAE, Oman and Qatar counsel | Written applicability and launch permissions for each in-scope country, verified rights, required approvals and disclosures | Open |
| G2 Security | Independent security reviewer | Remediated dependency findings, reviewed architecture, penetration and tenant isolation evidence, security controls and tracked exceptions | Open |
| G3 Privacy | Privacy lead with counsel | Approved inventory/bases, transfer mechanism, residency and vendors, functioning rights/deletion and breach flow | Open |
| G4 Accessibility | Accessibility reviewer independent of implementation | Representative WCAG 2.2 AA review across assistive technologies and devices, blocker remediation and retest | Open |
| G5 Operations and trust | Duty owner and independent recovery reviewer | Approved budget and on-call coverage, moderation/appeal drills, load/monitoring evidence, rollback and successful restore | Open |
| G6 Product authorization | Product owner | Accept all supporting sign-offs for named jurisdictions and features, authorize release separately in writing | Open |

Log evidence link, reviewer, signed date, scope, expiration and reopening triggers for each gate. Any missing or expired clearance, dependency regression, serious privacy/security incident, loss of moderation coverage or material scope change reopens the decision. The stop/rollback authority must be named before any authorized pilot.
