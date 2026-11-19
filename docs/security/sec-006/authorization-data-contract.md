# Authority, tenancy and technology-neutral records

## Trusted identity and authorization

For future authorized work, the trusted issuer and authenticating ingress establish a stable internal principal from verified issuer/subject, audience, signature, expiry and applicable nonce/state, using the approved SEC-004 protocol design. No caller actor, city, role, ownership or approval claim creates authority. Bind sessions to assurance, audience, expiration, revocable session, grant and policy versions. Establish short session/renewal limits, privileged phishing-resistant MFA and recent step-up, controlled provisioning, deprovisioning, account recovery, and independently reviewed break-glass. Staff recovery must remove stale sessions and must not issue extra grants. Cookie and API boundary requirements follow [SEC-004 authorization](../sec-004/authorization.md). No issuer, credentials or tokens exist in SEC-006.

Deny by default. Match current enabled city, exact resource scope and action. Owner may submit owned versions. City moderator decides only eligible cases without ownership or affiliation conflicts. Separate verifier and administrator publication require distinct stable principals and version-specific approvals, despite role changes. Scope auditors to authorized city and case. Privileged grants are explicit, versioned, time-limited and never widened by their holder alone. Withhold private object existence on unknown and forbidden scopes. A service identity is separate and limited to purpose, city and operation. Workers check originating scope and current authority for actor-dependent work. An authenticated job envelope alone is not a fresh permit.

- **API:** authenticate, resolve validated city and exact resource, check authority and limit disclosure. Negative paths include wrong city/object, self-review, role escalation, delegation and unauthorized reads.
- **Storage / command:** re-evaluate current grant, session versions, resource ownership, policy, conflict rules and expected revision in the commit fence. Revocation ordered before a write or replay must deny. If current authority cannot be proven, fail closed.
- **Jobs and exports:** independently verify scoped worker/case/recipient grants at dispatch and processing, limit fields, audit access, recheck on retry, and quarantine ambiguous tasks. No unrestricted cross-city worker or bulk export.
- **Cache:** private data is never shared-cacheable. Public projection and cache use city, exact published revision/policy and normalized permitted query. Revalidate visibility or fail closed when a withdrawal or hold cannot be honored.

## Candidate logical records and constraints

All tables/aggregates below are proposals. Scope is an immutable city identifier plus stable record keys. Physically separate storage remains an open jurisdiction decision.

| Record | Candidate key and invariants |
| --- | --- |
| Principal / service identity | Internal opaque ID, unique trusted issuer/subject pair by applicable identity realm. Enabled, assurance and service audience/purpose recorded separately. |
| Session / grant / policy | Unique session and revision lineage bound to principal. City/action grant references valid principal and city; unique scoped grant identity and monotonic version. Store expiry and revocation, coordinate them with the command fence. Tenant policy version is explicit. |
| Listing / ownership | Unique `(city_id, listing_id)` and `(city_id, slug)`; ownership relationship tied to same city and eligible principal. Transfer increments revision and invalidates prior authority/decisions. |
| Revisions / decisions | Unique `(city_id, listing_id, revision)`; conditional advance by exact expected revision. Decision FK references exact scoped version, typed actor/action/reason, policy and assurance; publish verifies segregation and current approvals. |
| Idempotency receipt | Unique `(city_id, principal_id, action, resource_id, idempotency_key)`, validated canonical fingerprint, original revision/outcome and event link. Keep minimum needed for replay horizon. |
| Audit / outbox | Unique event ID with scope-constrained FKs and revision uniqueness; outbox uniquely references the event and contains authorized payload/projection intent. No raw commands or identity documents. |
| Projection / checkpoint | Scoped entity plus monotonic revision and processed-event uniqueness. Checkpoint binds authoritative version, event head, delivery ledger and custody verification; preserve tombstones. |

Use scoped FKs and constraint checks wherever possible, alongside application authorization. Immutable IDs, explicit read and write predicates, grant/version checks and independently tested migration backfills are required. Validate duplicates and orphan scope before enabling constraints; rehearse expand/backfill/verify/contract and rollback with synthetic data. No trust in a migration that bypasses current policy, fabricates historic audit, silently reassigns city or ignores deletion tombstones. A migration plan, schema tool, storage engine and data placement need separate approvals.
