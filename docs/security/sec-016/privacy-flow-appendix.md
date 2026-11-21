# SEC-016 — Hypothetical personal-data and transfer map (not implemented)

**No live data flows or infrastructure are approved.** A city page's `/muscat` route does not determine the jurisdiction of data storage, the location of an operator or the lawful basis for processing.

| Data class | Source if a later real service is approved | Prospective purpose | Unresolved privacy/control issues | Present status |
| --- | --- | --- | --- | --- |
| Site access/IP and service logs | Visitor requests, hosting/CDN | Availability, security | Whether personal data, minimization, location, retention and incident response | NO HOSTING / NO APPROVED COLLECTION |
| Advertiser entity and representative | Authorized business intake | Identity, business and eligibility verification | Controller, lawful basis, documents, restricted access, deletion and dispute rights | NO ADVERTISER INTAKE |
| Ad creative, rights and claims | Verified advertiser | Review and publication | Image/portrait/trademark consents, rights withdrawal, moderation evidence | FICTIONAL CONTENT ONLY |
| Moderation/complaints/appeals | Visitors or advertisers | Abuse reporting and remedy | Identity, content sensitivity, lawful hold, access, erasure, audit custody | NOT IMPLEMENTED |
| Sponsor campaign records | Approved campaign operator | Contract fulfilment and expiry | Data fields, access controls, event integrity, retention | NO PAID CAMPAIGNS |
| Aggregate ad reporting | A separately approved measurement design | Billing/accountability | Avoid individual tracking; lawful basis, minimization, fraud and disputes | TRACKING NOT AUTHORIZED |
| Payment/invoice/tax | Approved legal operator/payment processor | Commercial settlement | Contracting party, legal/tax compliance, processor terms, secure handling | PAYMENT NOT AUTHORIZED |
| Support/staff accounts | Approved operator | Identity and role-based review | Real IAM, access/remote support region, incident logs and revocation | NO PRODUCTION IAM |

## Region, transfer and processor questions — all UNKNOWN

Primary environment, caches, backups, disaster recovery, support access, key custody, downstream processors, retention/deletion and international transfers remain **UNKNOWN / NOT SELECTED**. A field-by-field Oman Privacy determination must be recorded for actual scope; regulator or counsel classification and duties should be checked by qualified professionals. SEC-007/v1 remains **unsigned and unadopted**; D7-08 and D7-12 are **BLOCKED**, so this appendix does not choose an architecture, provider or storage region.

No public user activity is tracked in the private demo. A future hosted read-only version may create access logs and privacy obligations despite having no accounts, so scope any future public pilot with its **real** technical flows rather than assuming it processes no personal data.

Do not create analytics, pixels, cookies, IDs, account forms, uploads, moderation endpoints, payment connections or external storage to validate this paper exercise.
