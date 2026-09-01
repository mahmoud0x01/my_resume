# ADR: Clarify Bastion as Russian cybersecurity leader Moscow, add Assessment tag, expand research featured to 2 vertical cards

- Date: 2026-08-29
- Type: Architectural Decision Record
- Status: accepted
- Tags: recruiter, bastion, moscow, security-proof, research-notes, featured-grid, hugo, css
- Affected files: hugo.yaml, layouts/partials/sections/track-record.html, layouts/partials/sections/security-proof.html, layouts/partials/sections/writing.html, layouts/partials/sections/hero/index.html, layouts/partials/sections/awards.html, static/css/recruiter.css

## Decision

Updated Bastion references pro-style: hugo.yaml experience.company to 'Bastion Cybersec Solutions — Russian Cybersecurity Leader, Moscow', awards.company to 'Bastion (Moscow)' with content mentioning Russian leader, proofPoints label/detail to Bastion (Moscow), track-record timeline badges to Bastion (Moscow) plus timeline-location muted lines, security-proof Bastion kicker to 'Assessment · Validation · Moscow' and description prefix 'Bastion — Russian cybersecurity leader, Moscow — ...', hero proof card to 'Bastion (Moscow) internal CTF' and summary to 'Bastion (Moscow) CTF — Russian cybersecurity leader'. Changed Verisign proof kicker from 'Research · Bug Bounty · $1,000' to 'Research · Bug Bounty · Assessment · $1,000'. Refactored RESEARCH & NOTES from single featured to 2 vertical cards: writing.html now fetches both /blogs/apparmor-rce-mitigation and /blogs/linux-trial-licensing-bypass-machine-id-unshare-mount-bind into .writing-featured-grid (2-col), excludes both from filtered grid and renders 3 unfeatured, with second featured badge 'Featured · Reverse Engineering' and sequence strings→strace→unshare→Trial Active. Added CSS .writing-featured-grid grid 2-col with .writing-card--featured grid-column:auto override and responsive collapse to 1fr at 767/480 (and 2-col at 991), included in all PWA symmetry groups.

## Rationale

Bastion appears in 6 contexts (hugo.yaml data, track-record timeline, proof grid, hero summary, awards wall, about proof). Single long company string in header would clutter nav, so location is shown inline where evidence is read: timeline badge (Moscow) + muted timeline-location line with full leader name, proof card kicker Moscow flag plus description prefix, hero proof card and summary, and awards badge (Moscow) with content full phrase. Keeping awards badge short preserves pill layout while content provides full phrase; hugo.yaml experience uses full 'Cybersec Solutions — Russian Cybersecurity Leader, Moscow' as source of truth. JS award-card--featured check changed from eq to in to survive longer company string. Verisign CSRF is both bug-bounty research and authorized assessment (validated via report/reward), so tag 'Assessment' adds evidence tier without removing Research. RESEARCH & NOTES had one large featured spanning full width; second high-signal Linux trial bypass (real research with strings/strace/unshare validation) deserves equal featured prominence vertically side-by-side, not demoted to grid. Two-col featured grid keeps vertical card style, filtered excludes both to avoid duplication, 3-grid below maintains PWA 1fr symmetry at 767/480.

## Affected Files

- `hugo.yaml`
- `layouts/partials/sections/track-record.html`
- `layouts/partials/sections/security-proof.html`
- `layouts/partials/sections/writing.html`
- `layouts/partials/sections/hero/index.html`
- `layouts/partials/sections/awards.html`
- `static/css/recruiter.css`
