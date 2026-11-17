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
Checks are configured but have not been independently executed by this connector. A green GitHub Actions run is required evidence before merge.
