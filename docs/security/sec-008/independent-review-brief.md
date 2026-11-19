# Request for review — SEC-008

**Draft handoff. INDEPENDENT REVIEW PENDING. No engagement, outreach, spending or testing is authorized by this packet.** Request from the product owner only after separate approval. Assess design adoption and identify evidence still needed for future G2. The fictional browser directory and Phase 3–5/SEC-005 offline modules are the only current runtime scope. Review the [SEC-004 trust diagram](../sec-004/architecture.md), [SEC-007 freeze](../sec-007/README.md) and [evidence index](evidence-index.md).

## Reviewer qualifications and procedure

Require a named assessor with demonstrated application/IAM, tenancy, concurrent transaction, audit/restore and threat-model experience. Declare independence from implementation and approval incentives, disclose conflicts and document access, methods and limitations. Enlist separate qualified UAE/Oman/Qatar counsel for applicable legal questions. Codex and CI supply input evidence. They cannot issue independent clearance.

1. Confirm exact contract version, merge commit and proposed scope. Draw actor, city, resource, service, custody and storage trust boundaries. Compare server-mediated and API-first options, including browser abuse, revocation, availability and regional dependencies.
2. Walk each of the 16 IDs in the evidence index. Reproduce authorized offline evidence, mark production status unimplemented, and define exact acceptance outputs for a later scoped candidate. Test planning does not grant access to a live system.
3. Issue a signed, dated, scoped report listing controls supported for design adoption, deficiencies, disputed items, unresolved assumptions, test prerequisites, whether adoption should defer and what future proof is required for G2. Report findings and retest criteria with evidence links and severities.

## Review questions and required output

| Review function | Questions for assessment | Requested evidence or disposition |
| --- | --- | --- |
| IAM/AppSec (A7-01–06) | Is authority derived independently of caller claims? Can session rotation, revocation, stale policy/grant or role change bypass the commit fence, self-approval, worker boundary or city/object scope? Which denial evidence differentiates timing from response-body assurance? | Future issuer/session and grant diagram, negative identity/CSRF/workers/cache/export plan and ordered write/revocation evidence design. Verify distinct principal roles and conflict handling. |
| Data (T7-01–06) | What fence orders revocation and concurrent writes? What persists on failure at each stage, after lost response, or on conflicting/idempotent replay? Can stale events or a restore resurrect withdrawals? | Scoped key/constraint plan, lock/consistency histories, exact receipt and fault matrix, reconciliation and restore checklist. Distinguish SEC-005 single-process proofs from engine/worker tests. |
| Independent audit custodian (P7-01/02/04) | Who owns clock, keys and trust anchor? Can a writer rewrite history, compromise a checkpoint or expose a cross-city reader? Can a hold, permitted deletion or outage be reconciled? | Minimal event/custody schema, independently logged access, tamper/key compromise and hold/restore evidence plan. Require no forged historical audit records. |
| Privacy and qualified country counsel (P7-03/04) | What facts identify the exact operator and privacy jurisdiction in each city? Are every location, staff/support, vendor, backup and transfer authorized? How will deletion, appeals and incidents be handled? | Separate signed applicable-law/flow opinions, approved field and actor mapping, data handling limits and unresolved issues. Reviewer cannot supply legal clearance. |
| Operations and independent Security (A7-06, T7-05/06, P7-02/04) | How long can authority, projections, custody and restorations lag safely, and what happens if those limits are exceeded? Are staffing and stop authority sufficient? | Scoped freeze and independent reopen criteria, restore and incident drill plan, availability assumptions and named operating owners. No SLA or spend assumed. |

For disputes, record invariant ID, competing interpretation, evidence and decision owner in the review report. Resolve changes to frozen wording by formal revision, not reinterpretation. Use [risk-exception controls](risk-exceptions.md) for residual proposals and plan a dated retest. Report design suitability separately from production evidence and G2. D-001 stays NO-GO.
