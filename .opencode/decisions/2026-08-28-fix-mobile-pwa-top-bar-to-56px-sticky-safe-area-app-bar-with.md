# ADR: Fix mobile PWA top bar to 56px sticky safe-area app bar with symmetrical grid

- Date: 2026-08-28
- Type: Architectural Decision Record
- Status: accepted
- Tags: pwa, navbar, app-bar, responsive, safe-area, mobile, recruiter, design-system
- Affected files: static/css/design.css, static/css/recruiter.css

## Decision

Implemented 56px sticky PWA app bar in design.css: #profileHeader position:sticky top:0 z-index 1000 height 56px with env(safe-area-inset-*) padding, color-mix 92% bg + blur 14px saturate 120% backdrop-filter, 1px border, isolation isolate; nav.navbar 56px flex center transparent; container-fluid grid 44px 1fr auto width min(1180px, calc(100% -2rem)) margin-inline auto with 991/480 width overrides; toggler 44px grid + 10px radius + focus-visible outline; tap targets 44px for nav-social/theme; nav-resume-link 36px/0.78rem; added mobile <991 absolute collapse dropdown centered vertical list with full-width nav-page-links; hide toggler at >=992 and switch grid to 1fr auto; updated showHeaderOnTop duplicate to color-mix no-jump; patched recruiter.css nav-resume-link 40px->36px, 0.8rem->0.78rem, 0.4rem 0.95rem->0.35rem 0.85rem. Left HTML mx-* untouched (CSS overrides).

## Rationale

Top bar was non-PWA: relative position, no safe-area, 1rem padding, Bootstrap container-fluid mx-* gutters caused asymmetry and overflow at 320px; hamburger and right cluster tap targets inconsistent, recruiter bar not sticky causing jump on scroll. 56px is iOS/Android PWA standard app-bar height; sticky top with env(safe-area-inset-*) ensures notch/Dynamic Island coverage; backdrop blur 14px saturate 120% gives native glass; symmetrical grid 44px (toggler) / 1fr (center nav) / auto (socials) with 0.75rem gap gives PWA symmetry and ensures 44px tap targets (WCAG) fit 320px (right ~200px + 44 + gaps < 300px inner). Absolute collapse at <991 keeps header 56px height fixed and shows centered vertical list without pushing content; hide toggler at >=992 restores horizontal nav while keeping width overrides for symmetry.

## Affected Files

- `static/css/design.css`
- `static/css/recruiter.css`
