# ADR: Enlarge Where I contribute desktop pills per Option A keep-and-enlarge

- Date: 2026-08-28
- Type: Architectural Decision Record
- Status: accepted
- Tags: recruiter, css, about, focus-areas, design-system, readability
- Affected files: static/css/recruiter.css

## Decision

Enlarged Where I contribute desktop pills per Option A: .focus-area-grid gap 0.8→0.95rem + align-items stretch/box-sizing/min-width guards; .focus-area-card padding 1→1.3rem keeping 0.85rem radius + max-width/box-sizing; h4 0.98→1.18rem !important (700/1.35); i/svg kept 1rem with line-height 1 inline-block crisp; .focus-area-items gap 0.35→0.45rem and li 0.70rem→0.88rem !important 600, padding 0.2×0.4→0.42×0.75rem !important, radius 0.35→0.5rem, box-sizing.

## Rationale

Pills were too small/sparse vs toolkit-tier-list (0.78rem/600) hurting desktop hierarchy and tap readability; increasing gap/padding/font/weight restores symmetrical 3-col breath while keeping min-width:0 stretch and readable line-height, without hiding focusAreas (compat comment retained).

## Alternatives Considered

Hidden Where I contribute or replaced with BBO-only layout was rejected; Option A keep-and-enlarge preserves backward compat and evidence tiers while fixing 0.70rem unreadable pills via parity with toolkit-tier-list.

## Affected Files

- `static/css/recruiter.css`
