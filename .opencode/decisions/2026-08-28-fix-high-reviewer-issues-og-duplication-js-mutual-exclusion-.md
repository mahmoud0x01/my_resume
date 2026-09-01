# ADR: Fix HIGH reviewer issues: OG duplication, JS mutual exclusion drift, CSS BBO/proof duplication

- Date: 2026-08-28
- Type: Architectural Decision Record
- Status: accepted
- Tags: seo, og, a11y, portfolio-graph, recruiter-mode, css, bugfix
- Affected files: layouts/index.html, layouts/partials/sections/hero/index.html, static/js/portfolio-graph.js, static/css/recruiter.css, static/css/portfolio-graph.css

## Decision

Fixed layouts/index.html head to emit only non-duplicate OG extras with absolute URLs (og:image + twitter:image via absURL, canonical via .Permalink fallback) since _internal/opengraph+twitter_cards already emit title/description/type/url; Patched hero mode buttons with aria-controls and JS recruiterMode.applyRecruiter to set aria-controls on both buttons and reset aria-label + portfolio-list-status when entering recruiter mode for mutual exclusivity parity with listToggle.applyMode; Removed duplicate BBO/proof grid definitions in recruiter.css (kept spec-compliant 3-col BBO / 2-col proof + 991→2col, 767→1col with bg 72%) deleting earlier 4-col proof/duplicate bbo block; Cleaned portfolio-graph.css leak by removing bbo/proof grid rule from @767 block, leaving only .recruiter-summary-grid.

## Rationale

Reviewer flagged duplicated OG/twitter meta causing scraper confusion and relative image URLs; canonical using Site.BaseURL breaks non-homepage permalinks. JS recruiter toggle left aria-label stale and status text announcing list view active while in recruiter mode, and missing aria-controls breaks a11y mapping to controlled regions. CSS had two competing BBO/proof definitions (first 4-col proof + 1100/480 breakpoints vs second spec 2-col) causing cascade override confusion, plus portfolio-graph.css incorrectly owned recruiter layout. Keeping single source (recruiter.css spec block) and graph-only rule restores cascade clarity; absolute URLs guarantee scraper-absolute images; aria fixes restore screen-reader consistency.

## Alternatives Considered

Minimal og:image absURL only without removing title/description duplicates (rejected: leaves duplicate meta for scrapers); keeping both BBO/proof blocks and relying on later cascade to override 4-col (rejected: fragile and confusing, 4-col still parses); leaving bbo/proof in graph CSS as safety (rejected: violates single-source principle, graph CSS should not own recruiter layout).

## Affected Files

- `layouts/index.html`
- `layouts/partials/sections/hero/index.html`
- `static/js/portfolio-graph.js`
- `static/css/recruiter.css`
- `static/css/portfolio-graph.css`
