# Audit and privacy contract — SEC-007/v1

| ID | Proposed invariant |
| --- | --- |
| P7-01 Minimal authoritative audit | Successful protected transitions MUST append an event within T7-04 with explicit schema, event ID, city, scoped resource, resulting revision, typed action and reason, pseudonymous actor, effective authority and policy revision, server timestamp and scoped correlation. Timestamps MUST derive from a trusted, monitored source and ordering MUST be explicit independent of clock skew. No raw command, token, national ID, account contacts, media locator or free-text evidence in event or receipt. Denied/security and access events require separately scoped minimal handling and MUST NOT masquerade as successful mutations. |
| P7-02 Independent custody and tamper evidence | Application role may append the minimum event, with no rewrite/delete. Custody, case-scoped reader, hold/expiry approver, recovery and signing key roles MUST be segregated and independently reviewed. Checkpoints MUST bind state/event/receipt/outbox and delivery evidence to an independently held integrity anchor. Verify signatures and protect rotation/revocation as applicable. Hash agreement alone MUST NOT count as durable custody or evidence against a party that can rewrite both history and anchor. Unverifiable required audit MUST hold affected writes or visibility. |
| P7-03 Approved flow and minimization | Every real field, processor, staff/vendor access region, transfer, primary store, backup, restore and expiry MUST be authorized for its exact purpose, jurisdiction and sensitivity before activation. Protect private evidence separately, collect minimal references and deny unapproved access/export. City scope is not residency. No provider, retention or transfer approval is inferred. |
| P7-04 Retention, rights, holds and restore | Approved and enforceable rules MUST separate audit access from controlled expiry, redaction and legal holds. Log privileged access and approved hold/deletion actions. Reconcile scoped receipts/events/custody, apply approved deletion and visibility tombstones to projections/backup restores, and deny resurrection. Use independent appeal and retention review. Restore MUST reconcile before reopening under T7-06. |

## Proposed data and transfer inventory

| Class | Required boundary before activation |
| --- | --- |
| Identity, session and grants | Minimal internal identifiers and scoped grants. Separate contact/identity mappings, secrets and key custody. Map issuer, support access, revocation data and log destinations. |
| Business, media and private verification evidence | Approved public fields only; prefer proof references. Separate quarantine, approved derivatives and authorized records. Exclude private media, addresses and identity evidence from audit, cache, receipts and exports by default. |
| Queue, receipts, moderation and appeals | Typed payloads, scoped processing and minimal receipts; separate private reports and evidence; confirm custody/processor locations, retention, reviewer authority and deletion. |
| Audit, logs, projections and backups | Minimized scoped audit, access and incident logs. Public projections contain approved fields only; backup/DR, tombstone and purge enforcement reviewed across every approved location. No anonymous transfer assumption. |

## Jurisdiction decisions — OPEN

- **Dubai / UAE:** qualified UAE counsel and Privacy MUST confirm actual operator and applicable federal, free-zone or sector obligations, verification scope, issuer/support access, primary and backup locations, transfer bases, key/custody and incident rules.
- **Muscat / Oman:** qualified Oman counsel and Privacy MUST confirm processing and permit applicability, permitted transfers and remote moderation, custody and restoration flows, complaint, deletion and notification duties.
- **Doha / Qatar:** qualified Qatar counsel and Privacy MUST confirm applicable national or special-zone rules, private evidence/retention, regional backup and staff/vendor access, transfer conditions, complaint and incident rules.

Signed mappings are prerequisite to location, supplier, data collection and retention approval. Approved schedules, restoration bounds, time and key authorities remain OPEN under D7-04, D7-08 and D7-09. See the dated [Phase 6 official source ledger](../../launch-readiness/jurisdictions.md) and [SEC-006 privacy dependencies](../sec-006/privacy-operations-dependencies.md). No jurisdiction clearance is granted.
