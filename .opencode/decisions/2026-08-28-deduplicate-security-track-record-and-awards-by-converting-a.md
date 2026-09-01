# ADR: Deduplicate SECURITY TRACK RECORD and Awards by converting Awards to compact wall

- Date: 2026-08-28
- Type: Architectural Decision Record
- Status: accepted
- Tags: awards, track-record, deduplication, recruiter, hugo, css, timeline
- Affected files: layouts/partials/sections/awards.html, static/css/recruiter.css

## Decision

Kept SECURITY TRACK RECORD (layouts/partials/sections/track-record.html) as primary 7-item chronological timeline (evidence-first). Rewrote layouts/partials/sections/awards.html from duplicate experience-timeline (35 lines, 6 HoF items) to distinct recruiter-section recruiter-awards grid wall: recruiter-container + kicker/dek note acknowledging same findings as track-record, awards-grid with 3-col responsive cards, award-card--featured for Bastion (Top5), badge/date/h3/p per item plus footer note linking to #track-record and Bugcrowd profile. Added dedicated CSS to static/css/recruiter.css for .recruiter-awards/.awards-grid/.award-card/.award-card--featured/.award-card-badge/.award-card-date/.awards-note with hover/featured states using color-mix(var(--recruiter-accent), --recruiter-border) and recruiter tokens; integrated .awards-grid into existing 991px (2-col) and 767px (1-col) breakpoints.

## Rationale

Both sections rendered essentially the same HoF items (Bugcrowd/Pinterest/Verisign/Dell/DigitalOcean/Bastion) as timelines, causing visual duplication despite different positions in index (track-record near top, awards near bottom) and alongside disclosure chips. Keeping both timelines was redundant. Track-record is semantically the progression narrative and is evidence-first with 7 items (including Bastion internship), while awards at bottom is meant as recognition wall. Converting awards to a compact card grid (not timeline) preserves all 6 recognitions without repeating the timeline visual language, creates clear 1-vs-2 distinction (timeline = chronology, wall = collection), emphasizes Bastion via featured border/shadow, and retains navigation via cross-links (track-record → #awards still valid, new wall → #track-record). Reused recruiter.css tokens (--recruiter-bg/surface/ink/muted/border/accent, --recruiter-radius/shadow) to stay theme-aware and glass-consistent.

## Alternatives Considered

["Remove awards partial entirely via enable:false or comment-out in layouts/index.html — rejected: loses dedicated Hall of Fame wall and breaks expected 6-item awards data; conversion preserves evidence with distinct visual language.", "Filter awards to only items not in track-record — rejected: leaves wall artificially sparse and hides intentional Bastion feature; spec prefers keep same 6 but render differently.", "Keep both timelines and just rename awards — rejected: visual duplication remains, timeline styling identical (timeline-dot/line/card)."]

## Affected Files

- `layouts/partials/sections/awards.html`
- `static/css/recruiter.css`
