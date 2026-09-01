# ADR: Increase skill node chip and spacing for visual hierarchy

- Date: 2026-08-28
- Type: Architectural Decision Record
- Status: accepted
- Tags: portfolio-graph, css, skill-sizing, physics, layout
- Affected files: static/css/portfolio-graph.css, static/js/portfolio-graph.js

## Decision

Increased skill chip sizing in both repos: CSS desktop .cnode--skill font 0.92->1.05rem pad 0.45rem 0.95rem 0.45rem 0.55rem gap 0.4rem (kept) border-radius 999px, new .cnode--skill .cnode-icon 30->34px font 1.05rem; @767 font 0.78->0.88 pad 0.32rem 0.68rem icon 26->30 font 0.85 rem via new .cnode--skill .cnode-icon rule (generic .cnode-icon kept 26px/0.72rem); @480 font 0.7->0.80 pad 0.28rem 0.58rem icon 22->26 font 0.72rem (generic kept 22px/0.62rem). JS minDists.skill 150->175 desktop, 90->105 mobile, spread leaf 120->135; other minDists unchanged. Applied byte-identical via cp to portofolio-dev-new.

## Rationale

Skill pills were visually recessive vs category/award pills while carrying the most items; larger chip+icon and increased physics clearance (minDists + spread) restores hierarchy and prevents overlap after growth. Scoped to skill-only by adding specific .cnode--skill .cnode-icon rules instead of editing generic .cnode-icon, preserving other node types per task.

## Alternatives Considered

Keeping 0.92rem/150-90 distances (rejected: skill pills remain visually undersized vs category pills; tight 120 spread/minDists cause collision after larger chip). Using generic .cnode-icon overrides at 767/480 (rejected: would enlarge all node types, violating scope to skill-only).

## Affected Files

- `static/css/portfolio-graph.css`
- `static/js/portfolio-graph.js`
