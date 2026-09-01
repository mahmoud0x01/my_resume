# ADR: Refactor infosec portfolio to evidence-first junior hiring manager flow

- Date: 2026-08-31
- Type: Architectural Decision Record
- Status: accepted
- Tags: infosec, refactor, evidence-first, portfolio-graph, hiring, ia
- Affected files: hugo.yaml, layouts/index.html, layouts/partials/sections/hero/index.html, layouts/partials/sections/security-proof.html, layouts/partials/sections/direction.html, layouts/partials/sections/bbo.html, layouts/partials/sections/projects.html, layouts/partials/sections/writing.html, layouts/partials/sections/experience.html, layouts/partials/sections/disclosure.html, layouts/partials/sections/track-record.html, layouts/partials/sections/awards.html, layouts/partials/sections/about.html, static/js/portfolio-graph-data.js, static/js/portfolio-graph.js, static/css/portfolio-graph.css, static/css/recruiter.css

## Decision

Refactored portfolio to evidence-first junior practitioner while preserving Gravity Atlas dark/glass graph: hero Junior Penetration Tester + supporting Web/API·Network·Linux & Systems + 20+/Top5 proof strip, Selected Security Work 4 (Verisign $1k OAuth CSRF ATO / Bastion Moscow authorized PT / AppArmor RCE killswitch / Linux machine-id reverse engineering), upgraded graph to evidence relationships (Web→Auth→OAuth→Verisign→Disclosure→$1k with project nodes TicketPro/Social API), direction + build→automate→operate→secure advantage, curated 2 projects, deduplicated HoF to compact archive + secondary wall, re-tiered 39 skills CORE 10/APPLIED 10/FAMILIAR 12/ENGINEERING 7 with lab qualifiers, rewrote experience to authorized-scope, reordered homepage Hero→security-proof→direction→bbo→projects→writing→experience→disclosure→about→track-record→education→courses→achievements→awards→contact.

## Rationale

Hiring manager scan failed on generic 50-tech cloud and 4× same HoF repetition; junior credibility requires honest depth hierarchy (lab vs exposure vs reported) and evidence chains linking skills→projects→research→disclosure with verifiable links (Bugcrowd, write-ups, reports) not inflated metrics; Graph differentiator kept but shifted from inventory to narrative, homepage hierarchy front-loads proof and differentiator while keeping visual depth and motion.

## Alternatives Considered

Flat skills wall kept as fallback (rejected: duplicates 39 items + focusAreas 27, creates 4× HoF repetition); awards timeline kept duplicate (rejected: visual duplication); canvas graph replacement (rejected: loses FA icons); senior Security Engineer title (rejected: implies higher seniority)

## Affected Files

- `hugo.yaml`
- `layouts/index.html`
- `layouts/partials/sections/hero/index.html`
- `layouts/partials/sections/security-proof.html`
- `layouts/partials/sections/direction.html`
- `layouts/partials/sections/bbo.html`
- `layouts/partials/sections/projects.html`
- `layouts/partials/sections/writing.html`
- `layouts/partials/sections/experience.html`
- `layouts/partials/sections/disclosure.html`
- `layouts/partials/sections/track-record.html`
- `layouts/partials/sections/awards.html`
- `layouts/partials/sections/about.html`
- `static/js/portfolio-graph-data.js`
- `static/js/portfolio-graph.js`
- `static/css/portfolio-graph.css`
- `static/css/recruiter.css`
