# ADR: Curate Selected Security Proof to 4 cards and enable 2 security-relevant projects

- Date: 2026-08-31
- Type: Architectural Decision Record
- Status: accepted
- Tags: security-proof, projects, hugo, recruiter, portfolio, evidence-first
- Affected files: layouts/partials/sections/security-proof.html, hugo.yaml, layouts/index.html, layouts/partials/sections/projects.html, static/css/recruiter.css, static/css/projects.css

## Decision

Set layouts/partials/sections/security-proof.html to exactly 4 proof cards in approved order: Verisign OAuth CSRF ATO $1k (Research·Bug Bounty·Assessment·$1k, state missing→Google link→ATO+password set, $1k/HoF Apr 2018), Bastion Authorized Penetration Testing Moscow (Assessment·Authorized Testing·Moscow, web/network auth/injection/privesc Linux/Windows reporting, Top5/100 CTF), AppArmor RCE Containment (Research·Blue-team·Hardening, deny /bin/** x + deny network → audit DENIED exec /bin/sh → allowlist + disable_functions), Linux /etc/machine-id reverse engineering (Research·Reverse Engineering·Namespaces, strings + strace openat/read 33 + unshare -r -m mount --bind → Trial Active). Each card keeps proof-card glass style with title, 2-3 sentence built/problem/discovery, Why it mattered, and evidence link to verified blog slugs or #experience. Enabled hugo.yaml projects.enable true and curated featured to 2: TicketPro (Django/Postgres/WebSockets/RBAC, RBAC security angle) + Social Network Backend API (FastAPI/SQLAlchemy, auth/authz/password storage), demoted Restaurant and News Bot featured to false (verified Team Work Platform is TicketPro, so no new entity invented). Added projects partial after security-proof in layouts/index.html (hero→track-record→disclosure→experience→bbo→security-proof→projects→writing…), wrapped projects.html in enable guard, set recruiter.css .projects-grid base to repeat(2,minmax(0,1fr)) (writing-grid stays 3) to enforce 2 per row dark/glass, and added static/css/projects.css placeholder to satisfy index.html link 404.

## Rationale

Previously 6 cards broke the approved 4-item evidence IA (extra captcha+disclosure duplicated track-record/disclosure plus orphan centering fragility); reducing to 4 with 2x2 grid restores recruiter 60-sec scan balance and matches the evidence-only narrative (two live bounty/research, one authorized testing, one blue-team/hardening). Project section was disabled despite having 6 items, many not security-relevant; enabling with 2 verified, security-angled builds (TicketPro RBAC/team workflow ≡ Team Work Platform, Social Network authz/password storage) prevents invented projects while showing engineering credibility. Index order places projects directly after security-proof as engineering proof before research notes, preserving even-section alternating backgrounds. Two-col grid keeps PWA symmetry (2→1 at 767) with existing glass tokens and no new colors, and enable guard prevents rendering when disabled.

## Affected Files

- `layouts/partials/sections/security-proof.html`
- `hugo.yaml`
- `layouts/index.html`
- `layouts/partials/sections/projects.html`
- `static/css/recruiter.css`
- `static/css/projects.css`
