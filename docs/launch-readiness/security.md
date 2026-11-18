# Security architecture and threat model

## What the demo exposes

On loopback the Next.js app renders GET-driven city/category/search and profile routes. Route segments are checked against fixed city/listing fixtures, category values are allowlisted and query values are normalized before filtering. React renders strings as text. Public source review found no outbound fetch, raw-HTML injection API, server-side secrets access or public mutation endpoint in the scanned app, components and library. This is a targeted review of the checked-out source plus HTTP probes, with no external penetration testing. The offline tools import synthetic fixture services directly and run outside the route tree. Prototype role references are selectable test data. A fixture role or successful transition supplies no authentication, protected API, durable audit or multi-worker transaction guarantee.

## Boundaries and assets

- **Current:** untrusted browser URL → Next.js parser and server rendering → immutable demo fixture read. Separately, source/lockfile and CI credentials cross the developer-to-build boundary into Node, npm and GitHub Actions. Prototype commands and outputs stay local and in-memory.
- **Proposed:** browser → edge limits → authenticated app → server-side city/object authorization → scoped database/media worker. Administrative and advertiser permissions, audit, verification evidence and storage each need separate service identities. Vendors, backups, staff access, logs and support transfers cross further trust or jurisdiction boundaries.
- **Actors:** anonymous visitor, opportunistic spammer or fraudster, compromised owner/advertiser, assigned moderator, privileged insider, repository contributor, upstream dependency and vendor. **Assets:** availability, listing integrity, policy decisions, staff credentials, rights evidence, private documents, complaints and audit history.

## Confirmed dependency findings

Read-only `npm audit --json` returned exit 1 on 2026-11-18. npm reported two package entries: high-severity transitive PostCSS 8.4.31 and a moderate Next.js entry linked to PostCSS. Four PostCSS advisory records were returned. The tool suggested a Next.js major-version change; that suggestion is not a reviewed remediation or an upgrade decision.

| Advisory | Applicability assessment |
| --- | --- |
| [GHSA-qx2v-qp2m-jg93](https://github.com/advisories/GHSA-qx2v-qp2m-jg93) | CSS stringification XSS class. The demo compiles checked-in CSS and has no user CSS intake. Runtime reachability was not established. |
| [GHSA-6g55-p6wh-862q](https://github.com/advisories/GHSA-6g55-p6wh-862q), [GHSA-fxqj-rqcc-2cmp](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp), [GHSA-r28c-9q8g-f849](https://github.com/advisories/GHSA-r28c-9q8g-f849) | Source-map handling/file disclosure class. No public CSS processing endpoint was found. Treat repo, build inputs and future CSS/media processing as relevant boundaries. No exploitability claim was made. |

Release Security must verify the patched lockfile, build-time and runtime applicability, supported framework version, and independently repeat the audit and regression checks. Keep untrusted CSS/media out of the build system. Introduce a reviewed dependency/advisory gate and least-privilege CI. Record exceptions with expiry and independent approval. No package or policy change is part of this assessment.

## Threat register

Likelihood and impact are qualitative under the stated scenario. High severity reflects a high impact with plausible access, or a major control missing before launch. “Future” means the proposed production surface does not exist today.

| Threat and scenario | Likelihood / impact / severity | Evidence and proposed mitigation | Owner / blocker |
| --- | --- | --- | --- |
| Cross-city enumeration or cache leakage | Demo low / low / low; future medium / high / high | 12 cross-city profile 404s and fixture scoping tests. Future server-derived entitlements, scoped queries, composite constraints, cache partitioning and adversarial isolation tests. | Application Security / G2 |
| Unsafe URL, reflected markup, excessive query or cache keys | Demo medium / medium / medium; future high / high / high | Repeated and malformed query handling and text rendering present. No reviewed edge size/rate policy. Cap lengths, canonicalize filters, allowlist destinations and protocols, review SSRF and redirects, and validate cache behavior under load. | App + platform / G2, G5 |
| Role spoofing, privilege escalation or forged approval | Future high / high / high | Offline role matrix and separation tested. Require server-side identity, MFA for privileged staff, object-level grants, second approval for sensitive actions and negative tests across roles/cities. | IAM + independent security / G2 |
| Stale writes, replay, forged or tampered audit | Future medium / high / high | Deterministic in-memory tests only. Transactions, scoped idempotency keys, immutable audit export, access history, restore and reconciliation drills. | Data + security / G2, G5 |
| Data exfiltration through media, reports, vendor access or backups | Future medium / high / high | No public upload or real data path today. Private least-privilege storage, encrypted and tested restores, media isolation/scan/rights controls, egress review, processor contracts and deletion tests. | Privacy + security / G2, G3 |
| Spam, fraudulent listings, advertiser fraud, illegal creative | Future high / high / high | Fixture-only inputs, prototype decisions and manual blocks. Verify business identity and authority, queue and rate-limit attempts, adjudicate appeals, suspend by city and keep paid ordering separate. | Trust & Safety + counsel / G1, G5 |
| Secret access or dependency compromise | Demo medium / high / high at build boundary | Lockfile; CI read-only contents scope. Confirmed dependency advisories. Require protected branch/review policy evidence, trusted builds, credential isolation, dependency and secret scanning, and incident drills. | Release Security / G2 |
| Abuse and availability loss | Future medium / high / high | Local smoke only. Bound workload, isolate queues, enable alerting and incident on-call, verify recovery and per-city suspension. | Operations / G5 |

Header and cache observations are in [quality](quality.md). Noindex is crawler guidance. Any future private preview requires independently verified access controls and separate authorization.
