# Foundation 002 — Verification Gate

## Scope
Introduce GitHub Actions checks for the demo-only three-city foundation. No deployments or payments.

## Required checks
1. `npm ci --no-audit --no-fund`
2. `npm test`
3. `npm run typecheck`
4. `npm run build`

## Review procedure
- Review the Actions results on this pull request.
- Fix failing checks before merge.
- Review city selector, three city routes, fictional listings and search in a local preview.
- Do not publish a public preview or production deployment without separate authorization.

## Status
Foundation 002 merged in [PR #2](https://github.com/marvingay1995-ux/three-city-directory/pull/2) after [verification passed](https://github.com/marvingay1995-ux/three-city-directory/actions/runs/44189530364) using `npm install`. Phase 0 adds the lockfile and switches verification to the clean install command above. A green GitHub Actions run is required evidence before merge.
