# Transaction, outbox and audit custody options

## Consistency options

| Option | Minimum isolation and mechanics | Trade-offs and proof |
| --- | --- | --- |
| Transactional relational writer plus outbox | Enforce scoped keys, FK/revision compare-and-swap and unique receipt inside a serializable transaction or proven equivalent locking. Fence revocation and policy updates in the same authority/commit order. Atomically insert state, event, receipt and outbox. | Straightforward local proof and recovery, but a writer outage denies affected city writes. Need cross-connection contention, realistic isolation/lock evidence, failover/fencing and consistent restore. |
| Partitioned consensus-backed log or transactional key/value writer | Place grant fence, scoped command state, event/receipt references and intent under one linearizable scoped transaction or deterministic ordered command log. Do not rely on asynchronous dual writes. Reject operations spanning unsupported partitions unless a separately reviewed atomic protocol exists. | Can shard by approved city boundary; more complex cross-partition authority, checkpoints, schema changes and recovery. Prove leader/follower fencing, ordering during partitions, deterministic replay, uniqueness and no unauthorized visibility during lag. |

Prefer evaluating the first option for A. No database technology, vendor, provider, location or physical writer topology is selected. Both options must satisfy the same observable contract. A stale policy decision, queue ack or secondary-store log does not make a write valid.

## Atomic and eventual work

1. Validate and canonicalize the typed command, including version, city, object, action, expected revision and allowed payload. Use a scoped idempotency key and a deterministic, versioned fingerprint with no raw sensitive input. Authentication and authorization occur again before looking up a receipt.
2. Inside the critical boundary, acquire current session/account, policy/grant and ownership fences in deterministic key order, followed by city/object state and receipt uniqueness. Resolve multi-object locks in stable immutable-key order. Every conflicting revocation/transfer either shares that order or uses a proven equivalent consistency fence. An expired or unprovable grant aborts. Independent transaction tests must cover both orders of a race and starvation/deadlock behavior.
3. Same key and fingerprint replays the original minimal receipt only with fresh authority. Different payload or expected revision on the key conflicts. A new key must pass current revision and legal transition. Losing writes make no success event. Define explicit retry budget/backoff and receipt TTL or tombstone policy before allowing key reuse.
4. Commit authoritative state, event, receipt and outbox intent together. Failure of any required write aborts. Fault before commit tests all four components. Fault after commit/before response tests authorized retrieval of one original result, with original timestamp and revision. Distinguish release of an outbox message from creation of its intent.
5. Post-commit projection and independent custody transfer are eventual and scoped. Authenticate workers separately, fence leases and reauthorize actor-dependent jobs. Deduplicate with persisted event IDs, accept contiguous revisions per scope, quarantine stale or mismatched work and reconcile before replay. Use a visibility fence on withdrawal/hold, independent of purge lag. Protect audit and visibility thresholds with an approved fail-closed policy; freeze affected mutations or projections on excessive lag or loss of verification.

## Custody, minimal events and recovery

Event payload includes trusted logical/UTC timestamp policy, event, city and resource IDs, pseudonymous actor and effective role/authority, action and enumerated reason, resulting revision, scoped correlation ID and policy/schema version. No credentials, raw request contents, media addresses, contact or verification evidence. Separate access and denial logs with approved minimization. No historic events are fabricated during a backfill.

Authoritative event write, transfer, independent custody, case-scoped readers, retention/hold approvers, key administration and recovery require separated duties and auditable access. Model independent append-only custody with approved deletion, hold and redaction rules. Review time source, signing and key rotation, secure checkpoint and anchor storage, and trust under privileged compromise. Hash/checkpoint evidence supplements custody; it does not create it.

Reconcile per city by event IDs, exact revisions, receipts, queue and delivery positions, visibility tombstones, and independently held checkpoint/manifest. Restore all sources at a mutually consistent cut, run deduped replay without external effects until approved, reconcile state, queue and custody, and reapply revocations/tombstones before enabling reads or writes. Separate recovery of stale workers and client retries. Measure RTO/RPO and audit-lag under authorized fault testing, including unsent, duplicated and out-of-order messages, missing audit events, corrupted anchors, and compromised access or keys. Reopening requires named independent reviewer and incident commander sign-off.

[SEC-005](../sec-005/contracts.md) provides synthetic analogues for these cases, without a durable implementation.
