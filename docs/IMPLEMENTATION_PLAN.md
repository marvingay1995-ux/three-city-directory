# Codex Implementation Plan — Three-City Directory v1.0

## Workflow contract
Codex works from marvingay1995-ux/three-city-directory; never replace the repo. One isolated feature branch per phase; PR to main; no direct pushes to main. Run npm test, npm run typecheck, npm run build; report results with evidence. Do not merge without owner approval. Do not deploy, enable payments, onboard real businesses, use credentials, or incur costs.

## Phase 0 — Baseline reconciliation (first Codex task)
Read current main, PR history, CI and docs. Verify Foundation 001/002 actually merged. Identify inconsistencies (README status, CI command, package lock absence), capture baseline test/typecheck/build results. Fix only documentation or build blockers in an isolated PR. Deliver inventory and test evidence. No product features.

## Phase 1 — Demo UX expansion
Branch: feature/phase-1-demo-ux
Deliver city landing polish, category filters, URL-synced search, accessible empty states, demo banner and responsive navigation. Keep fictional fixtures. Tests for filtering, city scoping, unknown city and keyboard behavior. PR with screenshots from local environment. No deployment.

## Phase 2 — Fictional profile details
Branch: feature/phase-2-demo-profiles
Deliver listing detail routes, placeholder gallery, breadcrumbs, semantic metadata, report-action mock (no network), and sponsored sample disclosure. No real contact data. Tests for invalid listing, cross-city isolation and demo labels. PR with screenshots.

## Phase 3 — Domain and persistence design
Branch: feature/phase-3-domain-model
Define typed domain models, repositories, synthetic seed data, migration drafts and architecture decision records. Local-only database experiments require explicit authorization if any service or credential would be needed; prefer pure in-memory adapter. No production DB. Tests for states, scopes and transitions.

## Phase 4 — Moderation and administration prototype
Branch: feature/phase-4-admin-prototype
Design protected role model and mock admin screens; all mutations simulated, nonpublic, behind disabled flags. Audit model and moderation lifecycle tests. Real authentication, file uploads, or public submissions require separate approval.

## Phase 5 — Advertising prototype
Branch: feature/phase-5-ads-prototype
Define placements, sponsorship labeling, creative review and simulated campaign lifecycle. No advertiser onboarding, payment processing, live ad serving, real analytics or billing. Test sponsored disclosure and organic/sponsored separation.

## Phase 6 — Launch readiness assessment only
Produce accessibility/security/performance review, jurisdiction-specific legal checklist for UAE/Oman/Qatar, privacy and content moderation plan, threat model, operations budget and go/no-go decision. No deployment until explicit separate authorization.

## PR definition of done
- Clear scope, changed-file list, screenshots if UI changed.
- Tests, typecheck, production build passing.
- No live integrations or secrets; no unapproved dependencies or spend.
- Accessibility, responsive and city-isolation checks.
- Document risks, limitations and deferred decisions.
- Owner reviews and approves merge.

## Stop conditions
If scope requires production deployment, paid service, credentials, real-person data, payment functionality, scraping, legally sensitive category, or unexpected architecture change: STOP and request explicit owner decision. Never infer permission from a prior merge.
