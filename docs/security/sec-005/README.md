# SEC-005 — Offline authorization and transaction contracts

**D-001 remains NO-GO in Dubai, Muscat and Doha. G1–G6 remain open. G2 is NOT CLEARED.** This is an executable synthetic model of selected [SEC-004](../sec-004/README.md) requirements, based on merged PR #26 at `39dad1baf50fe9c081e3b66fe796f23a856b8951`.

All modules live under `tests/security-contracts/` and import only one another and Node's built-in crypto. The public application, dependencies, workflow, Phase 4 moderation and Phase 5 advertising are outside this diff. The model has no credentials, identity provider, persistence, public APIs, network access or wall-clock fixture data.

- [Contracts and consistency model](contracts.md) defines trust, lifecycle, audit, outbox and recovery.
- [Verification and limits](verification.md) maps synthetic evidence to G2 and records what remains unimplemented.

Run `node --test tests/security-contracts.test.mjs` with Node 22 for the focused synthetic suite. The same tests run through `npm test` and the existing CI job. No test gives independent security clearance or authorizes production work.
