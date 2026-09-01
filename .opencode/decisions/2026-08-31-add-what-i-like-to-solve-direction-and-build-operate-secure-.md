# ADR: Add What I Like to Solve direction and Build/Operate/Secure engineering advantage

- Date: 2026-08-31
- Type: Architectural Decision Record
- Status: accepted
- Tags: direction, bbo, build-operate-secure, recruiter, hugo, ia, design-system
- Affected files: layouts/partials/sections/direction.html, layouts/partials/sections/bbo.html, layouts/index.html, static/css/recruiter.css

## Decision

Created layouts/partials/sections/direction.html (id=direction, heading What I Like to Solve, Primary Offensive Security/Penetration Testing and Secondary Security Engineering/Linux & Systems, human line verbatim, 2-col glass cards). Repurposed layouts/partials/sections/bbo.html from 3-col BREAK BUILD OPERATE to 4-col BUILD→OPERATE→SECURE advantage with DESIGN→BUILD→AUTOMATE→OPERATE→SECURE lifecycle pill bar (flex wrap, accent Secure), BREAK/BUILD/OPERATE/SECURE cards (bbo-grid--4, bbo-card--secure, bbo-card-note) and blockquote differentiator “I don't only know how to test software...”. Updated layouts/index.html order to hero → direction → build-operate-secure → track-record → disclosure → experience → security-proof (direction after graph, before BBO). Added recruiter.css tokens for direction, lifecycle, 4-col grid and responsive 991→2col/767→1col with PWA symmetry, preserved #break-build-operate legacy anchor via sr-anchor span and dual selector #build-operate-secure+#break-build-operate.

## Rationale

Direction section was missing; task requires explicit What I Like to Solve with primary/secondary interests and human line to convey offense-first but systems-informed motivation without inventing claims. BBO previously 3-col Break/Build/Operate lacked explicit Secure reasoning and lifecycle context; 5-stage DESIGN→BUILD→AUTOMATE→OPERATE→SECURE visual plus 4-col cards makes junior differentiator tangible (building/operating experience explains why vulnerabilities exist, not just how to find them) while preserving BREAK for offensive credibility. Keep dark/glass tokens (var(--recruiter-*) and color-mix) and PWA 1fr symmetry; lifecycle uses pill capsule matching hero-proof style. Order hero→direction→BBO puts motivation before advantage before evidence, matching recruiter 60-sec scan (What → Why it matters → Proof). Legacy anchor retained to avoid breaking existing #break-build-operate links.

## Affected Files

- `layouts/partials/sections/direction.html`
- `layouts/partials/sections/bbo.html`
- `layouts/index.html`
- `static/css/recruiter.css`
