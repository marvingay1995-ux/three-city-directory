# SEC-004 — Production security architecture and authorization design

**D-001 remains NO-GO in Dubai, Muscat and Doha. G1–G6 remain open. G2 is NOT CLEARED.** This is a proposed architecture for review, based on merged SEC-003 at `7c56eedd8e9dc3e4710375548f351c6050ea02b8`. It authorizes no production implementation or deployment.

The demo uses six fictional fixtures. The Phase 3 data adapter and Phase 4–5 tools exercise synthetic workflows offline. The designs below specify new production controls that the current demo does not provide. This PR adds Markdown only. It includes no reference implementation, application imports or external runtime dependencies.

| Document | Review focus |
| --- | --- |
| [Boundaries and assets](architecture.md) | Trust and data flows, enforcement points and failure behavior |
| [Identity and authorization](authorization.md) | Session contracts, city/object scopes and separation of duties |
| [Commands, audit and recovery](transactions-audit.md) | Consistency, replay, transaction and custody requirements |
| [Privacy, jurisdiction and operations](privacy-operations.md) | Country questions, data minimization, retention and operational owners |
| [ADR and decision register](adr.md) | Two architecture patterns, proposed progression and unresolved decisions |
| [Threat tests and G2 evidence](verification.md) | Negative-test plan, regression evidence and blockers |

This proposal builds on [SEC-002](../sec-002/README.md), [SEC-003](../SEC-003-ci-controls.md) and the [Phase 6 release gates](../../launch-readiness/release-gates.md). Release Security must arrange a qualified independent review of both the approved design and the specific future implementation before a sign-off can be considered.
