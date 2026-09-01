# ADR: Fix legend overflow by moving legend to flow layout below graph

- Date: 2026-08-28
- Type: Architectural Decision Record
- Status: accepted
- Tags: portfolio-graph, css, legend, layout, pwa, overflow
- Affected files: static/css/portfolio-graph.css

## Decision

Moved .constellation-legend from absolute overlay (bottom:2rem, left:50%, translateX) to relative flow layout (position:relative, bottom:auto, left:auto, transform:none, margin:1.5rem auto 0) and changed .constellation-wrap padding from 2rem 1rem 4rem to 2rem 1rem 1.5rem with gap:1.2rem so flex column separates graph and legend. Removed redundant position override in @991 block (now inherits base). Keeps glass capsule, dots, max-width.

## Rationale

Absolute legend at 2rem from bottom sat on top of nodes at y~93% causing collision. Flow layout puts legend below #portfolio-constellation as a centered PWA-style bar with breathing room (gap + margin-top). Wrap bottom padding 4rem was for overlay clearance and is now excess; 1.5rem + gap preserves safe area without wasting vertical space. No recruiter.css overrides needed (only border/bg tweaks). Responsive @991 now identical to base so deduplicated. Verified hugo --gc --minify passes and max-width prevents horizontal scroll.

## Affected Files

- `static/css/portfolio-graph.css`
