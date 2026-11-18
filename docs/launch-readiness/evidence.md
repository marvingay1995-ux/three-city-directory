# Verification evidence ledger

Assessment date 2026-11-18. Runtime baseline `d274a29` is merged PR #16. This PR changes only Markdown under `docs/launch-readiness/`.

## Repository inventory

| Area | Evidence |
| --- | --- |
| Public routes | Home `/`; `/dubai`, `/muscat`, `/doha`; six profile routes in the table below. Invalid routes use the custom not-found screen, and the city error boundary provides an alert and retry. No app API route exists in the inventory. |
| Public model | Six fixed fictional records, Creative/Lifestyle categories, scoped search/filter, placeholders, noindex. Creative Studio retains its explicit sponsored example label. |
| Offline models | Phase 3 typed seed and in-memory repository. Phase 4 mock moderation, derived audit and static HTML exporter. Phase 5 mock advertising eligibility and campaign states with offline HTML exporter. None is a public administration or advertising surface. SQL is a design sketch. |
| Locked dependencies | Lockfile v3, 60 package records including root and optional platforms. Next 15.5.29, React and React DOM 19.3.1, TypeScript 5.9.3, @types/node 22.20.5, @types/react and @types/react-dom 19.3.0. PostCSS 8.4.31 and optional Sharp 0.35.5. |
| CI controls | `.github/workflows/verify.yml`: PR and main pushes, Node 22 on Ubuntu, contents read permission, 15-minute timeout, lockfile install, unit tests, typecheck, build, loopback HTTP suite. Independent branch protection and production security gates were not verified. |

| City | Profile paths |
| --- | --- |
| Dubai | `/dubai/listing/creative-studio`, `/dubai/listing/city-concierge` |
| Muscat | `/muscat/listing/design-workshop`, `/muscat/listing/local-experiences` |
| Doha | `/doha/listing/modern-atelier`, `/doha/listing/community-guide` |

## Commands and outcomes

```sh
npm ci --no-audit --no-fund
npm test
npm run typecheck
npm run build
# In one terminal after build
npm run start -- --hostname 127.0.0.1 --port 43136
# In a separate terminal
node tests/profile-http.mjs http://127.0.0.1:43136
npm audit --json
```

Local Windows used Node 24.22.3 and npm 10.9.4 via the bundled npm CLI. The install additionally used `--cache ../npm-cache --offline` and installed 28 packages. Builds and local execution disabled Next telemetry. The npm advisory query used the same cache and `--fetch-retries=0`.

| Evidence | Result and boundary |
| --- | --- |
| E1: Clean install and build | Install pass. Unit suite pass 52/52, TypeScript exit 0, production build exit 0. Existing Node type-module warnings were non-failing. |
| E2: Public regressions | HTTP suite passed all six profiles and filtered links, fictional and sponsor disclosures, noindex, 12 cross-city 404s, four invalid-route 404s and two malformed encodings. Four admin/moderation and five advertising paths returned HTTP 404. Offline simulation label absent from public Dubai HTML. |
| E3: Browser and performance | 50 route/viewport passes and focused keyboard, empty-state, gallery, narrow RTL and 404 smoke. Four serial loopback samples tabulated in [quality](quality.md). |
| E4: Advisory inventory | Audit exit 1 with two package entries and four PostCSS advisory records. See [security](security.md) for applicability and closure. |
| E5: Legal source ledger | Official sources checked and source access limitations recorded in [jurisdictions](jurisdictions.md). All jurisdiction decisions remain open. |
| E6: CI | Prior merged application baseline was verified in [Phase 5 Node 22 CI](https://github.com/marvingay1995-ux/three-city-directory/actions/runs/44275158184). The Phase 6 PR body records its own CI evidence. |

## Acceptance mapping

| Criterion | Evidence |
| --- | --- |
| Prior AC-101–107 and AC-201–205 | E1–E3 cover city routes, filters, fictional profiles and accessibility samples. Prior phase visual artifacts remain separate. |
| Prior AC-301–304, AC-401–403 and AC-501–503 | E1 covers domain scope, moderation permissions and deterministic ad policy and states. E2 verifies offline/public separation. |
| AC-601 assessment deliverables | E1–E5 and [assessment index](README.md). Findings and operational proposals remain distinct from independent clearance. |
| AC-602 deployment remains blocked | Docs-only diff, inspected route inventory and loopback-only tests. No launch authorization was recorded. |
| AC-603 owner decision | [D-001 and G6](release-gates.md) record NO-GO. Future owner approval is a separate signed decision following independent gates. |
