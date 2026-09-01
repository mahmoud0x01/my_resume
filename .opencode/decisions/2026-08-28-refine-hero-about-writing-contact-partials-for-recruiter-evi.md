# ADR: Refine hero/about/writing/contact partials for recruiter evidence flow

- Date: 2026-08-28
- Type: Architectural Decision Record
- Status: accepted
- Tags: hero, about, writing, contact, hugo, recruiter, evidence-first, portfolio-graph
- Affected files: layouts/partials/sections/hero/index.html, layouts/partials/sections/about.html, layouts/partials/sections/writing.html, layouts/partials/sections/contact.html

## Decision

Refined hero, about, writing, contact partials per recruiter evidence-first spec: hero proof grid now 3 evidence cards (+20 HoF/Responsible disclosure, Top5/100 Bastion CTF/Pen testing, 2 internships/1× pen testing), hero actions reordered to primary View security work (#security-proof) with secondary Download résumé and GitHub ($githubURL) plus tertiary Email me text, preserved micro links and truncated value proposition; graph intro changed to The path / THE PATH subtitle and added Explore/Recruiter mode controls + hidden recruiter summary grid; about adds toolkitTiers Evidence tiers rendering before skills, retains focusAreas with compat comment, keeps skills as legacy-muted list with dynamic writing count note after; writing kicker/title renamed to Research & notes/RESEARCH & NOTES, featured AppArmor card via GetPage with sequence, filtered 3-card grid excluding featured, dynamic archive count; contact adds Telegram (hero socialLinks or fallback https://t.me/rdmsr) and Résumé download links with markdownify preserved.

## Rationale

Hugo.yaml already contains proofPoints (+20/Top5/2), toolkitTiers (CORE/APPLIED/FAMILIAR/ENGINEERING) and featured AppArmor RCE blog; partials were lagging behind data and showed stale copy (Red+blue, single List toggle, hardcoded 7+ notes, missing telegram/resume). Updates unify proof language across hero/about, enforce primary CTA to security work not resume, enable recruiter scan mode (hidden summary toggled via JS), surface tiered toolkit without duplicating flat skill wall, and make writing/contact evidence-first with dynamic counts and featured research.

## Alternatives Considered

Keeping hero proof grid as red+blue perspective (rejected: inconsistent with evidence-first hugo.yaml proofPoints); keeping single graph toggle only (rejected: spec requires Explore/Recruiter toggle); hiding about skills entirely when tiers exist (rejected: keep legacy fallback with muted class to avoid breaking existing layout).

## Affected Files

- `layouts/partials/sections/hero/index.html`
- `layouts/partials/sections/about.html`
- `layouts/partials/sections/writing.html`
- `layouts/partials/sections/contact.html`
