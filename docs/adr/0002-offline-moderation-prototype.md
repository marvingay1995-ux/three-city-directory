# ADR-0002 — Offline moderation prototype

Status: proposed for Phase 4 review.

## Boundary

The prototype starts with independent draft copies of the six fictional Phase 3 fixtures. One Dubai draft is deliberately unowned to test ownership denial. No public page imports the prototype. The public directory still reads its original fixtures and cannot be changed by simulated publication. A Node-only tool generates a read-only HTML snapshot outside the application route tree. The HTML uses inline CSS and a restrictive content security policy. It has no network dependencies, forms, or login.

```text
Local test command → fixture actor lookup → city/action/ownership policy
                                              ↓
                   revision + lifecycle checks → validate entire candidate
                                              ↓
                   replace in-memory snapshot with listing, submission,
                   decision, audit event and replay receipt together

Offline HTML renderer ← approved city-scoped snapshots
Public Next.js routes → existing demo fixtures
```

## Permission matrix

| Role | City and resource scope | Allowed actions |
| --- | --- | --- |
| Visitor | No moderation scope | None in this prototype |
| Business owner | Explicit assigned city and owned synthetic draft | Submit |
| Moderator | Explicit assigned cities | Inspect queue and history, start review, approve, reject |
| Administrator | Explicit assigned cities, Dubai and Doha in the fixture | Inspect queue and history, reconsider, publish |

Fixture owner and moderator references are each assigned to one city. Unknown references, claimed roles, unrecognized actions and cities, unassigned cities, and owner mismatches grant no permissions. The service resolves reference strings through the fixed fixture registry. These are test assertions that anyone running the tool can select. They carry no production identity or authority. The preview assembles three independent moderator snapshots for evidence.

## States and revisions

| Action | Transition | Additional condition |
| --- | --- | --- |
| Submit | Draft → Submitted | Start a distinct submission for the owned draft |
| Start review | Submitted → Under review | Update that submission to in review |
| Approve | Under review → Approved | Requires the `meets-demo-policy` reason |
| Reject | Under review → Rejected | Requires `missing-demo-details` or `outside-demo-scope` |
| Reconsider | Rejected → Draft | Administrator supplies `ready-for-resubmission`. Preserve the original decision and require a fresh owner submission |
| Publish | Approved → Published | Administrator performs a separate action. Verification stays unverified |

The service reuses Phase 3 transition and integrity validation. Each command must name the current revision. Commands with invalid data, missing records, forbidden scope, stale revisions or an illegal source state fail before replacing the snapshot. All successful transitions increment the revision once. The listing time cannot move backward. Explicit UTC fixture timestamps replace a wall clock. Archive and verification changes remain outside this prototype.

## Audit and retries

Every committed action appends one audit event with a deterministic sequence ID, request and actor references, city, listing and submission references, transition, decision or reason when applicable, UTC time and resulting revision. Audits record successful simulated actions. Failed commands leave the listing, submissions, decisions, timeline and replay bookkeeping as they were.

A successful request reserves its actor/request ID pair for the lifetime of that prototype instance. A retry with the same payload and current permission returns a detached copy of its original receipt, even after the listing advances. Reusing the pair with a changed payload that passes permission, target, and input checks returns a conflict. A new request ID must pass the current revision and lifecycle checks. No failures reserve a key. The snapshot replacement is synchronous and local to one instance.

## Production prerequisites

A production design would require server-authenticated actor references, server-side city and resource entitlements, transactional revisions and idempotency across workers, durable protected audit records with access logging, and independently reviewed privacy, retention and deletion rules. Define least-privilege access to audit reasons and actor references, investigate sequence metadata leakage, and review data rights and jurisdictional requirements before any real data. The prototype accepts fixed reason codes, uses synthetic references, and drops all records on reset. It supplies neither a security boundary for external callers nor durable history.

## Run and review locally

```sh
node tools/moderation-preview.ts > moderation-preview.html
```

Generate the file outside `app/` and `public/` and open it directly from the filesystem. Use Node 22 with native TypeScript stripping. The preview shows approved, rejected and separately published cases with their city-specific timelines. Use the test suite to exercise transitions and retries.

- Confirm the role matrix, rejection and resubmission rules, and the publication separation.
- Check the unit suite and loopback HTTP tests, including admin URL 404s.
- Review the offline screenshot and confirm the application has no admin routes or live integration.
