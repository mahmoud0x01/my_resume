# ADR: Fix clipped blog headings and code blocks by decoupling shell from Bootstrap container

- Date: 2026-08-27
- Type: Architectural Decision Record
- Status: accepted
- Tags: blog, css, bootstrap, overflow, clipping, portfolio-graph
- Affected files: layouts/_default/single.html, static/css/blog.css

## Decision

Decoupled blog shell from Bootstrap by removing `container` class from `layouts/_default/single.html:58` (now `class="blog-shell"` only) and hardened `static/css/blog.css` with byte-identical fixes in both repos: `.blog-shell` now has `box-sizing:border-box; padding-left/right:0; --bs-gutter-x:0; width:min(1160px,calc(100%-2rem)); max-width:none!important; margin-inline:auto; overflow-x:clip;` plus `.blog-shell.container` reset safety; `.blog-layout`/` .blog-main-column`/`.blog-prose` get `min-width:0; box-sizing:border-box;` and `overflow:visible` on header/prose wrappers so `h2::before` at -1rem is not clipped; code blocks `>pre, >.highlight, .term-block` enforce `max-width:100%; box-sizing:border-box; margin-inline:0; overflow-x:auto;` and legacy `themes/single.css #single .page-content pre {margin:5px}` neutralized via `#single.blog-page .page-content pre {margin:0!important; margin-block:1.6rem 2rem!important; margin-inline:0!important}`; global `html{overflow-x:clip}` and `#single.blog-page{overflow-x:clip}` safety retained soft radial washes unchanged.

## Rationale

Screenshot showed left-edge clipping of headings and terminal/code blocks due to Bootstrap `.container` gutters (`--bs-gutter-x` + padding) colliding with `.blog-shell` width `min(1160px,calc(100% -2rem))`, legacy `pre{margin:5px}` pushing code blocks, and `overflow:clip/hidden` cutting off decorative `h2::before`. Fix isolates shell from Bootstrap, normalizes box-model, allows horizontal scroll inside code blocks only, and keeps glass/Radial wash design unchanged. Byte-identical copy applied via patch script to both portfolio-infosec and portofolio-dev-new.

## Alternatives Considered

Keeping Bootstrap container class and trying to override with extra padding (rejected: leaves --bs-gutter-x gutters and still clips left decoration); using overflow:hidden on prose wrappers (rejected: clips h2::before at -1rem); scoping fixes only to code blocks without shell reset (rejected: headings still clipped via container gutters).

## Affected Files

- `layouts/_default/single.html`
- `static/css/blog.css`
