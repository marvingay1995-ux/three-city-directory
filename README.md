# Three City Directory

**Demo only.** Foundation 001 provides the mobile-first Next.js prototype for Dubai, Muscat and Doha. Foundation 002 adds the automated verification gate.

## Routes
- `/` — manual city selection
- `/dubai`, `/muscat`, `/doha` — city-specific fictional directory and search

## Local use
Use Node.js 22 and npm. Install from the committed lockfile.
```sh
npm ci --no-audit --no-fund
npm test
npm run typecheck
npm run build
```

Run `npm run dev` for a local preview. GitHub Actions runs the verification commands above for pull requests and pushes to `main`.

## Safety / release boundaries
- Fictional listings only; no real individuals or advertiser submissions.
- No authentication, contact, booking, checkout, payment processing, or external integrations.
- No deployment configuration, credentials, tracking, or paid services.
- Noindex metadata is included; this does not replace access controls.
- Local legal review and explicit approval are required before enabling real listings or commercial features.
