# Technical Architecture — Three-City Directory v1.0

## Current verified baseline
Existing repository uses Next.js App Router, React, TypeScript, local static demo fixtures, CSS, Node test runner and GitHub Actions. Preserve main and existing routes. No production infrastructure exists or is authorized.

## Proposed layered design
1. UI: app/ route segments and accessible React components.
2. Domain: pure TypeScript models, validators, search/filter and city configuration.
3. Data access: initially synthetic fixture repository; future interface for PostgreSQL adapter.
4. Services: future moderation, ownership, advertising and audit workflows behind flags.
5. Integrations: NONE active. Do not provision external services.

## Suggested folder evolution
- app/[city]/... — city-specific pages.
- components/ — reusable presentation components.
- lib/domain/ — typed models and business rules.
- lib/data/ — fixture adapters; future DB interface.
- lib/config/ — city policy and feature flag configuration.
- tests/ — unit, route and accessibility tests.
- docs/ — decision records and release gates.

## Proposed data entities (design only)
City(id, slug, name, countryCode, locale, currencyCode, enabled)
Category(id, slug, parentId?, label, enabled)
Listing(id, cityId, categoryId, ownerId?, slug, title, description, status, verificationStatus, createdAt, updatedAt)
ListingMedia(id, listingId, assetRef, rightsStatus, sortOrder)
Submission(id, listingId, submittedBy, state, submittedAt)
ModerationDecision(id, submissionId, moderatorId, decision, reasonCode, createdAt)
Report(id, listingId, reasonCode, status, createdAt)
AuditEvent(id, actorId, action, targetType, targetId, occurredAt)
AdPlacement(id, cityId, categoryId?, slot, status)
Campaign(id, advertiserId, placementId, creativeRef, reviewStatus, startAt, endAt)
Avoid collecting personal data in demo fixtures. Future schemas require migrations, constraints, indexes, retention policies and access reviews before use.

## City isolation
Every listing query and moderation action must explicitly scope cityId; never trust a client-supplied city without server-side validation. Slugs are unique within a city. City configuration controls eligible categories, locale, currency display, and policy. No implicit country inference.

## Security architecture
Future RBAC: visitor read published; owner edit owned drafts; moderator review within assigned cities; admin configure and audit. Deny by default. Validate all input on server. Guard upload content types/sizes and ownership. Record audit events for moderation and administrative changes. No real auth, uploads, secrets or databases now.

## Advertising architecture
Separate organic relevance from sponsored inventory. Clearly label sponsored placements; never silently promote a paid listing. Campaign approval and eligibility checks before any delivery. No ad serving, tracking, payment processor, checkout or crypto support in authorized scope.

## Deployment and operational boundaries
No Vercel/Netlify setup, preview URLs, DNS, secrets, paid tools, external databases, webhooks or credentials without separate explicit authorization. GitHub CI is permitted for test/build verification only. Keep noindex for demos; it is not an access-control mechanism.

## Decisions deferred
Hosting provider, authentication provider, DB host, object storage, payment rails, advertising billing, analytics vendor, localization provider, legal entity and privacy notices. Record each as an ADR before implementation.
