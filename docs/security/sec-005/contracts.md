# Synthetic contracts and consistency model

## Authority and object scope

Each installation of the fixture authority has a private registry and a WeakMap of immutable opaque handles. It issues handles for known synthetic IDs by explicit test fixture calls. The handles retain principal, grant revision, session revision and policy revision in the private registry. A fixture-controlled logical expiration and version changes model stale or revoked permissions. These handles are process-local test objects with no cryptographic identity or authentication. The test orchestrator has complete control of fixture issuance, policy changes and detached snapshots.

A schema-v1 command admits exactly city, resource, action, expected revision, idempotency key and the action's typed payload. It has no actor/role field. City in a command selects a requested scope and cannot grant it. The policy checks known city, current immutable authority handle, role, exact scope, ownership or applicable conflict rules. Missing and foreign objects and absent authority return the same `denied` status, without testing timing side channels. Duplicate listing IDs in the three cities are deliberately seeded. Separate audit reads require a scoped auditor context. Visitors have no privileged permissions.

| Command | Source → result | Additional guard |
| --- | --- | --- |
| Submit | Draft or rejected → submitted | Current owner. Advance content version, reset prior participants and verification. |
| Start review | Submitted → in review | City moderator other than owner or submitter. |
| Approve / reject | In review → approved / rejected | Same assigned reviewer; distinct from owner and submitter. Reject reason allowlisted. |
| Verify | Approved/unverified → approved/verified | Distinct scoped verifier, separate from owner, submitter and reviewers. |
| Publish | Approved/verified → published | Distinct scoped administrator, separate from owner, submitter, reviewers and verifier. |
| Transfer | Nonwithdrawn → draft with new owner | Administrator, eligible distinct city owner, reset all prior participants and verification. Old owner loses replay authority. |
| Withdraw | Nonwithdrawn → withdrawn | Scoped current owner. Clear prior decisions and visibility. Terminal in this model. |

The same stable principal cannot bypass separation by changing roles in a content version. All admitted writes advance the resource revision once. Rejection and resubmission create a new content version. Unknown or free-text reasons are rejected before staging. Subject affiliation, evidence validity, verification expiry and transfer dual control are production design gaps.

## Prepare, commit and fault ordering

`prepare` checks scope and normalizes into immutable primitives. It returns a one-use opaque plan. The scripted scheduler interleaves prepare, authoritative update, and commit calls in explicit order. `commit` re-resolves the scoped record and checks current authority before looking up a receipt. No asynchronous work occurs between the fence and assignment. Competing plans at the same expected revision serialize by the test's selected commit order. A revocation/session/policy change before commit prevents the write. A revocation after commit prevents future disclosure of the original receipt.

A receipt key is SHA-256 of a typed JSON tuple of principal, city, resource, action and request ID. Its fingerprint incorporates command schema, scope, expected revision and exact allowed payload. An authorized exact retry replays a detached original receipt even after the revision advances. Changed arguments on the same scoped key conflict. A new key must pass the current revision and state. Failed commands do not reserve keys. Required audit availability is checked before a new write.

Stage sequence is **before state → state → event → receipt → outbox → commit → response**. Injected failures before or at state, event, receipt or outbox leave the aggregate unchanged. One assignment commits all four. Failure after commit models a lost response. The authorized retry returns the original event time and revision without another audit event. A restored harness can share the separate fixture authority so a revocation survives a simulated restart. This is a deterministic single-process ordering model.

## Audit, projection and recovery

- A versioned event carries deterministic sequence ID and UTC timestamp, city, resource, actor, action, allowed reason, resulting revision and integrity digests. It stores no raw command or free text. The auditor receives only the allowed scoped event fields. The private receipt contains the exact synthetic result and is detached on return.
- The checkpoint verifier checks a separately expected head, chain and event body hashes, timestamp and revision continuity by scoped object, receipt linkage and state digests, outbox linkage, final state and delivery/projection consistency. It rejects a corrupted snapshot instead of generating history. This checksum model assumes authentic anchor custody. It does not prevent an attacker who can rewrite the state and the trusted anchor. The logical checkpoint holds only memory copies and does not authenticate a separately stored delivery ledger.
- Outbox messages have only event ID, city, resource, revision and visibility. Exact committed messages are deduped by ID and advance the projection in contiguous revisions. Unknown, cross-city, mismatched and out-of-order messages go to sanitized quarantine. An out-of-order valid message may retry after predecessors arrive. Recovery reconciles delivered IDs and projection, then retries pending events. There are no external effects.
- The modeled visibility read requires exact city, current published state, matching projected revision and available audit path. Withdrawal suppresses the old projection before its update arrives. Projection is test-only and cannot change the public app.

No scheduler here proves real multiworker serializability, durability, queue fencing, custody, time authority or revocation across identity/service boundaries. See [SEC-004 transaction design](../sec-004/transactions-audit.md).
