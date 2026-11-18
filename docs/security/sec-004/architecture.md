# Trust boundaries and protected assets

## Current boundary

The Next.js demo reads the fixed public fixtures through the existing directory module. The checked-in application has no real identity issuer, session authority, privileged handlers, persistent store, private media pipeline, production workers or live ad integration. Phase 4 fixture actor references carry no authentication authority. Phase 4 and Phase 5 receipts and history live in memory and provide evidence only for the simulations. Build provenance and audit results from SEC-003 concern the demo supply chain.

## Proposed production boundaries

```text
 Untrusted visitor/owner/staff browser
             | TLS; bounded inputs; separate public and staff origins
             v
 App/API boundary -------- trusted session verifier <---- identity issuer
             |               |                                ^
             |               +---- session/revocation store    | managed secrets/signing keys
             v
 Tenant/object authorization <---- authoritative grants, policy versions
       |              ^            (minimum current version; deny unknown)
       |              |
       |          background worker with its own scoped principal
       v
 Command transaction: scoped object + state + immutable event + receipt + outbox
       |        |                        |                          |
       |        +--> private media refs  +--> append-only writer     +--> idempotent projector
       |              / quarantine            |                           |
       |              workers                 v                           v
       |                                   audit storage          published allowlisted fields
       |                                        |                         |
       |                                        v                         v
       +--> scoped private reads, no shared cache              city-partitioned public cache
                                      |
 Authorized support, auditors and incident responders use separated case-scoped channels.
 Vendors, backup locations, custody, support and transfers are independent trust boundaries.
```

This diagram is logical. It does not choose a cloud, provider, host, database, network layout or residency region. “Immutable event” at transaction time is an append-only contract with separately governed durable custody described in [transactions and audit](transactions-audit.md).

| Asset / boundary | Required control | Fail-closed behavior |
| --- | --- | --- |
| Identity, session, grants and keys | Verify issuer/session, keep key custody separate from work queues, restrict service identity and revocation data access. | Deny protected reads/writes when issuer assurance, current grants or required step-up cannot be verified. |
| City-scoped drafts, moderation and approvals | Resolve scope and owner on the server; require city and object predicates through every storage and worker operation. | Missing or ambiguous scope denied, no fallback to another city or implicit wildcards. |
| Private media, verification and reports | Quarantine and restricted access; reviewed type/size/rights; public derivatives only from approved projection. | No raw asset, document URL, complaint identity or pending material flows into public cache/logs. Media failure holds publication. |
| Audit/store and private exports | Append-only policy and separated readers, restricted exports, restore controls, per-case access logs. | Required transactional audit failure aborts write. Custody backlog triggers mutation freeze at an approved limit. |
| Vendors and responder access | Contract, permitted regions, minimum egress, named incident permissions, privileged access logged. | Block an unapproved flow or stale access grant. Public safe reads may continue only within the incident plan. |

Forbidden flows include private draft/status data into shared caches, verification evidence through text fields, cross-country replication or support without approved mapping, or client claim metadata into authorization. Ingress and egress controls must be exercised against the exact future environment. Noindex remains crawler guidance. See [SEC-002 demo perimeter](../sec-002/boundaries.md).
