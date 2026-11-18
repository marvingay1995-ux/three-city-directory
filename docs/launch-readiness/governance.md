# Proposed privacy, moderation and advertising governance

The current app consumes fictional fixtures, accepts search terms in URLs and offers offline prototypes. No production data collection or workflows are implemented. Future query strings can contain identifiers and can leak through browser history, referrers and vendor/edge logs. Redact query strings, scope cache keys, set an approved referrer policy and test log minimization before a real service.

## Proposed inventory and flows

| Data and future flow | Minimum and access boundary | Provisional retention decision |
| --- | --- | --- |
| Business listing fields → verification → redacted public catalogue | Business name, approved category, city and reviewed public fields. Owner may edit only owned drafts. Separate private supporting evidence. | Delist promptly on revocation or expiry; define purge and approved archival windows. |
| Account and advertiser records → identity/authorization | Store least necessary pseudonymous ID and role grants. Restrict contact and contracts to authorized operations. Ads remain separately gated. | Delete inactive records per approved schedule and obligations. Avoid duplicate identity documents. |
| Verification evidence → restricted review store | Registry reference rather than document copy where feasible. City-assigned verification reviewers only. No secrets, payment or unnecessary national IDs. | Delete raw evidence after verification plus approved dispute window or lawful hold; retain minimal decision proof. |
| Reports/appeals → city queue → resolution | Collect only facts needed to act. Protect reporter identity from listing owners. Escalate urgent issues privately. | Approved dispute retention and holds; purge attachments and redact unnecessary narrative. |
| Decisions, audits and privileged access logs → separate store | Immutable event IDs, restrained reason codes, actor role, scope and revision. Keep raw complaint detail out of audit. | Independently approve retention by event type, access review, backup expiry and pseudonymization. |
| Media → quarantine → rights/safety review → approved derivative | Scan type and size, strip metadata, reject unsupported material, protect originals and review licence scope. | Delete rejected/superseded originals, sync removals to derivatives and caches, respect approved holds. |
| Analytics and advertising measurement | Remain disabled. Any proposed future events need a purpose, minimization review and separate permission. | No event collection or retention authorized. |

Publish a field-level register with owner, controller/processor roles, purpose, lawful basis by country, sensitivity, recipients, storage and staff access regions, approved deletion date and legal hold rule. Counsel must evaluate consent versus other permissible grounds, notices and withdrawals. Controller and processor terms, subprocessor changes, remote support, backup location, telemetry destinations, access logs and transfer mechanisms require separate approval. Reject vendors whose regions or support access cannot satisfy the approved matrix.

## Rights and incidents

The proposed rights workflow records a request, verifies identity proportionately, assigns the correct jurisdiction, searches processors and backups, applies approved exceptions, and tracks response and appeals. Set deadlines from qualified country advice, reconcile deletions and record completion without retaining excess identity data. For incidents, preserve minimal evidence, contain exposure, revoke access, assess affected scope, and follow signed regulator/subject notification criteria. Run tabletop and deletion exercises before launch.

## Moderation and advertising release rules

- Verify trade registration, representative authority and activity/sector eligibility with the relevant official register. Distinguish verification of identity from editorial approval and from actual publication.
- Use separate queues for listings, ownership claims, user reports, advertising creatives and appeals. Restrict access by city and role. Require a separate publish permission, second review for high-risk actions, periodic re-verification, reason codes and auditable removals. Provide an appeal route to an uninvolved reviewer and document time-based escalation and lawful emergency takedowns.
- Reject deceptive/impersonating material, illicit businesses and prohibited content. Block regulated sectors and unresolved legal, claims, language or rights cases until qualified local review clears exact scope. Preserve the exact asset, destination, disclosure and decision version for any approved creative.
- Keep paid inventory visually and semantically separate and independently ranked. Require labeled placement and substantiated claims. No eligibility inference from simulated approval. Defer billing, tracking, consent-dependent analytics, frequency safeguards and advertiser onboarding to separate policy and product approvals.

See [country questions](jurisdictions.md) and [release gates](release-gates.md) for decision owners.
