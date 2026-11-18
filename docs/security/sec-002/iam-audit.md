# Production identity, authorization and audit requirements

## Observed in Phase 4

The fixture registry maps fixed references to explicit city scopes. Visitor has no moderation grants. A business owner can submit only an owned synthetic draft. City-assigned moderators inspect queues, start review and make reason-coded decisions. Scoped administrators reconsider or separately publish. Approval leaves verification unmodified. Deterministic revision and retry tests cover illegal, stale and replayed operations. The in-memory candidate is committed as one synchronous assignment. No app page imports this service.

Fixture actors are selectable inputs, so their references do not authenticate a person. State, receipts and audit history disappear on reset. A memory clone and revision check supply no durable history, real role assertion, atomic multi-worker protection or non-repudiation. [Phase 4 ADR](../../adr/0002-offline-moderation-prototype.md)

## Future requirements and negative evidence

| Requirement | Required independent negative/operational check |
| --- | --- |
| Server-verified identity and lifecycle. Bind session issuer/audience, restrict cookie scope, support expiry/revocation, MFA for privileged roles, and explicit join/leave and break-glass procedures. | Reject expired/revoked or wrong-audience sessions. Validate login/session protection, logout, privilege removal and emergency access without inheriting user-supplied roles. |
| Deny by default on every handler, worker and query with server-derived actor, current city grant, object ownership, least privilege and separate reviewer/publisher power. | Test visitor, owner, moderator and administrator across approved and forbidden city/action/object pairs. Cover owner reassignment, direct API calls, forged actor/city data and cache and export segregation. |
| Require authorized transitions with expected revision, unique scoped idempotency keys and durable transaction spanning decision, state and audit. Re-authorize replays, constrain key scope and record payload equivalence. | Test duplicates, stale and concurrent conflicting requests, role revocation between retries, rollback on partial failure, cross-worker retries and rejected/approved/published/verified separation. |
| Append durable minimal audit records with trusted timestamp, actor/role/scope, target/revision, reason, correlation ID and custody. Isolate audit writer/read roles, protect integrity, enforce approved retention and log access. | Independent reconciliation and tamper alert test, privileged insider access cases, restore-and-verify drill, and evidence for retention/deletion and legal hold. |
| Publish administrative and advertising changes only through separately authorized controls. No UI gating as a security boundary. | Review direct route/API/worker entrypoints, second-approval and bypass attempts, and a tested stop/rollback decision. |

All controls are design requirements. They would need separate implementation authority and validation against the actual operator, infrastructure and jurisdiction.
