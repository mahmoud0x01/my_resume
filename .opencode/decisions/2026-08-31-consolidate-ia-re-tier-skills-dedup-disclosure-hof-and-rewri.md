# ADR: Consolidate IA: re-tier skills, dedup disclosure/HoF and rewrite experience to authorized-scope narrative

- Date: 2026-08-31
- Type: Architectural Decision Record
- Status: accepted
- Tags: ia, toolkit, disclosure, track-record, experience, deduplication, conservative-tiering
- Affected files: hugo.yaml, layouts/partials/sections/disclosure.html, layouts/partials/sections/track-record.html, layouts/partials/sections/awards.html, static/js/portfolio-graph-data.js, static/css/recruiter.css

## Decision

Re-tiered hugo.yaml toolkitTiers conservatively: CORE now 10 practical strengths (Web/API, Vuln Assessment, Linux, Windows, TCP/IP, PrivEsc lab, Burp, Nmap, Python, Bash) with hands-on reporting description; APPLIED 10 (OWASP, Network Security, AD, Kerberos, Wireshark, BloodHound, Impacket, Docker, SysAdmin, Firewall); FAMILIAR 12 with lab/exposure qualifiers (Ghidra lab, Metasploit lab, Cobalt Strike exposure, Sliver lab, Nuclei lab, SQLMap lab, ffuf lab, MITRE familiar, Malware lab, Threat Intel exposure, Exploit Dev lab, Red Team lab); ENGINEERING 7 (JS, C/C++, Assembly, SQL, Git, Presentation, Problem Solving). Removed focusAreas block (3 cards duplicated BBO) so About now renders only toolkitTiers; flat skills YAML retained but not rendered. Rewrote disclosure.html from chips+list to compact archive: brief explainer with 20+ as secondary stat + 3-card grid (Verisign CSRF $1k Apr2018 with blog+Bugcrowd links, Bugcrowd aggregate 20+ 2018-2019, DigitalOcean critical Apr2019) all linking to external Bugcrowd profile or Verisign blog, not internal #awards. Updated track-record.html timeline links to external Bugcrowd profile/Verisign blog, rewrote Bastion intern card to Role/Context/Responsibilities/Outcomes with authorized-scope, manual validation, Linux/Windows root, documented findings and Top5/100 CTF. Rewrote hugo.yaml experience items (TSU SE and Bastion) to Context/Responsibilities/Outcomes authorized-scope narrative. Tweaked awards.html dek to mark as secondary collection referencing disclosure/track-record and Bugcrowd profile. Updated portfolio-graph-data.js CORE_IDS to websec/vulnassess/linux/windows/tcpip/privesc/burpsuite/nmap/python/bash (removed overclaimed redteam/exploitdev/owasp). Added recruiter.css disclosure-grid/card styles and responsive 3→2→1.

## Rationale

Previously CORE contained senior Exploit Development and Red Team without qualifier, overstating intern level; while FAMILIAR lacked lab markers for Ghidra/Metasploit etc., and Python/Bash were misplaced in ENGINEERING instead of CORE strengths. FocusAreas inside About duplicated the primary Break-Build-Operate section, creating 3-card redundancy. Disclosure was a chip wall duplicating the HoF timeline and awards wall (4-5× repetition across hero proof, security-proof Verisign, timeline 5 entries, disclosure chips/list, awards 6 cards) with internal #awards links that hid external verification. Experience content used fragmented ALL-CAPS headings and lacked what Mahmoud actually did. New tiering keeps 39 skills total but moves overclaimed items to FAMILIAR with (lab)/(exposure) and places Python/Bash/Docker where evidence supports, adding honest descriptions. Disclosure now provides selected evidence cards with org/vuln/reward/date/external link (Bugcrowd profile, Verisign blog) and 20+ as secondary, while awards remains as distinct secondary wall but dek clarifies primacy of external links. Track-record and yaml experience now use authorized-scope, manually validated, documented findings, presented results language preserving Bastion web/network/auth/injection/privesc/Linux/Windows/Top5 facts and TSU UML/SDLC without inflating to security. CSS grid ensures no horizontal scroll and PWA 1fr symmetry; Hugo --gc --minify passes.

## Affected Files

- `hugo.yaml`
- `layouts/partials/sections/disclosure.html`
- `layouts/partials/sections/track-record.html`
- `layouts/partials/sections/awards.html`
- `static/js/portfolio-graph-data.js`
- `static/css/recruiter.css`
