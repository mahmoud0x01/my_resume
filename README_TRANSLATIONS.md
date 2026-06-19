# Translation Maintenance Guide for AI Agents

This file explains how translation is implemented in this repo and what must be updated when new portfolio sections, blog posts, or list pages are added.

## Translation entry points

- `static/js/translate.js`
  - Main RU/EN translation logic.
  - Contains homepage translations, blog list translations, and single-post translations.
- `layouts/index.html`
  - Homepage template.
  - Must include `design.css` and `translate.js`.
- `layouts/_default/list.html`
  - List pages template.
  - Covers pages like `/blogs/`, `/tags/`, `/categories/`.
  - Must include `design.css` and `translate.js`.
- `layouts/_default/single.html`
  - Single post template.
  - Must include `design.css` and `translate.js`.

## How translation works

The language switcher is JavaScript-based.

Main parts inside `static/js/translate.js`:

- `HOME`
  - Selector-based translations for homepage sections.
  - Used for navbar, hero, about, experience, education, courses, certifications, footer.
- `SHARED`
  - Nav/footer translations reused on non-home pages.
- `BLOG_LIST`
  - List page translations like `Blogs` and `Read`.
- `SINGLE_PAGES`
  - Object keyed by blog post slug.
  - Each entry typically has:
    - `title`
    - `pairs` = array of `[englishText, russianText]`
- Language persistence is stored in `localStorage` under:
  - `site-lang`

## When adding a new homepage section

If a new section is added to the homepage:

1. Add/update the section partial.
2. Give the section stable selectors.
   - Prefer IDs like `#new-section`
   - Prefer classes like `.section-title`, `.section-description`
3. Open `static/js/translate.js`
4. Add selector-based entries to `HOME`

Example:

```js
{ sel: '#new-section h3', ru: 'Новый раздел' },
{ sel: '#new-section .section-description', ru: 'Русский текст...' },
```

## When adding a new nav/footer item

Update both homepage and shared translations when relevant.

Usually update:

- `HOME`
- `SHARED`

Example:

```js
{ sel: 'a.nav-page-link[href$="#new-section"]', ru: 'Новый раздел' },
{ sel: '.footer-col:nth-child(1) a[href="#new-section"]', ru: 'Новый раздел' },
```

## When adding a new blog post

If a new blog post should translate on single pages:

1. Determine the final slug from the URL.
   - Example:
     - `/blogs/my-new-post/`
     - slug = `my-new-post`
2. Open `static/js/translate.js`
3. Add a new entry to `SINGLE_PAGES`

Example:

```js
SINGLE_PAGES['my-new-post'] = {
  title: 'Мой новый пост',
  pairs: [
    ['Introduction', 'Введение'],
    ['Overview', 'Обзор'],
    ['Conclusion', 'Заключение'],
  ]
};
```

## Critical rule for blog-post translations

Do not guess strings.
Use the exact rendered English text from the generated HTML.

Safe workflow:

1. Run Hugo locally
2. Open the exact blog post page
3. Inspect rendered headings/content in HTML
4. Copy exact heading/body strings into `pairs`

This is important because rendered HTML can differ from markdown source:

- `&` may become `&amp;`
- headings may be normalized
- TOC labels use rendered heading text

## Single-post translation behavior

For single blog pages, the script does all of the following:

- translates nav/footer via `SHARED`
- translates post title via `title`
- translates article body via `pairs`
- translates heading elements directly as a fallback
- translates Table of Contents links using the same dictionary
- translates sidebar labels such as TOC and Tags

So when a new post is added, the main thing to maintain is its `SINGLE_PAGES[slug]` entry.

## When adding or changing list pages

`layouts/_default/list.html` is used for:

- `/blogs/`
- `/tags/`
- `/categories/`
- paginated list pages

If list-page wording changes, update `BLOG_LIST` and possibly `SHARED`.

Examples:

```js
{ sel: '#list-page h2', ru: 'Блог' },
{ sel: '.btn-outline-info', ru: 'Читать' },
```

## If a blog post translation does not work

Check these items in order:

1. `translate.js` is included in `layouts/_default/single.html`
2. The slug in `SINGLE_PAGES` matches the actual URL slug
3. The English source text in `pairs` exactly matches rendered HTML text
4. `list.html` and `single.html` still include cache-busting query params
5. Browser cache was bypassed with hard refresh
6. TOC text is based on rendered headings, not markdown source

## If homepage translation does not work

Check:

1. Selector in `HOME` matches actual rendered DOM
2. Section is actually enabled in `hugo.yaml`
3. The corresponding partial is the one Hugo is rendering
4. `translate.js` is included in `layouts/index.html`

## Template requirements

Do not remove these includes:

Homepage (`layouts/index.html`):

- `design.css`
- `translate.js`

List pages (`layouts/_default/list.html`):

- `design.css`
- `translate.js`

Single pages (`layouts/_default/single.html`):

- `design.css`
- `translate.js`

## Deployment notes

After any translation change:

1. Build the site
2. Deploy the `public/` output
3. Hard refresh browser (`Ctrl+Shift+R`)

## Editing rules for future agents

- Prefer stable selectors over fragile position-based selectors.
- If positional selectors are necessary, verify against rendered HTML.
- Keep `SINGLE_PAGES` keys aligned exactly with post slugs.
- When blog content or section labels change, update `translate.js` immediately.
- If a section is redesigned, re-test all selectors in `HOME`, `SHARED`, and `BLOG_LIST`.
