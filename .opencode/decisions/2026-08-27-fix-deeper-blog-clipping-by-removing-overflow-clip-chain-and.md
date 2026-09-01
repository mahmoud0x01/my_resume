# ADR: Fix deeper blog clipping by removing overflow clip chain and housing h2 bar inside padding

- Date: 2026-08-27
- Type: Architectural Decision Record
- Status: accepted
- Tags: blog, css, overflow, clipping, gravity-atlas
- Affected files: static/css/blog.css

## Decision

Removed self-defeating overflow chain from blog.css (deleted `html{overflow-x:clip}`, `#single.blog-page{overflow-x:clip}`, `.blog-shell{overflow-x:clip}`) so parent chain no longer clips children; rehoused h2 decoration inside the element by changing `h2::before{left:-1rem}` to `left:0` (mobile `left:-0.65rem` to `left:0`) and adding `h2{padding-left:1.2rem}` with absolute bar at left edge; added ` .blog-prose{padding-inline:0.5rem}` (box-sizing:border-box, width:min(100%,72ch) margin:auto preserved) to prevent text touching shell edge on tight gutters. Soft radial washes unchanged, no grid/pinstripe reintroduced. Applied byte-identical file to both repos via cp.

## Rationale

Prior patch set overflow-x:clip on three ancestors (html, #single, .blog-shell) which established a clip context that overflow:visible on prose/layout could never escape per CSS spec, so both the decorative bar and the first word of list items (“1. USE…”) were clipped even after hard reload. Text clipping was compounded by 72ch prose width leaving only 1rem total gutter inside calc(100%-2rem) shell, so any edge touching read as clipping. Moving the bar inside padding eliminates the need for overflow outside the box, and removing the entire clip chain lets inline padding and natural flow breathe without horizontal scroll; washes are positioned absolute within isolated #single and need no clip. Byte-identical copy ensures both portfolio-infosec and portofolio-dev-new render identically.

## Alternatives Considered

Keeping overflow-x:clip on html/#single/.blog-shell (rejected: creates clip context that prevents any child overflow:visible from escaping, hides both h2::before decoration and “1. USE .ENV FILES” text); keeping h2::before at left:-1rem/-0.65rem outside the box (rejected: requires a parent clip to be removed but still needs hanging overflow); adding html{overflow-x:hidden} (rejected: still creates a clip context similar to clip; washes do not need a clip container).

## Affected Files

- `static/css/blog.css`
