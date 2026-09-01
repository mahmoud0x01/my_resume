# ADR: Reorder RESEARCH & NOTES before PROJECTS and rename to Selected Projects

- Date: 2026-08-31
- Type: Architectural Decision Record
- Status: accepted
- Tags: ia, homepage, projects, research, hugo
- Affected files: layouts/index.html, hugo.yaml

## Decision

Reordered homepage IA to place RESEARCH & NOTES (writing) before PROJECTS: swapped partial order in layouts/index.html to hero → security-proof → direction → bbo → writing → projects → experience → disclosure → about → track-record → education → courses → achievements → awards → contact. Renamed hugo.yaml projects.title from "Engineering & Security Projects" to "Selected Projects" to avoid calling them security projects; projects.html heading uses param so no template change needed.

## Rationale

Research write-ups are primary evidence for junior pen-tester credibility and should be scanned before engineering builds; placing writing before projects aligns with evidence-first flow (security-proof → direction → bbo → research → projects) while keeping security-proof as the flagship "Selected Security Work". Removing "Security" from projects title prevents overstating builds (TicketPro/CollabEditor) as security products and keeps neutral "Selected Projects" / "Selected work" kicker.

## Affected Files

- `layouts/index.html`
- `hugo.yaml`
