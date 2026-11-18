# Identity, session and city authorization contract

Statuses in this document are DESIGN. No production session issuer, grants or policies have been activated.

## Identity and session boundary

Use stable verified issuer/subject pairs mapped to internal pseudonymous principal IDs. Browser-submitted actor references, role values, city IDs, contact claims and asserted ownership are request data. They never become principals or grants. Treat a business claim as a separate reviewed association. Maintain authoritative records of grants, object ownership, policy version and account state.

Two identity options are compared in the [ADR](adr.md). In either option, for OIDC authorization-code sign-in, register exact redirect URIs, use PKCE and bind state and nonce to the initiating browser/session. Validate allowed issuer and audience, signature and algorithm, expiry and applicable not-before, nonce and authorized party where applicable. Restrict key sources and rotate with a bounded old-key policy. Use an ID token for sign-in validation and a properly scoped access token or server session for APIs. Do not let an ID token serve as a general API bearer. [OpenID Connect Core](https://openid.net/specs/openid-connect-core-1_0.html) · [OAuth security BCP](https://www.rfc-editor.org/rfc/rfc9700.html)

Bind each protected session to a verified subject, session identifier, active grant/policy revision, assurance and step-up time. Revalidate grants when a request reaches the enforcement boundary. Missing, stale or revoked records deny. Refresh can produce only the currently authorized scope. Rotate session identifiers on authentication and privilege elevation; enforce idle and absolute limits and revoke on logout, recovery, termination, suspected compromise and grant change. Session lifetimes and freshness targets require approval. Staff privileged operations need phishing-resistant MFA and recent step-up. [NIST SP 800-63B](https://pages.nist.gov/800-63-4/sp800-63b.html)

For a browser cookie-bound session, use HTTPS, Secure, HttpOnly, host-only scope, and a reviewed SameSite policy. Keep long-lived tokens server-side for that pattern. Protect every mutation with a bound anti-CSRF token and origin checks, reject unsafe methods on read endpoints, and tightly configure CORS. Validate login initiation/return and test session fixation and cross-origin flows. [OWASP CSRF guidance](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

Provision staff and grant changes via separately approved, auditable requests with explicit cities, conditions, effective/expiry dates and independent review; suspend/deprovision grants, sessions, worker leases and queued commands on removal. Account recovery uses an assurance-appropriate verified process, invalidates old sessions and factors, and cannot grant a role, city or ownership. Service principals have separate identity, short-lived audience-constrained credentials, exact purpose and city/object scope. Keep human credentials out of workers. Break-glass is incident-only, named, time-bound, independently approved where practicable, audited and reviewed. It can contain/revoke and does not grant unilateral publication or audit deletion.

## Permission matrix

Every protected permission below also requires active assignment to the resolved city, in-scope object, fresh policy/grant and sufficient assurance. Role membership alone never grants cross-city access. A global security role has no implicit city or content permissions.

| Principal / grant | Allowed operations for approved city and resource | Separation |
| --- | --- | --- |
| Visitor | Read explicit public projection of published, visible city records | No drafts, reports, private media, exports or writes |
| Business owner | Inspect and edit owned drafts, submit approved object types, request review or appeal on own case | Current ownership link required on each request. Cannot review, decide, publish, verify or transfer ownership alone. |
| City moderator | Inspect assigned review queues, start review, approve/reject with allowed reason, handle assigned appeals | Cannot decide own/affiliated submissions or previous decisions on appeal. Cannot publish or verify. |
| City administrator | Scoped publish/unpublish after referenced approval and separate verification requirements; constrained policy operations only if independently delegated | Different principal from submitter, reviewer/approver and verifier for the same version. Cannot self-approve or enlarge own grants. |
| Scoped verification reviewer | Review ownership and verification evidence, record decision and expiry | Independent of submitter, moderation approver and publisher; verification changes are separately audited and expire. |
| Scoped advertiser reviewer and approving reviewer | First checks creative rights, destination and local eligibility; distinct second principal approves the exact version if a separately authorized ad feature exists | No approval of own creatives and no sale or activation authority. Approval does not schedule, deliver, verify or affect organic ordering. |
| Platform security / auditor | Scoped incident containment or case-bound redacted audit read under explicit separate grant | No editorial publish, ordinary ownership changes, bulk ad access or audit mutation. Readers cannot alter custody or retention alone. |
| Service principal | One explicit command family or projection, with a matching subject/city scope and fresh worker authority | Cannot act as a generic administrator or forward client-supplied grants. |

Multiple roles never bypass transaction-level separation, including when a staff principal has changed roles since the earlier action. Compare stable principal IDs in decision records. Scope loss, transfer, removal or policy change can invalidate approval; keep versioned decisions and require re-review instead of reusing a stale approval. Ownership changes are their own supervised command with proof and separate approval, not editable listing fields.

## Enforcement through each layer

- **API:** normalize the requested city against the approved registry, resolve resource through scoped lookup, then authorize action and disclosure. Choose consistent non-enumerating responses for scope mismatch and missing private objects. Administrative endpoints would require separate implementation and testing.
- **Service/transaction:** recompute grant, ownership, conflicts, policy and expected revision at the protected write boundary. A version observed at the edge is not enough for a commit.
- **Repository:** require a trusted scope argument for every private query, mutation and aggregate; use city/object joins and composite constraints. No unscoped fallbacks or public identifiers as private authority.
- **Worker:** verify service scope, originating command and current revocation grants where actor authority is required. An earlier queue message does not supply authority. Reject invalid tenant or resource versions; quarantine failures.
- **Exports, audit and media:** explicit purpose, permission and city-level filters; record an access event and restrict sensitivity, time, recipient and delivery. No cross-city bulk artifact merely because the requester can browse several cities.
- **Cache:** do not share private responses. Public keys include city, publication policy/version and normalized query where cached. Purge by city/resource on visibility change; do not serve stale restricted content during invalidation or recovery.
