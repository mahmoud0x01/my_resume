# ADR: Re-skin DOM/SVG portfolio graph with "Gravity Atlas" glass design language

- Date: 2026-08-25
- Type: Architectural Decision Record
- Status: accepted
- Tags: css, design-system, glassmorphism, portfolio-graph, theming, performance
- Affected files: static/css/portfolio-graph.css, static/css/portfolio-panel.css, layouts/partials/sections/hero/index.html, layouts/index.html

## Decision

Re-skinned the portfolio graph's existing DOM/SVG engine (kept; canvas engine NOT adopted) using tokens from the sibling project: --cg-* custom properties (palette indigo/green/teal/blue/gray/slate/violet/pink/amber/sky light+dark), glass surfaces (rgba fills + sheen gradient, 999px/16px radii), Space Grotesk type (Google Fonts link added in layouts/index.html), Courier-mono micro-labels. Nodes keep exact positions/sizes/classes (.cnode--*); courses/certificates became clip-path hexagons; ME node gained breathing ring + rotating dashed ring (::after); spotlight styled for BOTH legacy (.cnode--active/--dimmed, .constellation-edge--active/--dimmed) and contract classes (.is-hover/.is-dim/.is-lit); bg canvas #graph-bg-canvas styled z-index 0 below svg(2)/nodes(5); .graph-float-card gfc-* glass card; legend converted to 999px capsule with glowing 11px square dots driven by theme-aware --lg-* vars referenced from hero partial inline styles. Panel reskinned as glass drawer min(380px,92vw) / mobile 70vh bottom sheet.

## Rationale

The DOM/SVG engine must stay because Font Awesome SVG-injection icons render per node (canvas can't without an HTML-to-canvas pipeline). Hover transforms need !important + preserved translate(-50%,-50%) because GSAP entrance leaves inline transforms on every node. Transform transitions were excluded from base .cnode to avoid fighting GSAP tweens (declared only on .is-hover state). Awards kept their visible name labels (hexagon applied only to the icon disc) to preserve widescreen readability. backdrop-filter restricted to legend/float-card/popup/panel only — nodes use plain rgba fills for performance. color-mix() used with plain-rgba fallbacks so category tinting auto-adapts when JS repoints GROUP_COLORS to the new palette.

## Alternatives Considered

Full canvas-engine swap (rejected: loses FA icons per node and all DOM features like list view/hire-me popup); converting awards to icon-only hexagons (rejected: hides award names); transform transitions on base .cnode (rejected: conflicts with GSAP staggered entrance tweens).

## Affected Files

- `static/css/portfolio-graph.css`
- `static/css/portfolio-panel.css`
- `layouts/partials/sections/hero/index.html`
- `layouts/index.html`
