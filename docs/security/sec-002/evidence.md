# SEC-002 verification and provenance ledger

## Source and environment

- Baseline: [merged main d258b2445e411588840fc7a5d591803ef3259c94](https://github.com/marvingay1995-ux/three-city-directory/commit/d258b2445e411588840fc7a5d591803ef3259c94). Reviewed [SEC-001 PR #20](https://github.com/marvingay1995-ux/three-city-directory/pull/20/files), [SEC-001 remediation](../SEC-001-remediation.md), the Phase 6 assessment and [Phase 3](../../adr/0001-in-memory-domain-boundary.md), [Phase 4](../../adr/0002-offline-moderation-prototype.md) and [Phase 5](../../adr/0003-offline-advertising-simulation.md) ADRs.
- Local Windows x64, Node v22.22.0 and npm 10.9.4. Node executable SHA-256 `bae898add4643fcf890a83ad8ae56e20dce7e781cab161a53991ceba70c99ffb` matched the [official distribution checksum list](https://nodejs.org/dist/v22.22.0/SHASUMS256.txt). The GPG signature was not checked. Bundled npm CLI was executed explicitly with that Node on PATH.
- Checkout lockfile SHA-256 `68a900be9078f870ed7417471f1bd2e954f79c27b707fca9008258edaf8e322a`, lockfile v3. Audit trees include optional platforms, so registry package totals differ from the 28 locally installed packages.
- Installation, dependency tree, two audits and metadata queries ran **2026-11-18 10:59:06–11:01:10 UTC**. Unit/build and loopback ran **11:02:19–11:03:30 UTC** on the same date. GitHub Actions provides a separate Ubuntu/Node 22 run, linked in the PR.

## Reproduction and results

```sh
node -v
npm -v
npm ci --no-audit --no-fund
npm ls next postcss
npm audit --json --prefer-online
npm audit --audit-level=high --prefer-online
npm view next@15.5.29 dependencies.postcss dist.integrity --json --prefer-online
npm view postcss@8.5.23 version dist.integrity dist.tarball --json --prefer-online
npm test
npm run typecheck
npm run build
# In one terminal
npm run start -- --hostname 127.0.0.1 --port 43138
# In a second terminal
node tests/profile-http.mjs http://127.0.0.1:43138
```

Local install used a workspace npm cache and the official HTTPS registry. The audit and provenance commands used a separate fresh cache and the same registry. Next telemetry was disabled locally. Previous generated build and type outputs were moved aside before the unit/type/build run. No lockfile, package or workflow changes were made.

| Check | Result |
| --- | --- |
| Clean install | Exit 0, 28 packages installed. |
| Resolution | `three-city-directory → next@15.5.29 → postcss@8.5.23 overridden`. npm ls exit 0. Installed Next manifest still declares `postcss: 8.4.31`. |
| Full fresh audit | Exit 0, `vulnerabilities: {}`. Info/low/moderate/high/critical/total all 0. Audit metadata reported 59 dependencies. |
| High/critical threshold | Exit 0, reported 0 vulnerabilities. Registry responded. A blocked or failed registry would be unknown, not clean. |
| Exact package provenance | npm registry metadata matches lockfile integrity for both packages. Next: `sha512-93AMszTCdi9Az7fD5VzcWy46SHCdQF45+i53K0LpDc4dDXCwB9P1SxP1wBYZKW6dF3HJnz41jyEni1vmgCluiw==`. PostCSS: `sha512-g50586zr4bZmwFiTlflMu8E0bDTb5I5gertgwAKmsdUlTQIhZtunzUlD1WSzwcVWPoAVpsrA6vlfCD7oXvRwgg==`. Lockfile PostCSS tarball matched npm view. This establishes a metadata/integrity match, not independent publisher attestation. |
| Next CSS consumer | `next/dist/build/webpack/config/blocks/css/index.js` calls `require('postcss')`. Resolving from that directory locates the installed root `node_modules/postcss/lib/postcss.js` at 8.5.23. |
| Unit and TypeScript | 52/52 pass and TypeScript exit 0. Existing non-failing module-type warnings. |
| Production build and HTTP | Build exit 0, all 13 generated build pages. Existing HTTP suite passed all six profiles, noindex and disclosures, 12 cross-city 404s, four invalid routes, two malformed encodings, and all nine named advertising/admin 404s. Supplemental loopback checks also passed. |

## Additional loopback checks

Only GETs against the locally started process were used, with manual redirect handling and a 20-second timeout per supplemental request. No external destinations, load generation, real data or exploit reproduction. Reproduce against the same local port. The existing suite checks six pages, profile noindex and fictional disclosures, filtered links, cross-city cases and named nonpublic routes.

| Local sample | Assertion or observation |
| --- | --- |
| Each city with no query | HTTP 200, robots noindex/nofollow, two fixture headings in exact order. Dubai Creative Studio then City Concierge; Muscat Design Workshop then Local Experiences; Doha Modern Atelier then Community Guide. |
| Each city with `?q=&q=%FF&q=%20CrEaTiVe%20&category=unknown&category=creative` | HTTP 200, only first fixture in that city, noindex. |
| Each city with `?q=creative&category=lifestyle` | HTTP 200 and empty listing set. |
| Dubai with a benign literal markup string as q and `next=/fixture` | Literal is escaped in the HTML, no live markup, no redirect and HTTP 200. Check validates only that input path and sample. |
| Framework image route `/_next/image` with no parameters | HTTP 400. No target was supplied and no fetch or SSRF test was attempted. |
| Responses for home, filtered Dubai, Creative Studio and /admin | Home and profile returned `s-maxage=31536000`. Filtered Dubai and /admin returned private, no-cache/no-store. All four emitted `X-Powered-By: Next.js` and had no CSP, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, Location or Set-Cookie. Plaintext loopback cannot establish final TLS or edge headers. |

Advisory sources were checked 2026-11-18. See the [dependency review](dependencies.md) for source links, limits of the audit and follow-up. CI is corroborating evidence, not a release authorization.
