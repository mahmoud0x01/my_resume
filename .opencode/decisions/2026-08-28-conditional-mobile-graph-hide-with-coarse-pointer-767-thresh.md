# ADR: Conditional mobile graph hide with coarse-pointer + 767 threshold and persisted toggle

- Date: 2026-08-28
- Type: Architectural Decision Record
- Status: accepted
- Tags: portfolio-graph, responsive, mobile, coarse-pointer, hugo, accessibility
- Affected files: static/js/portfolio-graph.js, static/css/portfolio-graph.css, hugo.yaml

## Decision

Unified list-mode threshold to 767px OR coarse pointer via matchMedia('(pointer: coarse)'), persisted via sessionStorage 'portfolioView' (list/graph). Initial mode respects storedView else shouldDefaultList(). Toggle click saves preference and toggles body.graph-force-mobile when graph forced on a coarse/narrow viewport to override CSS fallback. Added resize and coarseMatcher change listeners that force list only when shouldDefaultList() true, body not already in list-mode, and storedView !== 'graph' (respect explicit graph choice). Bumped portfolio-graph.js cache bust v10→v11. Added CSS failsafe @media (pointer: coarse) and (max-width:767px) { body:not(.graph-force-mobile) .constellation-wrap{display:none} #portfolio-list-view{display:block} .graph-view-controls{display:none} } so phones get list-only noscript fallback while fine-pointer tablets keep graph.

## Rationale

Mobile phones (coarse + ≤767) are poor for the interactive constellation; they should default to the recruiter-friendly list with no graph/toggle chrome, while capable tablets (fine pointer) and desktop keep the beautiful DOM/SVG graph. SessionStorage preserves user intent across navigation and prevents resize/coarse change from overriding an explicit graph choice on tablet. CSS fallback handles JS failure/noscript without hiding graph on fine-pointer iPads by requiring both coarse and narrow width plus body:not(.graph-force-mobile) escape hatch for forced graph.

## Alternatives Considered

Keep 992 threshold and no persistence (rejected: leaves iPad mini portrait incorrectly in list, coarse phones not distinguished from fine-pointer tablets, toggle state lost on navigation). Use pure CSS @max-width 767 hide without pointer check (rejected: hides graph on fine-pointer tablets like iPad mini landscape). Use unconditional JS OR without sessionStorage (rejected: user cannot persist graph preference, resize would ping-pong).

## Affected Files

- `static/js/portfolio-graph.js`
- `static/css/portfolio-graph.css`
- `hugo.yaml`
