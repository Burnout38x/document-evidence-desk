# Release evidence — 2026-11-09

Built with Argon. API credentials deferred by user; no paid calls performed. User authorized public technical docs, a $5 total AI maximum, a public new Burnout38x repository and portfolio link once live.

## Observed
- Install: 68 packages; audit 0 vulnerabilities at install time. React/Vite reused from existing portfolio. React/Vite MIT, Lucide ISC, fonts OFL.
- Build passed: approximately 227KB JS /72KB gzip; 25KB CSS /6.4KB gzip. This is not Core Web Vitals measurement.
- npm test: 20 passed, including real local HTTP server integration. Provider/Redis boundaries mocked. Redis binaries absent; Lua and paid provider integration unverified.
- Evaluation: 20/22 development/review fixtures;14/15 hits,6/7 abstentions. Two known failures deliberately displayed.
- Browser localhost4180: caching question retrieves attributed note and inspector; weather question yields insufficient evidence; cache-source filter excludes fetch results; evaluation displays two Fail rows; home returns from other views; modal Escape closes and restores focus; navigation moves focus to heading.
- Mobile390px reviewed; document width390. Narrow320px no overflow; initial header overlap repaired using compact New question icon. Follow-up results below.
- Several small labels darkened after independent contrast review. No claim of complete WCAG conformance, screen-reader audit or field performance.

## Corrections
Vite middleware registration originally returned an unintended after-hook; repaired. Native Node API response support and bounded request parsing added with real HTTP tests. Home navigation, async cancellation and provider availability wording corrected after independent review.

## Design rationale
Recruiters can ask, inspect evidence and verify original documentation. Sage/ivory/forest and brass distinguish a usable app while preserving rounded portfolio style. Native forms, details and dialog reduce dependency complexity. Reduced-motion disables all motion; decorative motion is hover-only.
Sources reviewed Nov9: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog ; https://www.w3.org/WAI/ARIA/apg/patterns/tabs/ ; https://vite.dev/guide/ . Workspace uses navigation buttons, not incomplete ARIA tabs. Kept verified Vite7 stack rather than migrating solely for a newer release.

## Release status
Publication/deployment outcomes appended after operations. Vercel CLI signed out; temporary deployment may provide a review link. Do not claim permanent production hosting until verified.

## Final observed release
- Public source published: https://github.com/Burnout38x/document-evidence-desk (initial commit73db91e).
- Vercel anonymous deploy succeeded, READY. Temporary URL https://speedy-cypress-eza6rph.tmp.now expires roughly one hour after deployment. It is NOT a permanent portfolio destination.
- Hosted browser: fetch404 suggested question produces one relevant source note; Save note action invoked without console errors. Downloaded file contents were not independently inspected.
- Hosted GET /api/answer returns {"available":false}; no paid calls.
- Final layouts at320/390/768/1280 had no observed horizontal overflow. 320px header overlap repaired. Source-library disclosure expands; modal Escape restores focus; local console no errors.
- Desktop screenshot retained outside repo: outputs/evidence-desk-preview.png.
- Vercel CLI and in-app browser are signed out. Permanent deployment and final portfolio link remain pending user account access. The expiring temporary URL was not added to the public portfolio.

## Resume
Import this GitHub repo into the user's Vercel account with Vite/root ./ and no environment variables for evidence mode. Verify the permanent URL, then add the product beside NaijaGameHub in outputs/portfolio with a screenshot and accurate Evidence mode label. Connect AI later following work/provider.md; do not expose credentials or enable without the durable ledger and a paid smoke test within the approved $5 ceiling.
