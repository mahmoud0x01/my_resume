# ADR: Fix mobile PWA top bar 56px sticky symmetry and hero overlap

- Date: 2026-08-29
- Type: Architectural Decision Record
- Status: accepted
- Tags: pwa, navbar, app-bar, responsive, mobile, symmetry, recruiter, safe-area
- Affected files: static/css/design.css, static/css/recruiter.css

## Decision

Restore PWA 56px sticky app bar symmetry: fix grid 44px 1fr auto misplacement when collapse absolute by forcing .nav-social-links to grid-column:3/2 (991 vs 992), override mx-* margins with margin-inline:auto !important, add overflow:hidden + max-width on social cluster, shrink/hide instagram at 360px (36px or display:none), keep navbar-collapse absolute dropdown out-of-flow, add background-color:var(--bg)!important fallback and background:color-mix 92% !important with html body specificity hardening to beat body.light > #profileHeader, update scroll-margin from 72px to calc(56px+safe-area) and hero min-height from 100vh-72 to 56, add scroll-margin to hero/recruiter shells.

## Rationale

Grid 44px 1fr auto misplaced right cluster into middle 1fr when center collapse was absolute (out-of-flow), causing Résumé centered and icons scattered over hero; 346px right cluster overflowed 320vw (300px) + mx-* gutters +0.75gap=114px spill. color-mix 92% was overridden by body.light > #profileHeader !important at line 885 causing transparent hero show-through. Sticky 56px had no scroll-margin offset (72 old). Fix restores native PWA bar: hamburger left 44px, empty center, right auto locked to col3, absolute collapse doesn't shift grid, overflow hidden + 360 hide trims cluster to 290px, !important + specificity ensures glass survives light theme, 56px scroll-margin prevents anchor underlap.

## Affected Files

- `static/css/design.css`
- `static/css/recruiter.css`
