# ADR: Enlarge Verisign reward screenshot and document password-change business logic

- Date: 2026-08-28
- Type: Architectural Decision Record
- Status: accepted
- Tags: verisign, csrf, blog, business-logic, oauth, reward-figure, css
- Affected files: content/blogs/verisign-csrf-account-takeover-domainscope.md, static/css/blog.css

## Decision

Added business-logic paragraph explaining password change without current password in Impact section as blockquote, extended Step 3 bullet 3 with persistent takeover via My Profile, replaced markdown reward image with HTML figure.verisign-reward-figure (width 100%, border var(--recruiter-border), radius 0.85rem, shadow) plus figcaption, removed duplicate italic caption, and added dedicated CSS rules for .verisign-reward-figure/img/figcaption in blog.css to ensure full-width glass card rendering inside 72ch prose and correct border/muted color theming.

## Rationale

LinkedIn-OAuth-first accounts had no password, so My Profile → Change Password legitimately omitted current-password check; attackers authenticated via hijacked Google link could set a password and retain access via both OAuth and password even after unlink. Previous markdown image was constrained to prose width via generic img max-width 100% but without figure card styling and with small duplicate caption; replacing with HTML figure + inline shadow/border and CSS fallback makes reward screenshot prominent and theme-aware while preserving $1,000 SEO and front-matter featured image. Hugo build verifies HTML figure passes markdown rendering and no overflow.

## Affected Files

- `content/blogs/verisign-csrf-account-takeover-domainscope.md`
- `static/css/blog.css`
