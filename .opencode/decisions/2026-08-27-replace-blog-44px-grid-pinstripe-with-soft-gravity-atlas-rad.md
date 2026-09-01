# ADR: Replace blog 44px grid+pinstripe with soft Gravity Atlas radial washes

- Date: 2026-08-27
- Type: Architectural Decision Record
- Status: accepted
- Tags: blog, css, background, design-system, gravity-atlas
- Affected files: static/css/blog.css

## Decision

Replaced busy blog background (44px linear grid + repeating-linear pinstripe ::after) with two soft radial washes matching recruiter.css hero: indigo at 16% 8% opacity 0.08 32rem and mint at 86% 16% opacity 0.07 30rem, background-size auto, ::before kept at z-index -2, ::after set to content:none/display:none, --blog-bg kept var(--bg,#f5f4f0) light / #0b1020 dark.

## Rationale

Grid + 44px pinstripe read as cheap notebook paper and broke visual parity with Gravity Atlas landing (recruiter.css hero uses only soft radials). Two large, low-opacity radial gradients provide premium depth without grid lines, align with design.css --bg globals, and preserve isolation/card glass. Same byte-identical file applied to both portfolio-infosec and portofolio-dev-new.

## Alternatives Considered

Keeping 44px grid + diagonal pinstripe (rejected: notebook-paper look clashes with premium Gravity Atlas hero); deleting ::before entirely (rejected: would leave flat solid background losing atlas depth); introducing new theme variables like --blog-wash (rejected: task requires unify with existing --bg / --blog-bg tokens).

## Affected Files

- `static/css/blog.css`
