# ADR: Redesign top navigation to lean 5-item evidence-first IA

- Date: 2026-08-28
- Type: Architectural Decision Record
- Status: accepted
- Tags: navbar, recruiter, hugo, a11y, evidence-first, header, mobile
- Affected files: layouts/partials/sections/header.html, hugo.yaml

## Decision

Replaced dynamic header center nav in layouts/partials/sections/header.html (removed ~70 lines of conditional About/Experience/Education/Projects/Awards/Contact plus Menus.main Blog loop) with explicit 5 hardcoded items: Security Work→#security-proof, Track Record→#track-record, Research→#writing, About→#about, Contact→#contact using {{ .Site.BaseURL | relURL }}#*. Preserved right-side socials+Résumé+Email+theme toggle unchanged, kept toggler aria-controls #navbarContent and nav-center-links mx-auto for centered lean bar. Updated hugo.yaml Menus.main from single Blog entry to 5 matching entries (security-proof/track-record/research/about/contact weights 1-5) for footer/search consistency; header hardcode is source of truth, Menus.main no longer rendered in header preventing duplicate Research/Blog. Long labels Security Recognition and OPEN TO SECURITY ROLES removed from top bar (section headings retain original titles); labels are short technical uppercase-friendly via existing .nav-page-link CSS.

## Rationale

Top bar was crowded with ~6-7 auto items plus Blog dropdown, exposing long wrapping labels (Security Recognition, OPEN TO SECURITY ROLES) that hurt recruiter 60-sec scan and mobile hamburger overflow. New IA mirrors page order hero→track-record→disclosure→experience→bbo→security-proof→writing→about→... but surfaces only flagship proof entry points: SECURITY PROOF (primary 4 cards), TRACK RECORD (timeline), RESEARCH (replaces Blog), ABOUT, CONTACT. Education/Courses/Credentials/Awards remain scrollable secondary sections; Experience omitted because Track Record directly covers internship lifecycle and sits adjacent, keeping 5 items prevents hamburger clutter at <992px. Hardcoding guarantees order and short labels independent of .Site.Params.awards.title/contact.title; cleaning Menus.main avoids duplicate Blog loop while keeping footer valid.

## Affected Files

- `layouts/partials/sections/header.html`
- `hugo.yaml`
