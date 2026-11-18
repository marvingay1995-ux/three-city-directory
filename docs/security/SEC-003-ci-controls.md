# SEC-003 — CI security controls and evidence

**D-001 remains NO-GO for Dubai, Muscat and Doha. G1–G6 remain open.** This change addresses the audit ordering and evidence-retention gaps recorded in [SEC-002](sec-002/dependencies.md). The assessed starting point is merged PR #22, `6105671cea110b869f6f2fddc400053183e0212f`. No dependency versions, application behavior, repository settings or workflow token permissions changed.

## Execution and decision contract

The former workflow ran the unrestricted JSON audit before its explicit high-severity audit and before unit/type/build/HTTP checks. npm returns 1 when a complete report contains findings at the chosen threshold. The default GitHub Actions success condition then skipped later steps. The offline suite reproduces the common exit-1 input for moderate findings and a registry error, confirms their different policy outcomes, and checks that the revised workflow places every functional step before audit collection.

The existing `checks` job remains the enforcement point. Unit, TypeScript and build run after successful installation and even if another functional step fails. HTTP checks require a successful build. Audit collection also requires a successful install and can run after functional failures. It runs npm once against the official registry, with `--json --audit-level=info --prefer-online --include=dev --include=optional --include=peer --fetch-retries=0`. The threshold is set to collect every severity and normalize npm exit semantics. That exit is captured in JSON and evaluated in a separate step. No second network query is needed to reapply the high/critical gate. The workflow uses explicit cancellation conditions so a failed gate does not suppress outcome recording or upload. [npm audit exit semantics](https://docs.npmjs.com/cli/v10/commands/npm-audit/) · [GitHub step status conditions](https://docs.github.com/en/actions/reference/workflows-and-actions/expressions#status-check-functions)

| Decision | Required input and result |
| --- | --- |
| Clean | Valid npm audit v2, all six severity/total counts consistent with the package inventory, no advisory entries, npm exit 0. Gate passes. |
| Warning | Valid, internally consistent audit with info, low or moderate entries only and npm exit 1. Gate passes and emits a warning with advisory identifiers. Release Engineering must record each disposition, owner and expiry or remediation target. |
| Blocked | Valid report with high or critical findings, including mixed severity, and npm exit 1. Gate fails. |
| Error / unknown | Registry/tool error JSON, failed invocation, signal or timeout, unsuccessful collection step, malformed, missing or unreadable evidence, unsupported schema, inconsistent findings or unexpected exit. Gate fails. |

Counts describe affected package entries; multiple packages may resolve to the same advisory. The evaluator verifies transitive references lead to real advisory records, rejects conflicting duplicate IDs, and derives IDs only from a GHSA/CVE reference present in the report or its npm source ID. It does not rely on advisory titles or print raw report text. Captured stdout is byte-for-byte evidence of what npm emitted within the collection limit. A tool truncation, timeout, or absent report does not imply a clean result.

## Retained evidence

The pinned upload action archives four explicit files under the runner temporary directory, with 14-day requested retention subject to GitHub policy:

- `audit.json`: exact npm stdout, separate from stderr.
- `execution.json`: actual exit/signal/tool failure, known registry/arguments, Node and npm versions, timestamps, lockfile SHA-256, and runner, commit and run identifiers.
- `decision.json`: severity decision, reasons and identifiers.
- `functional-results.json`: install, unit, typecheck, build and HTTP step outcomes, including skipped steps.

Fixed names and a fixed directory avoid taking arbitrary repository paths or recursively archiving checkout content. No credentials, raw environment dump, npm debug logs, stderr or personal data are deliberately captured. Checkout does not persist its read token. Restricted file modes apply on the Linux runner. Checks fail for absent or empty required files and the action errors on no files. Upload is attempted after failures, so a partial or malformed artifact can accompany a failed job; verify the decision and job result before consuming it. Cancellation, runner loss or upload outage can prevent a retained artifact. Raw registry output remains untrusted and should be handled as data. GitHub Actions artifact access for this public repository must not be treated as a confidential channel. Do not send evidence to an external host or include secrets in inputs. [Upload action retention and artifact access](https://github.com/actions/upload-artifact/tree/v4.6.2)

## Verified action pins

On 2026-11-18 UTC, release pages were checked and official `actions/<name>.git` refs were queried with `git ls-remote --tags`. Each selected v4 tag resolved to the commit below and was looked up on GitHub in its official repository. This verifies tag/commit correspondence; it is not a signed provenance attestation.

| Official release | Full workflow pin |
| --- | --- |
| [checkout v4.4.0](https://github.com/actions/checkout/releases/tag/v4.4.0) | [11d5960a326750d5838078e36cf38b85af677262](https://github.com/actions/checkout/commit/11d5960a326750d5838078e36cf38b85af677262) |
| [setup-node v4.4.0](https://github.com/actions/setup-node/releases/tag/v4.4.0) | [49933ea5288caeca8642d1e84afbd3f7d6820020](https://github.com/actions/setup-node/commit/49933ea5288caeca8642d1e84afbd3f7d6820020) |
| [upload-artifact v4.6.2](https://github.com/actions/upload-artifact/releases/tag/v4.6.2) | [ea165f8d65b6e75b540449e92b4886f43607fa02](https://github.com/actions/upload-artifact/commit/ea165f8d65b6e75b540449e92b4886f43607fa02) |

Release Engineering owns periodic and advisory-triggered review. Select an official tagged release, resolve the tag or peeled commit and compare upstream source/action manifest and release notes. Submit the pin, provenance, runner compatibility and regression results in a reviewed PR. Roll back only to a previously reviewed non-vulnerable pin and repeat the full run. Request separate approval for new permissions or external integrations. Branch protection and workflow review policy require independent repository-owner confirmation.

## Verification and remaining work

Run `npm ci --no-audit --no-fund`, `npm test`, `npm run typecheck`, `npm run build`, and the existing `tests/profile-http.mjs` against a loopback production process on Node 22. For local audit reproduction, use `node tools/audit-evidence.mjs collect <new-evidence-dir>` followed by `node tools/audit-evidence.mjs evaluate <new-evidence-dir> success`. On Windows the collector accepts the full npm CLI JS path as its third argument. Record the collector's actual outcome and pass `failure` if it fails. Local negative tests use synthetic reports with no registry calls. They cover the full severity matrix, transitive advisories, inconsistent reports, registry errors, truncation, missing files and unexpected exit codes. Exact run and artifact links are recorded on the PR.

A zero-finding run is a dated snapshot. Scheduled monitoring, independent branch-policy verification, publisher/SBOM attestations, override support, and production security testing are still follow-ups. Hosted runner images and Node 22 patch versions can change; captured versions describe each run. No test here grants independent G2 clearance or production approval.
