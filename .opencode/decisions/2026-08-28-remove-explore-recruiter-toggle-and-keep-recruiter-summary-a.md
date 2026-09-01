# ADR: Remove Explore/Recruiter toggle and keep recruiter summary always visible

- Date: 2026-08-28
- Type: Architectural Decision Record
- Status: accepted
- Tags: recruiter, hero, portfolio-graph, ux, a11y, hugo
- Affected files: layouts/partials/sections/hero/index.html, static/js/portfolio-graph.js, static/css/portfolio-graph.css, static/css/recruiter.css

## Decision

Removed Explore/Recruiter mode toggle: deleted graph-recruiter-controls block and hidden attribute from layouts/partials/sections/hero/index.html, reordered summary to appear after constellation-wrap and portfolio-list-view (always visible under both graph and list). Removed recruiterMode IIFE from static/js/portfolio-graph.js and cleaned listToggle.applyMode to only toggle portfolio-list-mode without touching recruiter state. Neutralized CSS hiding in static/css/portfolio-graph.css (removed [hidden] and .recruiter-mode-active rules, removed .graph-recruiter-controls/.graph-mode-btn blocks, updated media queries to target only .graph-view-controls, ensured .portfolio-recruiter-summary {display:block}). Updated static/css/recruiter.css to remove .graph-recruiter-controls from combined selectors at 767/480 breakpoints.

## Rationale

Toggle added friction for recruiter 60-sec scan: summary was hidden behind Recruiter button and mutually exclusive with graph/list, requiring extra click. Spec now requires evidence summary always visible as persistent scan anchor under both constellation and list view. Removing JS mode logic eliminates body.recruiter-mode-active cascade that hid constellation-wrap/list-view, and simplifies a11y (no aria-controls drift, no Escape handling). CSS always-visible ensures no display:none dependency.

## Affected Files

- `layouts/partials/sections/hero/index.html`
- `static/js/portfolio-graph.js`
- `static/css/portfolio-graph.css`
- `static/css/recruiter.css`
