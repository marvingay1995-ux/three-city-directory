# Transaction contract — SEC-007/v1

These are proposed invariants for a future authorized writer, free of engine or provider selection.

| ID | Required observable behavior |
| --- | --- |
| T7-01 Versioned command and state | The command MUST declare schema version, action, city, object, expected revision, idempotency key and canonical typed payload. Unknown versions/fields and free-text reasons MUST reject before staging. Bind server-derived actor and exact reviewed version. One legal mutation advances revision once; stale or illegal transitions do not mutate. The state table below constrains the candidate. |
| T7-02 Revision and authority fence | The authoritative writer MUST combine conditional revision/CAS with fresh session, scoped grant/policy, ownership and conflict checks. Separate record locks MUST follow a declared stable order (authority/policy, ownership and scoped object, receipt uniqueness; canonical IDs within each set), or a reviewed equivalent MUST prove the same ordering. At most one competing same-revision commit. See A7-05. |
| T7-03 Idempotency and replay | Key uniqueness MUST bind principal, city, action, object and key. Fingerprint MUST use versioned deterministic encoding of the semantic command, exact revision, scope and normalized payload, excluding secrets. After current authorization, identical retries return the original minimal receipt without new writes. Changed payload/revision under the same scoped key conflicts. A new key MUST pass current state and revision. Receipt expiry, tombstones, key reuse rules and timeout/retry budgets remain OPEN under D7-06. |
| T7-04 Atomic commit and loss of response | State, minimal audit event, receipt and outbox intent MUST become durable together or result in no successful write, event, receipt or enqueue. Test faults before/at every staged write and before acknowledgement after commit. Authorized response-loss retry MUST return original event time/revision. External work MUST NOT happen on uncommitted intent. |
| T7-05 Eventual delivery and visibility | After commit, workers MUST dedupe on durable scoped event ID, check authority and ordered revisions, quarantine invalid/stale envelopes and reconcile before replay. Withdrawal or hold MUST deny stale visibility before an affected response can be served, even while purge is pending, or fail closed for the affected scope. Proposed restore/purge/visibility timing targets and offline/public fallback policy remain OPEN under D7-07. |
| T7-06 Recovery | Restore an authorized consistent cut across revisions, event/receipt/outbox, delivery offsets and projections. MUST reapply revocations and deletion/visibility tombstones before read/write reopen. Reconcile held and pending events, detect corrupted/missing evidence, prove deduped replay and require authorized acceptance before reopening. See P7-02/P7-04. |

## Candidate lifecycle and open reconciliation

| Step | Version-specific guard |
| --- | --- |
| Draft or rejected → submitted | Current owner and expected revision. Resubmission creates a new content version with fresh decisions. |
| Submitted → in review → approved or rejected | Assigned city reviewer, not owner/submitter/conflicted. Rejection records a typed reason. |
| Approved → verified without changing editorial status | Separate verifier and evidence against the exact version. |
| Approved and verified → published | Separate city publisher, current eligible approvals and authority. |
| Transfer / withdrawal | Privileged transfer must use eligible same-city ownership and reset decisions. Withdrawal must remove visibility; do not reuse old approvals or visibility. |

SEC-004 permits publication after approval and applicable verification. SEC-005 models verification as required and withdrawal as terminal. For this candidate use the stricter verify-before-publish path for protected profiles. Any exception, reactivation or transfer dual-control rules need explicit owner and independent review under D7-05; a fixture transition is not an approved business policy. The SEC-005 scheduler demonstrates single-process ordering only. Real multiworker serialization, failure/restore semantics and independent custody require new evidence. [SEC-004 transaction design](../sec-004/transactions-audit.md) · [SEC-005 model](../sec-005/contracts.md) · [SEC-006 options](../sec-006/transaction-audit-options.md)
