# ADR: Fix unclosed term-block frame in render-codeblock

- Date: 2026-08-27
- Type: Architectural Decision Record
- Status: accepted
- Tags: bugfix, hugo, render-codeblock, terminal, overflow, html-structure
- Affected files: layouts/_default/_markup/render-codeblock.html

## Decision

Added missing `</div>` closing term-block after the interactive block's `{{- end }}` and before `{{- else -}}` in layouts/_default/_markup/render-codeblock.html (line 49), closing the 6th div for both interactive and non-interactive shell paths. Applied byte-identical fix to both portfolio-infosec and portofolio-dev-new via edit. No CSS change required; verified Hugo builds pass in both repos.

## Rationale

Template opened `<div class="term-block">` at line 31 but closed only 5 of 6 divs (term-bar, term-body, term-console + 2 inner) leaving the outer frame unclosed, so following paragraphs/headings were parsed inside the frame and clipped by `overflow:hidden` (frame overflow over next lines). Single closing div outside the `if $interactive` block but inside the outer `if $isShell` correctly closes the frame for both gdb (non-interactive) and interactive cases while leaving non-shell path untouched.

## Alternatives Considered

Editing blog.css to add overflow-y:visible on .term-block (rejected: HTML unclosed div was root cause; overflow:hidden is intentional for rounded frame clipping and term-body handles internal scroll)

## Affected Files

- `layouts/_default/_markup/render-codeblock.html`
