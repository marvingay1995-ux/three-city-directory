# SEC-011 — Pre-Release Readiness Assessment

**Decision as of 2026-11-21: NO-GO for Dubai, Muscat and Doha.** This is an evidence-based desk assessment of the **fictional, private, non-transactional general-business directory**, not a new launch decision. No hosting, public preview, market activation, identity provider, real listings, user submissions, advertisements, payments, tracking, live testing, external assessor engagement, supplier selection or spend is authorized.

## Scope and evidence conventions

- Source of truth: [Product Vision](../PRODUCT_VISION.md), [PRD](../PRD.md), [acceptance criteria](../ACCEPTANCE_CRITERIA.md), [Phase 6 release gates](../launch-readiness/release-gates.md), [SEC-007 frozen candidate](../security/sec-007/README.md), and [SEC-010 Muscat-first dependencies](../security/sec-010/README.md).
- The owner has **explicitly approved visual design only** in [UX-010](../reviews/UX-010-VISUAL-DESIGN-SIGNOFF.md). That approval is not a decision on accessibility, legality, security, privacy, operations or release.
- The prior screenshot evidence is the verified private [UX-009 browser run](https://github.com/marvingay1995-ux/three-city-directory/actions/runs/44914776628), 17 viewport images + seven full-page captures. Historical workflows have passed, but do not substitute for deployment-specific assurance. GitHub artifacts have finite retention.
- Existing security design/transaction contract checks demonstrate bounded **offline synthetic behavior**, not real IAM, persistent commit ordering, independent custody or production penetration results.
- Status vocabulary: **VERIFIED OFFLINE** (specific CI/fixture evidence), **OPEN** (exit evidence absent), **BLOCKED** (an unmet prerequisite prevents the decision), **PROPOSED** (unadopted direction), **NOT ASSESSED** (no scoped independent report). Do not convert an OPEN status to CLEAR solely because test counts rise.
- This assessment records current documented gaps; a historical advisory finding must be **rechecked** against a fresh lockfile and audit rather than asserted to persist unchanged.

## Mandatory gates (all OPEN)

| Gate | Decision | What we have | Missing dated, independently evaluated exit evidence | Accountable function (not yet assigned to a named person) |
| --- | --- | --- | --- | --- |
| **G1 — Legal/advertising eligibility** | **OPEN** | Three fictional markets, proposed Muscat-first review questions and separate city policy concepts | Qualified country-specific written applicability/licensing/advertising opinions for exact operator, activity, audience, content, features, data flows and necessary permits/disclosures; any market-specific exclusions | Qualified **Oman, UAE and Qatar** counsel, product owner |
| **G2 — Security** | **OPEN / NOT CLEARED** | SEC-007/v1 frozen for review, SEC-005 synthetic contract harness, standard CI, prior dependency-audit evidence | Signed candidate adoption; fresh dependency triage/patch verification; implemented IAM and authorizations; tenant/city isolation and negative tests; durable transaction/recovery, custody/key controls; approved independent assessment/penetration and remediation retest | AppSec/IAM, Data, independent security reviewer |
| **G3 — Privacy** | **OPEN** | Data minimization/no real data in present demo; design-only privacy contracts; D7-08 unresolved | Approved personal-data inventory, lawful bases, residency/transfer/processor decisions for each scoped region; retention/deletion, rights responses, breach/incident handling, backups and vendor terms tested and signed | Privacy lead and qualified counsel |
| **G4 — Accessibility** | **OPEN** | Automated five-width overflow/disclosure/focus/keyboard checks and 24 screenshots; design-only owner approval | Independent representative **WCAG 2.2 AA** audit, screen reader/zoom/reflow and real-device checks, blocker remediation and signed exceptions or retests | Independent accessibility reviewer |
| **G5 — Operations/trust** | **OPEN** | Risk and operations proposals; synthetic tests; no real operations | Named on-call/staffing, complaint and moderation/appeal capacity, severity/response runbooks, incident/restore/rollback exercises, load/cache isolation budgets and monitoring, approved cost envelope | Operations and Trust & Safety owners, independent recovery reviewer |
| **G6 — Product release authorization** | **OPEN** | Explicit **UX-010 visual-only** approval | Named release scope, jurisdiction(s), feature flags, applicable independent G1–G5 clearances and exceptions, contingency/kill switch, named stop authority and separate dated product-owner **GO** decision | Product owner |

**D-001: NO-GO.** A proposed Muscat-first *research sequence* does not exempt the Muscat route from G1–G6 and does not create a country launch exception. Approval for one market does not propagate to another.

## SEC-007 / D7 architecture dependencies

**SEC-007/v1 remains FROZEN FOR REVIEW, unsigned and unadopted.** Per [SEC-010 D7 dependencies](../security/sec-010/decision-dependencies.md), treat the twelve owner/reviewer decisions separately:

| Item | Current documented state | Prerequisite to progress |
| --- | --- | --- |
| D7-01 | PROPOSED | Compare authority-boundary alternatives after D7-02/03/08/11 evidence; no adopted architecture |
| D7-02 | OPEN | Identity claims, issuer, expiry/revocation/recovery and step-up plan |
| D7-03 | OPEN | Revocation ordering, durable commit/replay model and storage selection after approved jurisdiction/data boundaries |
| D7-04 | OPEN | Independent custody, trusted time, keys and recovery |
| D7-05 | OPEN | Conflicts, verification-before-publish, withdrawal and appeal control |
| D7-06 | OPEN | TTL, replay, tombstone and expiry contract |
| D7-07 | OPEN | Operational recovery/visibility hold, RTO/RPO |
| D7-08 | BLOCKED | Qualified jurisdiction-specific processing, residency, operator, backup, transfer and processor decisions |
| D7-09 | OPEN | Approved retention, deletion/hold and restore-tombstone schedule |
| D7-10 | OPEN | Realistic staffing, budget, incident ownership and support capacity |
| D7-11 | OPEN | Separately authorized independent design review of exact candidate |
| D7-12 | BLOCKED | Owner's formally scoped adoption after applicable counsel/Privacy and independent design disposition |

None of these items closes because UX-010 was approved. SEC-010's independent-review request and Oman counsel questionnaire are proposals; **no named reviewer was engaged** by SEC-011.

## Evidence inventory and freshness

| Evidence | Existing status | Limitation and next check |
| --- | --- | --- |
| PR #59 UX-010 visual-only decision | **APPROVED — visual scope only** | No policy, release, individual test or human accessibility clearance |
| GitHub standard test/typecheck/build/loopback CI | **VERIFIED OFFLINE on prior approved PRs** | This documentation PR must receive its own fresh checks; continuous green builds are not production security proof |
| Private Chromium viewport and full-page artifacts | **VERIFIED OFFLINE** | Screenshot capture was not an independent WCAG assessment, actual public serving or all end-user device combinations; artifacts expire |
| SEC-005 synthetic contract tests | **VERIFIED OFFLINE (bounded)** | Cannot establish real identity, durable authorization, external time/custody or recovery |
| Historic dependency/security advisory evidence | **HISTORIC FINDINGS; current status requires re-evaluation** | Re-run supported-version dependency audit with current lockfile, triage findings and independently assess actual candidate before any G2 clearance |
| Country legal opinions/permits | **NOT ASSESSED / OPEN** | No qualified signed counsel opinion established by this packet |
| Production privacy/retention/transfer controls | **NOT IMPLEMENTED / OPEN** | No real processors or real-data design approved |
| Production operations/rollback and complaint handling | **NOT IMPLEMENTED / OPEN** | No named coverage, rehearsal or budget approved |

## Proposed controlled next steps — each requires its own owner checkpoint

1. **Define scope on paper:** choose whether to **study Muscat first** (not launch), exact operator/entity, type of directory, allowed categories, intended audience and jurisdictions. Keep Dubai/Doha fictional demo behavior intact.
2. **Authorize scoped counsel and Privacy work separately:** only after owner authorization, seek qualified Oman opinions for D7-08 and G1/G3, then independently scope UAE/Qatar if planned. Do not select region, supplier or data-processing model before applicable facts are resolved.
3. **Authorize independent design review separately:** identify a qualified, conflict-screened reviewer, candidate version, evidence package and approved scope/budget, then resolve D7-02/03/04/05/06/07/09/10/11 in dependency order.
4. **Owner architecture decision:** consider D7-01/12 only after documented review and prerequisites; a frozen design or consultant opinion alone is not implementation authority.
5. **Separately authorize offline synthetic proof and any private implementation:** define exact access, environment, threat model, test scope and stop conditions. Protected APIs/IAM/storage remain prohibited until independently authorized.
6. **Reassess G2–G5 against exact implementation:** independent security, privacy, accessibility, recovery, moderation and performance evidence with issues tracked to closure or formally accepted scoped exceptions.
7. **Product-owner G6:** only if all required gates have independently documented sign-offs, issue an explicit dated GO/NO-GO naming region(s), features, contingency and stop authority; optional advertising and payments need their own decisions.

## Stop/reopen criteria

Stop on any missing or stale gate evidence; legal classification ambiguity; material product/content/data-flow change; new vendor/country; dependency/security regression; privacy incident; loss of operational coverage; expired reviewer sign-off or unapproved budget. Reopen every affected decision rather than carrying a previous approval forward silently.

## SEC-011 decision record

- Assessment author: repository desk review (not independent counsel, security assessor, accessibility certifier or deployment authority).
- Assessment date: **2026-11-21**.
- Product scope: existing fictional general-business directory only.
- Market priority: **Muscat-first research remains PROPOSED**, not approved as an operative launch choice.
- G1–G6: **OPEN**; G2 **NOT CLEARED**.
- D-001: **NO-GO** for **Dubai, Muscat and Doha**.
- Owner decision on this report: **PENDING** (accept assessment / request revisions).
- No countersignature, no expenses, no engagement, no permissions, no deployment.
