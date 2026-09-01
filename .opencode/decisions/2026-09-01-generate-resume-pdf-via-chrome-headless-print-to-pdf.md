# ADR: Generate resume PDF via Chrome headless --print-to-pdf

- Date: 2026-09-01
- Type: Architectural Decision Record
- Status: accepted
- Tags: resume, pdf, chrome-headless, hugo, static
- Affected files: resume-source/MahmoudAdel_Cybersecurity_Resume.html, static/MahmoudAdel_Cybersecurity_Resume.pdf, public/MahmoudAdel_Cybersecurity_Resume.pdf

## Decision

Generate resume PDF via google-chrome-stable --headless --disable-gpu --no-sandbox --print-to-pdf-no-header from file:// HTML. Chosen over wkhtmltopdf/weasyprint/puppeteer because Chrome is preinstalled, produces A4 594.96x841.92 pts single-page with embedded 2M avatar, and correctly resolves ../static/images/me-avatar.png relative path without base64 patch. Output to static/MahmoudAdel_Cybersecurity_Resume.pdf (2.5 MB) and verified Hugo copies to public/ via static files.

## Rationale

HTML uses relative ../static/images/me-avatar.png which resolves correctly via file://, but previous LibreOffice PDF was outdated (10 pages/2 pages, missing Worldwide, 101KB). Chrome headless gives 1-page A4, tagged, Skia/PDF m151, contains Mahmoud Adel + Worldwide location string, 2578396 bytes. Hugo --gc --minify then copies static to public preserving PDF integrity (both 2.5M, 1 page A4). Avoids pip/apt installs and keeps SSR fast.

## Alternatives Considered

wkhtmltopdf (not installed, apt heavy), WeasyPrint (no pip available, would need heavy Python deps), Puppeteer via Node (would require npm install puppeteer 150MB+ and download Chromium duplicate). Direct google-chrome-stable --headless --print-to-pdf uses already-installed Chrome 151, no extra deps, native Skia/PDF, supports modern CSS and relative file:// image paths.

## Affected Files

- `resume-source/MahmoudAdel_Cybersecurity_Resume.html`
- `static/MahmoudAdel_Cybersecurity_Resume.pdf`
- `public/MahmoudAdel_Cybersecurity_Resume.pdf`
