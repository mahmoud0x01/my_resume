# ADR: Enlarge Toolkit skill pills in recruiter.css

- Date: 2026-08-28
- Type: Architectural Decision Record
- Status: accepted
- Tags: recruiter, css, toolkit, skills-list, styling
- Affected files: static/css/recruiter.css

## Decision

Enlarged Toolkit skill pills in static/css/recruiter.css #about .skills-list in both portfolio-infosec and portofolio-dev-new (kept byte-identical via cp): gap 0.55rem→0.70rem; .skill-item/.badge font-size 0.82→1.02rem, padding 0.5rem 0.65rem→0.62rem 0.95rem, gap 0.45→0.55rem, border-radius 0.62→0.75rem, font-weight 500→600; .skill-marker 0.38→0.46rem. Updated both base rules (lines ~541-588) and duplicate .badge.badge-secondary selector to match. Grid columns preserved at 3→2→1 breakpoints. Both Hugo builds verified passing.

## Rationale

Toolkit pills were undersized vs visual hierarchy of the About section; larger font/padding/gap and marker improve legibility and tap target while staying within existing 3-col grid. Scoped strictly to #about .skills-list to avoid touching project/writing grids or other pills. Byte-identical cp ensures both infosec and dev-new deploys render identically.

## Affected Files

- `static/css/recruiter.css`
