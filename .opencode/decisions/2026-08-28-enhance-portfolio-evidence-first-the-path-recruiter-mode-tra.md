# ADR: Enhance portfolio evidence-first: THE PATH recruiter mode, track-record/disclosure/BBO/proof, tiers and RESEARCH & NOTES

- Date: 2026-08-28
- Type: Architectural Decision Record
- Status: accepted
- Tags: recruiter, portfolio, hugo, security-proof, responsible-disclosure, break-build-operate, graph, evidence-first
- Affected files: hugo.yaml, layouts/index.html, layouts/partials/sections/hero/index.html, layouts/partials/sections/about.html, layouts/partials/sections/writing.html, layouts/partials/sections/contact.html, layouts/partials/sections/track-record.html, layouts/partials/sections/disclosure.html, layouts/partials/sections/bbo.html, layouts/partials/sections/security-proof.html, static/css/recruiter.css, static/css/portfolio-graph.css, static/js/portfolio-graph.js

## Decision

Enhanced Hugo portfolio evidence-first while preserving Gravity Atlas dark identity and interactive DOM/SVG career graph: hero proof metrics corrected (20+ HoF/Top5/100/2 internships), primary CTA VIEW SECURITY WORK + Résumé/GitHub, graph subtitled THE PATH with EXPLORE/RECRUITER mutual-exclusion toggle (recruiter summary ROLE/PROOF/CORE AREAS/LINKS), about rewritten to 3 paragraphs + authorized-scope disclaimer, added SECURITY TRACK RECORD / RESPONSIBLE DISCLOSURE (Bugcrowd https://bugcrowd.com/h/mahmoud_adel absolute) / BREAK BUILD OPERATE (3-col) / SELECTED SECURITY PROOF (AppArmor feat + Bastion CTF + Disclosure + Two Captcha Bypasses) sections, writing renamed RESEARCH & NOTES with featured AppArmor sequence and dynamic 10-note count, skills replaced by tiered toolkit, credentials/training honestly grouped, recruiter/contact SEO OG absolute.

## Rationale

Recruiter 60-sec scan failed on generic paragraph, misaligned proof numbers, undifferentiated skill wall, and graph without recruiter scan mode; new IA front-loads chronology and evidence without flattening into conventional résumé; all copy respects non-negotiable truth rule (no invented CVEs/bounty amounts/leadership, lab ≠ client, training ≠ cert) and uses Bugcrowd profile as only external recognition URL supplied.

## Alternatives Considered

Flat résumé timeline rejected — keeps glass graph differentiator; Canvas engine rejected — loses FA icons and DOM features; Keeping hero “Download résumé” primary rejected — spec requires VIEW SECURITY WORK primary; Hardcoded 7+ notes rejected — uses dynamic len calculation; Single skill wall rejected — tiered CORE/APPLIED/FAMILIAR/ENGINEERING with no percentages communicates honest exposure; Vendor-homepage VERIFY links rejected — only real credential URLs (credly/securityblue) gated.

## Affected Files

- `hugo.yaml`
- `layouts/index.html`
- `layouts/partials/sections/hero/index.html`
- `layouts/partials/sections/about.html`
- `layouts/partials/sections/writing.html`
- `layouts/partials/sections/contact.html`
- `layouts/partials/sections/track-record.html`
- `layouts/partials/sections/disclosure.html`
- `layouts/partials/sections/bbo.html`
- `layouts/partials/sections/security-proof.html`
- `static/css/recruiter.css`
- `static/css/portfolio-graph.css`
- `static/js/portfolio-graph.js`
