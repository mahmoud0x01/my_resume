# Translation Guide — Russian (ru) i18n

> For future agents adding or maintaining `ru` translations. Keeps the portfolio evidence-first and byte-identical between languages where possible.

## Overview

- Default language: `en` (English, `defaultContentLanguage: en`, `defaultContentLanguageInSubdir: false` → `/` is English).
- Second language: `ru` (Русский, served at `/ru/`).
- i18n source of truth: `i18n/en.yaml` + `i18n/ru.yaml` (Hugo `{{ i18n "key" }}`).
- Per-language site params: `hugo.yaml` → `languages.en.params` / `languages.ru.params` (hero, about, location, SEO).
- Nav language switch: `layouts/partials/sections/header.html` (`nav-lang-switch` pill near theme toggle, `nav-lang-active`/`nav-lang-link` styled in `static/css/recruiter.css`).
- Font: Inter + JetBrains Mono + Space Grotesk via Google Fonts v2 in `layouts/index.html` (`&subset=cyrillic` + `&display=swap`, `unicode-range` handles Cyrillic automatically). `recruiter.css` line-height/font stacks are language-neutral.

## Directory Structure

```
hugo.yaml                 # languages.en / languages.ru (title, params.description, params.hero, etc.)
i18n/
  en.yaml                 # English UI strings (default)
  ru.yaml                 # Russian UI strings (keys mirrored)
layouts/
  index.html              # <head> fonts + Inter Cyrillic comment
  partials/sections/
    header.html           # 6-item nav + nav-lang-switch (i18n keys)
    hero/index.html       # i18n: heroTypewriter, subtitle, etc.
    at-a-glance.html      # i18n: atGlance*
    disclosures.html      # i18n: disclosures*
    credentials.html      # i18n: credentials*
    writing.html          # i18n: writing* + fallback for RU count
    path.html             # i18n: path*
    experience.html       # i18n: experience*
    about.html            # i18n: about*, skills*
    skills-matrix.html
    contact.html          # i18n: contactKicker, contactTitle, contactContent
    footer/index.html
content/
  blogs/
    <slug>.md             # Default (en) writeups — no suffix = en
    # If translated, either:
    #   content/blogs/<slug>.en.md + content/blogs/<slug>.ru.md   (suffix method, preferred)
    #   content/blogs/<slug>.md + content/ru/blogs/<slug>.md      (contentDir method)
    # Do NOT duplicate assets in static/images — keep single /images/*
static/css/
  recruiter.css           # nav-lang-switch pill, Cyrillic-safe line-height comment, :lang(ru) if needed
  design.css              # @import Inter (minor, but index.html is canonical font loader)
.opencode/
  TRANSLATION_GUIDE.md    # this file
```

## What to Translate vs What NOT to Translate

### Translate
- UI chrome: nav labels (`navSecurityFindings`, `navCredentials`…), hero `eyebrow/title/subtitle/typewriter`, section kickers/titles/deks (`disclosuresKicker`, `credentialsTitle`, `writingTitle`, `contactKicker`…), at-a-glance blocks, contact copy, footer notes, `langSwitchLabel`.
- SEO per-language: `languages.ru.params.description`, `keywords`, `location`, `hero.*` in `hugo.yaml`.
- Blog frontmatter `title`, `description`, `summary` (if you create `.ru.md`), and prose paragraphs.

### Do NOT translate (keep English)
- Tool/tech names: Burp Suite, Nmap, Wireshark, BloodHound, ELK, Sigma, YARA, MITRE ATT&CK, Cobalt Strike, Sliver, etc.
- Proper nouns / brands: Verisign, DigitalOcean, Pinterest, Dell, Bugcrowd, Hack The Box, TryHackMe, Bastion Security, Tomsk State University.
- Code blocks, terminal commands, URLs, file paths, env vars: `GET /connect/google`, `state`, `auditd`, `Filebeat`, `unshare -r -m`, `HKCU\...\Run\Updater`, `https://bugcrowd.com/h/mahmoud_adel`.
- Badges, version strings, CVE/CWE IDs, MITRE technique IDs (`T1059.001`), certificate titles (`OSCP (In Progress)` except UI wrapper).
- `hugo.yaml` `params.keywords` tech tokens that are search-intent (keep English tech tokens even in RU keywords, plus RU translations).
- DO translate keywords that are natural language (e.g., `penetration testing` → `тестирование на проникновение` already done) but keep tool acronyms unchanged.

### Rule of thumb
If a reviewer would google it in English — leave it English. If it is a sentence a human reads in UI — translate.

## How to Add a New Writeup

Hugo i18n for content supports two equivalent patterns; **prefer suffix method** to keep images/paths simple.

### Option A — Suffix (preferred)

```bash
content/blogs/my-new-lab.en.md   # en
content/blogs/my-new-lab.ru.md   # ru (copy, translate title/description/body prose, keep code/commands/URLs EN)
```

Both share `slug: my-new-lab` implicitly. Frontmatter must keep same `date`, `tags`, `categories`, `image` ( `/images/my-new-lab.png` ), `toc`.

### Option B — Language contentDir

```bash
content/blogs/my-new-lab.md      # en (default)
content/ru/blogs/my-new-lab.md   # ru
```

Either way, verify:

- `image: /images/...` points to `static/images/...` (single file, not per-language).
- First blockquote for labs stays verbatim (e.g., `> Controlled Lab — Intentional Execution`).
- Keep code fences ` ```powershell`, ` ```bash` unchanged.

### Checklist for new writeup
1. Translate `title`, `description`, prose outside code fences.
2. Do NOT translate `tags` tech tokens? Add RU tag equivalents if needed but keep primary English tags for taxonomy.
3. Set `toc: true` if long.
4. Add image to `static/images/` and reference as `/images/name.png`.
5. Run `hugo --gc --minify` — confirm both `/blogs/my-new-lab/` and `/ru/blogs/my-new-lab/` exist in `public/`.

## How to Add a New Credential / Experience / Skill

### Credential (HR/ATS scan anchor)

1. Update `hugo.yaml` → `courses.items` (global, rendered in credentials partial). Keep order `OSCP → Linux+ → SecurityBlue → IBM CTI → TryHackMe → CCNA → PITR → PNPT`.
2. If credential title needs RU rendering, add i18n keys instead of YAML translation (cert names stay English by rule). Only translate `credentialsKicker/Title/Dek` wrappers in `i18n/ru.yaml`.
3. For `languages.ru.params.hero`/`about` overrides, do **not** duplicate `courses`; it is global and displayed via `i18n` wrappers.

### Skills Matrix

- Tiers live in `hugo.yaml` → `about.toolkitTiers` (CORE/APPLIED/FAMILIAR/ENGINEERING). Tier names `CORE` etc. stay English (badge). Only `description` and wrapper `skillsTitle/Dek/Note` are i18n.
- If adding a tool, keep English name with `(lab)` qualifier where honest, in both languages.

## How to Test

```bash
# Build both languages, minified, GC
hugo --gc --minify

# Expect: 186 pages (or current count) + /ru/ tree
# Check public/ru/index.html exists, no i18n missing warnings

# Dev server with language switch visible
hugo server --bind 0.0.0.0 --port 1313
# Visit:
#   http://localhost:1313/        → EN (lang switch shows EN active | RU link → /ru/)
#   http://localhost:1313/ru/     → RU (RU active | EN link → /)
# Click through disclosures, credentials, writing, experience — no 404.
```

### Automated checks

- `hugo --gc --minify` must exit 0, no `WARN i18n` (missing key) — grep output for `i18n`.
- `hugo` may emit `WARN` for unused translation keys — ok.
- Writing archive count: on `/ru/` the **Featured Research** `Browse all writing — N notes` uses fallback `site.Sites.First.RegularPages` if RU has 0 blogs, so N equals EN count (15). Verify at bottom of `#writing`.
- Contact section on RU shows `Следующий разговор` / `Давайте поговорим о безопасности.` (not English).
- Header nav on RU shows `НАХОДКИ`, `Сертификаты`, `Исследования`, `Опыт`, `Навыки`, `Обо мне`.

### Visual check for Cyrillic rendering

- Inter supports Cyrillic via `unicode-range`; no faux-bold. Check in both light + dark theme:
  - Hero `Махмуд Адель` does not clip, letter-spacing `-0.04em` still legible.
  - Typewriter `Я ломаю вещи — и создаю вещи, которые ломаются.` fits single line desktop, wraps block at `≤480px` (via `recruiter.css` reduced-motion fallback).
  - Disclosures `НАХОДКИ И ПРИЗНАНИЯ` wraps without horizontal scroll at `320px`.
- Toggle theme, resize to `360px`: `nav-lang-switch` hides (to fit 320 cluster), hamburger still 44px, header remains 56px.
- `font-display: swap` already via `&display=swap` — no FOIT.

## Example — Adding i18n keys for a new section

```yaml
# i18n/en.yaml
mySectionKicker: "New Section"
mySectionTitle: "MY NEW SECTION"
mySectionDek: "One-line dek for recruiter scan."

# i18n/ru.yaml
mySectionKicker: "Новый раздел"
mySectionTitle: "МОЙ НОВЫЙ РАЗДЕЛ"
mySectionDek: "Короткий дек для скана."
```

```html
<!-- layouts/partials/sections/my-section.html -->
<p class="section-kicker">{{ i18n "mySectionKicker" | default "New Section" }}</p>
<h2>{{ i18n "mySectionTitle" | default "MY NEW SECTION" }}</h2>
<p class="section-dek">{{ i18n "mySectionDek" | default "One-line dek." }}</p>
```

Add the partial to `layouts/index.html` `{{ define "main" }}` in evidence-first order, bump no cache param needed (Hugo reloads).

## Gotchas

- `defaultContentLanguageInSubdir: false` → EN at `/`, RU at `/ru/`. `relLangURL` preserves language prefix. Do not hardcode `href="/#disclosures"` — use `{{ .Site.BaseURL | relLangURL }}#disclosures` (header already does).
- `{{ i18n "key" | default "Fallback" }}` — keep fallback English so missing RU key does not blank UI.
- `hugo.yaml` RU `languages.ru.params` merges over global `params`; put RU-specific `hero`, `about` there, not in global.
- `content/blogs/*.ru.md` without `.en.md` mate will make RU page orphaned for EN — always ship both.
- Do not commit `public/`; run `hugo --gc --minify` locally only for verification.

## References

- Existing i18n keys: `i18n/en.yaml` (67 lines), `i18n/ru.yaml` (67 lines) — mirror exactly.
- Header lang switch markup: `layouts/partials/sections/header.html:129-155`.
- Lang switch CSS: `static/css/recruiter.css` → `.nav-lang-switch` block (pill, 32px, `focus-visible`, hide at 360).
- Writing fallback: `layouts/partials/sections/writing.html:1-2` (`site.Sites.First.RegularPages`).
- Font: `layouts/index.html:23-24` (`Inter` `subset=cyrillic` + `display=swap`).
