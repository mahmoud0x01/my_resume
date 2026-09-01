# ADR: Implement EXPLORE/RECRUITER mode JS and SEO OG meta

- Date: 2026-08-28
- Type: Architectural Decision Record
- Status: accepted
- Tags: portfolio-graph, recruiter-mode, seo, og-meta, hugo
- Affected files: static/js/portfolio-graph.js, layouts/index.html, hugo.yaml

## Decision

Added recruiterMode IIFE after listToggle in static/js/portfolio-graph.js exposing Explore/Recruiter toggle for #graph-mode-explore/#graph-mode-recruiter ↔ #portfolio-recruiter-summary with body.recruiter-mode-active, is-active/aria-pressed sync, mutual exclusivity with portfolio-list-mode, Escape to return to Explore, hidden/tabindex a11y, and graceful no-op when elements missing; patched listToggle.applyMode to clear recruiter-mode-active and sync recruiter UI when entering list view. Added OG/Twitter/canonical meta to layouts/index.html head after description and bumped portfolio-graph.js?v=9→v=10 in hugo.yaml customScripts.

## Rationale

Hero partial already renders both mode controls and recruiter summary but no JS existed to toggle them; spec requires mutual exclusivity (list vs recruiter) and keyboard Esc handling while respecting reduced-motion (no animation) and not breaking when elements absent. ListToggle previously could leave both modes active, breaking .recruiter-mode-active CSS (which hides constellation-wrap/list-view). SEO OG meta was missing from index head; adding OGP/Twitter/canonical improves share previews using existing .Site.Params.title/description/hero.image and .Site.BaseURL to avoid Permalink context issues. Version bump forces cache invalidation for changed JS.

## Alternatives Considered

Keeping recruiter summary statically hidden and only CSS-toggled (rejected: requires JS for aria-pressed, mutual exclusion with list view, and Escape handling). Using .Permalink for canonical without fallback (rejected: .Permalink may be unavailable in head block; .Site.BaseURL is always valid).

## Affected Files

- `static/js/portfolio-graph.js`
- `layouts/index.html`
- `hugo.yaml`
