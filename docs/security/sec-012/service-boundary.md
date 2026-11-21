# SEC-012 — Proposed service boundary and data-flow inventory

**Classification: scope model for discussion, not production architecture.** This separates the existing tested fictional interface from possible future services, which remain excluded and unapproved.

| Surface or flow | Today (verified source-level demo scope) | In-scope for Muscat **study only** | Out-of-scope future change and prerequisite |
| --- | --- | --- | --- |
| Landing/city selector | Fictional three-city navigation, explicit city selection | Consider how to describe a Muscat editorial concept | Public availability requires G1–G6 and an owner GO |
| Search, sort, category and compare | Local demo discovery; URL query parameters; comparison state in session component | Evaluate terminology, accessibility and usability | Real search analytics, personalization, tracking or customer accounts require privacy/security review |
| Fictional profile and gallery | Six synthetic profiles; CSS-authored artwork, no real provider images | Evaluate rights and veracity policies for any later product | Real photos, addresses, identity, contact and provider verification require source/consent/rights and moderation approvals |
| Sponsored sample | Marked example in fixture | Ask whether a paid advertising business model would be pursued at all | No paid creative, invoices, analytics, advertiser account or campaign delivery |
| Visitors | Anonymous local private reviewers, no production audience | Define intended future audience and language without identifying people | Real identities, age verification, preferences and support interactions need new scope |
| Requests/server logs | Local/CI loopback testing; third-party production processing not authorized | Ask Privacy which technical logs would count as personal data in any future deployment | No hosting, telemetry or data collection approval from SEC-012 |
| Listings/submissions | No real onboarding or user-submitted records | Discuss proposed verification and moderation evidence classes | Identity provider, forms, CRUD APIs, durable storage and publishing require separate architecture adoption and G2/G3/G5 |
| Data residency/access | No approved production region, cloud, staff access or subprocessors | Create hypothetical flow diagram only after operator facts are known | No provider, database, staff-access grant or transfer setup before D7-08 |
| Complaints/moderation/appeals | Offline proposals only | Map possible responsibility and escalation scenarios | No operational queue, real cases, retention or manual contact launch |
| Transactions/referrals | None | Excluded from proposed study | No meeting coordination, messaging, booking, commerce, crypto or payment integration |

## Data classes for later field-level analysis

| Class | Present in live system? | Required future decision |
| --- | --- | --- |
| Public fictional profile fixture data | Present only in offline/demo source | No claim of a genuine business or person; fictional notices must remain |
| Local browser URL/search preferences | Used in demo request/state; not collected as an analytics pipeline | Data minimization and retention for any real hosted request logs |
| Operator/advertiser identities and registration evidence | **NO** | Necessity, legal basis, controller/processor, verification, access, expiry and deletion |
| User identities, contact messages and booking details | **NO** | Entirely new product decision; cannot enter the present scope |
| Real photos/consent/IP licenses | **NO** | Rights source, consent validation, withdrawal/takedown, provenance and retention |
| Audit/moderation/complaint records | **OFFLINE DESIGN ONLY** | Authority, trusted time, custody, residency, immutable evidence handling, appeals and retention |
| Payment, transaction and ad metrics | **NO** | Separate commercial, regulatory, security and privacy authorization |

No precise geolocation is needed for the fictional demo. A city URL is not evidence of user residence or a lawful data-transfer destination. **Do not choose infrastructure regions or processors using the city slug.**

## Scope decision consequences

An owner decision to **study Muscat first** would authorize *only* internal comparison and fact collection under the current no-spend/no-provider constraints. It would **not** authorize contact with counsel, processing of real data, advertisement submission, hosting, activation or any of the independent G1–G6 gates.

A later authorized assessment must specify: exact version, operator, activities, data classes, fields and source, controller/processor and access roles, countries and region boundaries, storage/backup/restore, vendor/subprocessor chain, retention/deletion, complaint responsibilities, and public vs internal-facing exposure. Any unfilled field is an explicit **STOP** for the affected implementation step.

Reference: [SEC-010 authorization checkpoints](../sec-010/authorization-checkpoints.md) and [SEC-011 readiness](../sec-011/pre-release-readiness.md).
