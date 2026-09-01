# ADR: Enforce Toolkit pill uniformity via single-source grid and GSAP scale removal

- Date: 2026-08-28
- Type: Architectural Decision Record
- Status: accepted
- Tags: recruiter, css, toolkit, skills-list, grid, gsap, symmetry
- Affected files: static/css/custom.css, static/css/design.css, static/css/recruiter.css, static/js/scroll-animations.js

## Decision

Made recruiter.css single source for #about .skills-list: removed all #about .skills-list rules from custom.css (flex+1.0rem badge blocks deleted, kept only #awards) and from design.css (lines 413-451 flex/badge/dark blocks replaced with comment); recruiter.css grid hardened to display:grid !important; grid-template-columns:repeat(3,minmax(0,1fr)) !important; gap:0.70rem !important; justify-items:stretch !important; align-items:stretch !important; .skill-item/.badge now width:100% !important; justify-content:flex-start !important; responsive breakpoints @767/@480 bumped to !important; scroll-animations.js badge stagger changed from scale 0.7 + back.out(1.4) to opacity-only with ease power2.out and clearProps:'transform'. Applied byte-identical via cp to portofolio-dev-new.

## Rationale

First 3 pills appeared larger because GSAP scale 0.7 stagger 0.04 animates first items back to 1.0 earlier while others still scaled, plus competing sizing tokens (custom/design 1.0rem flex-wrap vs recruiter 1.02rem grid) and missing stretch caused asymmetric cell fill. Removing duplicate sources eliminates cascade race; grid+stretch makes 3-col/2-col/1-col symmetric; opacity-only reveal prevents mid-tween scaling.

## Alternatives Considered

Keeping dual flex/grid sources and overriding via cascade specificity (rejected: leaves 1.0rem vs 1.02rem conflict causing first pills larger); keeping GSAP scale 0.7 stagger and trying to mask with CSS !important (rejected: GSAP inline transform overrides during tween still creates mid-animation size divergence); syncing sizes instead of deleting in custom/design (rejected: duplicate maintenance burden, task prefers removal).

## Affected Files

- `static/css/custom.css`
- `static/css/design.css`
- `static/css/recruiter.css`
- `static/js/scroll-animations.js`
