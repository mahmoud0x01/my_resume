# ADR: Polish mobile PWA symmetry: symmetric 1fr grids, centered headings, timeline and control safeguards

- Date: 2026-08-28
- Type: Architectural Decision Record
- Status: accepted
- Tags: recruiter, css, mobile, pwa, responsive, grid, symmetry
- Affected files: static/css/recruiter.css, static/css/portfolio-graph.css

## Decision

Updated static/css/recruiter.css: at 991 writing/credentials/projects/focus/about-proof → 2col gap 0.9rem with box-sizing/min-width safeguards; at 767 hero-proof/bbo/proof/awards/writing/credentials/focus/about-proof/language-list/skills-list all collapse to 1fr gap 0.8rem width 100% align-items:stretch, hero shell centered (justify-items:center, margin-inline:auto), hero identity card centered (margin-inline:auto + justify-self:center), hero-graph-intro centered column + text-center, recruiter-section padding 3rem 0 with heading/dek centered (text-align:center + margin-inline:auto), about layout/ portrait centered, graph controls (graph-view-controls/graph-recruiter-controls/portfolio-recruiter-summary) flex-wrap + centered width min(100% -1.5rem,620px), timeline containers (experience-timeline/timeline-item/timeline-card) width100% overflow-x hidden + overflow-wrap anywhere; at 480 all 10 grids force 1fr gap0.8rem width100% !important + container width min(100% -1.25rem,620px), hero actions stretch, identity card centered, section padding 2.5rem, extra card safeguards width100% box-sizing; expanded bottom responsive block to cover all grids/cards with min-width0/max-width100% and 991 2col/767 1fr gap0.8rem for bbo/proof/awards. Updated static/css/portfolio-graph.css: added flex-wrap + max-width + box-sizing to graph-recruiter-controls, added responsive gaps and centered wrappers at 991/767/480 for recruiter-summary-grid and controls. Updated recruiter.css graph-view-controls base to flex-wrap + max-width. No neon/matrix; glass tokens preserved.

## Rationale

Mobile QA showed asymmetric grids at 767 (2-col where PWA expects single column stack) causing uneven card widths and left-aligned headings, hero proof cards squeezing to 3col and identity card left-aligned (justify-self:start) creating overflow, timeline 180px+40px+1fr grid not collapsing cleanly, and graph controls overflowing narrow viewports. Need 3→2 at 991 then 1fr at 767/480 for perfect symmetry, centered containers/headings for PWA feel, box-sizing/min-width0 to prevent horizontal scroll without using overflow:clip chain, and flex-wrap on controls. Kept 991 2-col intact by not using !important at 767 (except skills-list where both breakpoints use !important but later source order ensures correct cascade), added !important only at 480 where needed. Preserved glass --recruiter-* and --cg-* tokens, no color changes, verified hugo --gc --minify still passes.

## Affected Files

- `static/css/recruiter.css`
- `static/css/portfolio-graph.css`
