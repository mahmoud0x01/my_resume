# ADR: Add graph background canvas, curved spotlight edges, float card and FA icon audit

- Date: 2026-08-25
- Type: Architectural Decision Record
- Status: accepted
- Tags: portfolio-graph, canvas, svg-paths, spotlight, float-card, icons

## Decision

Implemented the JS side of the graph re-skin contract: new static/js/graph-background.js exposing window.GraphBackground.init/destroy which mounts canvas#graph-bg-canvas as first child of .constellation-wrap and paints the reference background (seed-42 LCG radial wash, 3 fog blobs, 140/60 twinkling parallax stars with constellation lines, 28 particles, dark-only vignette, indigo glow tracking the me-node). Edges upgraded from SVG line to quadratic path with unchanged classes and metadata so panel, edgeLookup and GSAP stay intact; lit edges get getPointAtLength flow dots. Hover emits is-hover/is-dim/is-lit plus legacy classes; build-once .graph-float-card (.gfc-title/.gfc-badges/.gfc-link) follows cursor, hidden for coarse pointers and list mode. Data: me identity refreshed, Hugo skill added under sg-devtooling, education renamed, full FA6 Free icon audit removing all duplicates and invalid icons. hugo.yaml customScripts: data v=5, new graph-background.js v=1, graph.js v=6.

## Rationale

CSS agent styles exact contract names (#graph-bg-canvas, .graph-float-card gfc classes, is-hover/is-dim/is-lit), so behavior had to be implemented precisely on the JS side without touching layout constants, physics, GSAP entrance, list view, terminal or panel signature. Paths are cheap per frame and unlock flow particles; panel compatibility verified first. Dark mode polled per frame from html/body class so theme toggles apply live; also fixed pre-existing observer bug where --node-color was recomputed from n.cat instead of n.group.
