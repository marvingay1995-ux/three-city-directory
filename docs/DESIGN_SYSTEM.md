# Design System — Three-City Directory v1.0

## Brand direction
Calm, contemporary, trustworthy, editorial. Avoid nightlife/escort aesthetics and misleading trust badges. City identities may use restrained accent variations without changing the common platform.

## Design tokens (proposed; review before implementation)
- Background: #111419; surface: #1c2026; elevated: #242831.
- Text: #f4f2ec; muted: #adb0b7; borders: #383b42.
- Accent: #d5bd83; interactive focus outline must meet contrast requirements.
- Spacing: 4px base scale; mobile-first; max content width 1160px.
- Radius: 8px controls, 14px cards. Typography: system sans fallback; scale 14/16/20/28/44+.
- Do not rely on color alone for sponsored, verified, disabled or error states.

## Information architecture
- / — city selector, short value proposition, three clear city cards.
- /[city] — city landing, search, categories, filters, result count, listings.
- /[city]/categories/[category] — category-specific discovery (future demo).
- /[city]/listing/[slug] — fictional detail page (future demo).
- /about, /policies, /accessibility — explanatory pages (future).
- /admin — future disabled/internal-only; do not expose a fake functioning login.

## Components
AppShell, SiteHeader, CityCard, CitySwitcher, SearchField, CategoryChip, FilterPanel, ListingCard, SponsoredDisclosure, Breadcrumbs, EmptyState, ErrorState, DemoBanner, Footer, ReportPlaceholder.

## Page behavior
- Mobile: single-column city cards, visible city switcher, large tap targets, compact filter drawer.
- Tablet/desktop: responsive 2–3 column card grid; no horizontal overflow.
- Keyboard: logical tab order, visible focus, Escape for any future modal, form submit on Enter.
- Screen readers: semantic heading order, descriptive links, result announcements when search changes.
- Search: URL query parameter q; trim whitespace, handle empty/no-results and invalid inputs safely.
- Content: no real portraits, testimonials, ratings or verification claims in demo.
- Sponsored demo examples must display an explicit Sponsored label; never imply a paid campaign is running.

## Visual review checklist
Test at widths 320, 375, 768, 1024, 1440; light/dark not required initially. Capture screenshots for homepage and each city. Check accessibility with keyboard and automated audit plus manual review. No externally hosted preview without approval.
