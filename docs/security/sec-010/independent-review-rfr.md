# Proposed request for independent design review

**Internal draft. External engagement NOT AUTHORIZED.**

Review **SEC-007/v1**, frozen for review and unsigned, against the [candidate evidence manifest](evidence-manifest.md). Require demonstrated competence in OIDC and session assurance, multi-tenant city/object authorization, ownership and conflicting duties, revocation/commit races, atomic storage and outbox, audit custody and recovery. Require disclosure of authorship, implementation/reporting relationships, financial or vendor interests, and conflicts. Exclude anyone who designed or implemented the candidate or cannot report adverse findings directly to the owner. Use qualified specialists for gaps. Oman counsel and Privacy determine their own scoped requirements.

| Contract | Questions the reviewer should answer |
| --- | --- |
| A7-01, A7-02, A7-03, A7-04, A7-05, A7-06 | Can identity or stale/revoked grants cross ingress, session, city/object, duty, commit or worker/cache/export boundaries? Does each refusal protect private existence and content? |
| T7-01, T7-02, T7-03, T7-04, T7-05, T7-06 | Is command/version binding explicit? How would competing revocation and writes serialize, exact and conflicting retries behave, commits stay atomic, withdrawal hold visibility, and restore reconcile safely? |
| P7-01, P7-02, P7-03, P7-04 | Are records minimized, time and custody independently trustworthy, market flows approved, and retention/rights/deletion enforceable across restore? |

Proposed scope is repository code, design and test evidence from SEC-004 through SEC-009, restricted to the exact approved snapshot and synthetic fixtures. Optional local reproduction on loopback requires express permission. Production access, credentials, personal data, scanning or testing external targets, real accounts, third-party contact and spending are outside current authorization.

Accept a dated, attributable report naming exact commits and evidence, scope/conflicts, all 16 dispositions, independently reproduced results if authorized, limitations, severity, remediation/owners, retest and expiry/reopening criteria. Request a scoped design opinion and identify unresolved G2 evidence. Design disposition supplies one input to later adoption. Production assessment needs its own authorization and implementation evidence.

## Blank future authorization instrument

**NOT AUTHORIZED.** Leave blank until the owner authorizes the exact engagement in writing.

| Required entry | Value |
| --- | --- |
| Reviewer name, affiliation and qualifications | |
| Independence declaration and conflict disposition | |
| Exact candidate, objectives and boundaries | |
| Permitted data, files, environment, targets and techniques | |
| Duration, due date and authorization expiry | |
| NDA/contract, retention/destruction terms and budget if relevant | |
| Named stop authority, incident contact and reporting line | |
| Product-owner written approval reference, signature and date | |
