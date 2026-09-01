# ADR: Integrate graph re-skin: unify JS palettes with --cg-* tokens and close CSS cross-contract gaps

- Date: 2026-08-25
- Type: Architectural Decision Record
- Status: accepted
- Tags: portfolio-graph, integration, palette, css-cascade, cache-busting
- Affected files: static/js/portfolio-graph-data.js, static/js/portfolio-graph.js, static/css/portfolio-graph.css, hugo.yaml

## Decision

Replaced CAT_COLORS/GROUP_COLORS in static/js/portfolio-graph-data.js with the design-system palette matching the CSS --cg-* tokens exactly (GROUP: security #10b981/#34d399, development #3b82f6/#60a5fa, infrastructure #6b7280/#9ca3af, experience #8b5cf6/#a78bfa, recognition #f59e0b/#fbbf24; me kept #1a1a1a/#ffffff). Added three rules to portfolio-graph.css: .constellation-flow-dot {filter: drop-shadow(0 0 4px var(--edge-color))} after the edge section; .cnode-icon--subgroup 26px disc @ font-size .85rem/opacity .9 + i/svg width-height 1em line-height 1; .cnode--me .cterm-out .cterm-sep {opacity:.55; padding-inline:.35em}. Changed formatRoles separator glyph from '|' to '·' in portfolio-graph.js. Bumped cache versions: portfolio-graph-data.js v=5→6, portfolio-graph.js v=6→7 in hugo.yaml.

## Rationale

The two parallel agents left gaps: JS still shipped the old palette so color-mix() category tinting never saw the new hues despite CSS expecting them. Verification showed terminal.css :150 (.cterm-out .cterm-sep, !important muted color, padding 0 .1em) DOES reach the me-node terminal because graph.js reuses the same cterm-* classes and layouts/index.html loads terminal.css on the homepage — its theme-aware --term-dim color is already the desired muted look, so only padding needed overriding via a higher-specificity scoped rule (0-3-0) without an !important war. formatRoles hardcoded '|' even though it splits on ·, so the "not the old pipe look" end-state required the one-char glyph fix. Version bumps follow the repo convention established in the prior pass to defeat browser caching of changed JS.

## Alternatives Considered

Re-declaring separator color with !important in portfolio-graph.css (rejected: duplicates terminal.css's already-correct theme-aware --term-dim); leaving the pipe glyph since JS edits weren't enumerated (rejected: contradicts the specified end-state "NOT the old pipe look"; one-char fix in the exact function the spec named); skipping version bumps (rejected: returning visitors would cache stale palette/glyph).

## Affected Files

- `static/js/portfolio-graph-data.js`
- `static/js/portfolio-graph.js`
- `static/css/portfolio-graph.css`
- `hugo.yaml`
