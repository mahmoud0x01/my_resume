# ADR: Extend recruiter and portfolio-graph CSS for new homepage sections and recruiter mode

- Date: 2026-08-28
- Type: Architectural Decision Record
- Status: accepted
- Tags: recruiter, css, portfolio-graph, responsive, glassmorphism, homepage-sections
- Affected files: static/css/recruiter.css, static/css/portfolio-graph.css

## Decision

Appended spec-compliant CSS for Track-record, Break-Build-Operate, Selected Security Proof, Writing featured+sequence, and Toolkit tiers to static/css/recruiter.css (preserving existing tokens, overriding via later cascade). Added portfolio-graph recruiter mode (portfolio-recruiter-summary, recruiter-summary-grid, graph-recruiter-controls, graph-mode-btn, recruiter-mode-active) to static/css/portfolio-graph.css. Responsive rules at 991px (bbo/proof 2-col, summary 2-col) and 767px (1-col) ensure no horizontal scroll; dark adaptation via existing color-mix tokens.

## Rationale

Recruiter.css already contained partial disclosure/BBO/proof styles from previous implementer but lacked scoped timeline-link, writing featured badge/sequence, toolkit tiers, and ID-scoped section backgrounds; portfolio-graph.css lacked recruiter summary/mode controls entirely. Appending rather than overwriting preserves existing --recruiter-* and --cg-* tokens, avoids cascade races, and keeps file byte-compatible with earlier passes. Later definitions override earlier 4-col proof-grid (to spec 2-col) and correct bbo background to --recruiter-bg 72%. Responsive overrides at end guarantee 3→2→1 column collapse and min-width:0/max-width:100% prevents overflow. Graph controls use --cg-glass-border/text and integrate with existing .graph-view-controls spacing.

## Affected Files

- `static/css/recruiter.css`
- `static/css/portfolio-graph.css`
