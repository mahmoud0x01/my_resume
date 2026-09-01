# ADR: Refine Hero to Junior Penetration Tester + proof strip

- Date: 2026-08-31
- Type: Architectural Decision Record
- Status: accepted
- Tags: hero, recruiter, hugo, css, proof-strip, penetration-tester
- Affected files: hugo.yaml, layouts/partials/sections/hero/index.html, static/css/recruiter.css

## Decision

Updated hugo.yaml hero.subtitle from 'Junior Penetration Tester | Blue-Team Foundations' to 'Junior Penetration Tester' + new hero.supportingAreas 'Web/API Security · Network Assessment · Linux & Systems'; replaced hero.content with focused positioning 'Junior penetration tester with a software engineering and Linux systems background, focused on web/API security, network assessment, vulnerability research, and understanding how real systems break.' Updated layouts/partials/sections/hero/index.html to render subtitle as primary hero-role-line (700/ink emphasis) with mono uppercase hero-supporting-areas line beneath, refreshed hero-proof-grid to compact stats: +20 Hall of Fame / $1,000 Verisign CSRF→ATO / Top 5/100 Bastion (Moscow) each with small detail, added identity-card-supporting + noscript supporting line. Added CSS in static/css/recruiter.css for .hero-supporting-areas and .identity-card-supporting and promoted .hero-role-line to ink/700 for primary identity.

## Rationale

Primary identity must scan immediately as Junior Penetration Tester without diluting with Blue-Team pipe; supporting areas moved to secondary muted mono line to preserve scan hierarchy while showing breadth. Previous content was generic authorized-testing phrasing; new copy explicitly ties software engineering + Linux systems background to web/API, network, vuln research and 'how real systems break' without inventing claims. Proof strip previously mixed internship metric (startup style); replacing with bellwether $1,000 Verisign bounty keeps all three cards factual evidence (20+ HoF Bugcrowd, Verisign CSRF OAuth, Bastion Top5) and avoids SaaS metrics look. CSS uses recruiter tokens and glass palette unchanged.

## Affected Files

- `hugo.yaml`
- `layouts/partials/sections/hero/index.html`
- `static/css/recruiter.css`
