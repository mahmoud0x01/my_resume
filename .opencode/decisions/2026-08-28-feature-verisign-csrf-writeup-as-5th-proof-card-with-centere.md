# ADR: Feature Verisign CSRF writeup as 5th proof card with centered orphan symmetry

- Date: 2026-08-28
- Type: Architectural Decision Record
- Status: accepted
- Tags: recruiter, proof-grid, css, hugo, security-research, csrf, verisign
- Affected files: layouts/partials/sections/security-proof.html, static/css/recruiter.css, content/blogs/verisign-csrf-account-takeover-domainscope.md

## Decision

Added Verisign $1K CSRF→ATO (DomainScope OAuth state) as second card in SELECTED SECURITY PROOF alongside AppArmor and captcha, expanding grid from 4 to 5. Updated dek to “High-signal examples — each linked to its source.” to avoid drift. Reordered cards by impact/recency: AppArmor, Verisign ($1,000), Captcha, Bastion, Disclosure. Added CSS @media(min-width:768px) rule `.proof-grid .proof-card:last-child:nth-child(odd){grid-column:1/-1; max-width:calc(50% - 0.5rem); margin-inline:auto}` so 2-col desktop centers orphan at half-width while 1-col mobile stays full-width (PWA symmetry).

## Rationale

4×2 grid is symmetric; 5 with 2-col leaves 2-2-1 orphan left-aligned breaking visual balance. Requirement is to feature both bounty writeups separately alongside strong evidence without replacing Disclosure/Bastion. Full-width 5th (100%) would dominate; centered half-width preserves card scale and gap rhythm seen in hero-proof/about-proof grids. Min-width 768 scoping preserves mobile 1-col (991→2col, 767→1col) already established. Count-agnostic dek prevents future copy drift when proof count changes. Link verified against content slug verisign-csrf-account-takeover-domainscope.md (/blogs/verisign-csrf-account-takeover-domainscope/, title “$1,000 CSRF…” date 2018-04-15) so SEO slug and sitemap remain consistent. Hugo --gc --minify passes (136 pages).

## Affected Files

- `layouts/partials/sections/security-proof.html`
- `static/css/recruiter.css`
- `content/blogs/verisign-csrf-account-takeover-domainscope.md`
