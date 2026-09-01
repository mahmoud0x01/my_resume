# ADR: Consolidate skill wall into tiered toolkit and remove flat duplication

- Date: 2026-08-28
- Type: Architectural Decision Record
- Status: accepted
- Tags: about, toolkit, hugo, duplication, skills-list
- Affected files: hugo.yaml, layouts/partials/sections/about.html

## Decision

Removed duplicated flat skill wall from about.html (deleted the entire `if .Site.Params.about.skills.enable` block that rendered `skills-list`/`skills-list--legacy`) and preserved the dynamic archive count by moving `{{ $writingPages := where .Site.RegularPages \"Section\" \"blogs\" }}` + `<p class=\"writing-count-note\">` outside, after the `{{ with .Site.Params.about.toolkitTiers }}` block. Integrated the 7 missing items into toolkitTiers in hugo.yaml: CORE added Exploit Development, Red Team (8→10); APPLIED added Firewall (8→9); FAMILIAR added Malware Analysis, Threat Intelligence (8→10); ENGINEERING added Presentation Skills, Problem Solving (8→10) and broadened description to \"Programming, systems, infrastructure and professional effectiveness\". Total tiers now cover 39 skills with zero loss.

## Rationale

hugo.yaml had two sources of truth: `about.skills.items` (39 flat) and `about.toolkitTiers` (32 tiered), with 7 items only in the flat list, and about.html rendered both, duplicating the wall. Single evidence-tiered view is the intended IA; keeping both caused redundancy and stale counts. Integrating missing items into semantically correct tiers (CORE for offensive core, APPLIED for infra, FAMILIAR for exposure, ENGINEERING for systems+professional effectiveness) eliminates loss, reaches parity (39 total), and allows the flat wall template to be deleted while keeping the writing-count note visible. Hugo --gc --minify verifies template still valid.

## Alternatives Considered

Keeping flat wall as fallback with skills-list--legacy muted noted as fallback — rejected because it duplicates all 39 skills alongside 4 tiers, causing visual duplication and maintenance drift where 7 items existed only in flat list.

## Affected Files

- `hugo.yaml`
- `layouts/partials/sections/about.html`
