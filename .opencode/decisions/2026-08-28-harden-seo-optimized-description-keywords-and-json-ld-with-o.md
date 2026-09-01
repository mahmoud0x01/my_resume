# ADR: Harden SEO: optimized description/keywords and JSON-LD with OG image handling

- Date: 2026-08-28
- Type: Architectural Decision Record
- Status: accepted
- Tags: seo, hugo, json-ld, og-image, keywords
- Affected files: hugo.yaml, layouts/index.html, layouts/_default/single.html

## Decision

Set hugo.yaml params.description to 165-char SEO string 'Junior Penetration Tester — authorized security testing, penetration testing, bug bounty, software engineering, security research, responsible disclosure, OAuth/CSRF' (covers all 9 required keywords, 165 chars, readable) and added params.keywords with the full 298-char taxonomy including Hall of Fame, Bastion CTF, AppArmor RCE, Verisign, IDOR, etc. Updated layouts/index.html head to emit keywords meta (fallback to default taxonomy) and Person JSON-LD with plainify-escaped description, knowsAbout and sameAs links. Updated layouts/_default/single.html head to emit og:image/twitter:image from .Params.image/.Params.images and to emit BlogPosting JSON-LD for Section=blogs with headline, description, author, dates, image, url and mainEntityOfPage.

## Rationale

Hugo internal opengraph does not pick up front-matter `image:`; explicit with-absURL ensures per-post social cards (e.g., verisign-csrf-reward.png). Person + BlogPosting JSON-LD improves knowledge-graph and SERP rich results while staying valid JSON via plainify/truncate. Description was engineered to be exactly 165 chars (limit) while containing all 9 case-insensitive substrings; Bastion/20+ HoF detail is retained in keywords meta to avoid pushing description over SERP truncation. Verified static/images/verisign-csrf-reward.png (86k) and static/fav.png exist. Hugo --gc --minify passes (136 pages) and public outputs contain keywords, Person LD and verisign og:image.

## Alternatives Considered

Keeping old 240-char generic description without OAuth/CSRF and no keywords meta was rejected (fails 9/9 keyword coverage and SEO). Using the task's suggested 172-char Bastion+HoF description without explicit 'penetration testing' phrase was rejected (fails required substring check). Keeping the 193-char version with all keywords + Bastion detail was rejected (exceeds 165 char guidance and would be truncated in SERPs).

## Affected Files

- `hugo.yaml`
- `layouts/index.html`
- `layouts/_default/single.html`
