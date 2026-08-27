# Portfolio Graph — UI/UX Refactor Notes

> Hand-off documentation for any future agent working on the interactive
> portfolio constellation graph (`/static/js/portfolio-graph*.js`,
> `/static/css/portfolio-graph.css`, `/layouts/partials/sections/hero/index.html`).
>
> Last updated: 2026-08-07

The site is a **Hugo** build using the `hugo-profile` theme (submodule at
`themes/hugo-profile`). The hero is a custom interactive "constellation"
graph rendered with vanilla JS + SVG; it is **not** part of the theme.

---

## 1. Architecture

| File | Responsibility |
|------|----------------|
| `static/js/portfolio-graph-data.js` | Data model: nodes, tree edges, relationship edges, color palettes. Exposes global `PORTFOLIO_DATA`. |
| `static/js/portfolio-graph.js` | Layout engine (force-directed + radial tree), DOM/SVG rendering, hover highlighting, list-view builder, navbar toggle. |
| `static/js/portfolio-panel.js` | Slide-out detail panel on node click. |
| `static/css/portfolio-graph.css` | All graph styling, layering, list view, CTA, etc. |
| `layouts/partials/sections/hero/index.html` | Markup: `#portfolio-constellation` container, `#portfolio-list-view`, vertical badge. |
| `layouts/index.html` | `<head>`: loads Inter + JetBrains Mono, CSS, GSAP. |
| `hugo.yaml` (`customScripts`) | Injects the three JS files at end of `<body>`. Also sets the page `title`. |

Scripts load order matters: `portfolio-graph-data.js` → `portfolio-panel.js`
→ `portfolio-graph.js`. `PORTFOLIO_DATA` must exist before the graph script runs.

---

## 2. Data Model (hierarchical tree)

The graph is a **3-tier radial tree**, not a flat web:

```
me  ──►  category (5 main topics)  ──►  subgroup (12 branches)  ──►  leaf (skills / awards / roles / certs / courses / blogs)
```

- **Categories (tier 1):** `cat-security`, `cat-development`, `cat-infrastructure`,
  `cat-experience`, `cat-recognition`.
- **Subgroups (tier 2):** e.g. `sg-offsec`, `sg-defsec`, `sg-netsec`, `sg-langs`,
  `sg-sectools`, `sg-work`, `sg-awards`, …
- **Leaves (tier 3):** the real items (skills, awards, etc.).

Every node carries:
- `group` — one of the 5 coarse categories (used for color + list grouping).
- `cluster` — layout anchor id (category/subgroup id for tiers 1–2, parent
  subgroup id for leaves). **This drives initial + gravity positioning.**
- `parent` — tree parent id (used for path tracing on hover).

### Edge types
| Type | Connects | In physics? |
|------|----------|-------------|
| `me-cat` | me → category | yes |
| `cat-sub` | category → subgroup | yes |
| `sub-leaf` | subgroup → leaf | yes |
| `rel` | skill↔skill, skill↔blog, award/exp/course/cert↔skill | **no** (hover-only) |

`rel` edges are excluded from the force/spring loops so they **do not disturb
the clean tree layout** — they only exist for hover highlighting and are drawn
at very low opacity (`0.07`) by default.

---

## 3. Color System

Two palettes live in `portfolio-graph-data.js`:

- `CAT_COLORS` — fine-grained (legacy, used by the detail panel).
- `GROUP_COLORS` — the **5-category** prototype palette (red/blue/green/yellow/purple).
  Mapped from `cat` → `group` via `GROUP_MAP`.

```js
security:       #ff4655   // red
development:    #58a6ff   // blue
infrastructure: #3fb950   // green
experience:     #d29922   // yellow
recognition:    #bc8cff   // purple
```

Edge color is stored per-edge as the CSS var `--edge-color` (child node's group
color) and consumed by `.constellation-edge--active`.

---

## 4. Layering (z-index contract)

```
SVG lines : z-index 1
Nodes/labels : z-index 5   (.constellation-nodes / .cnode)
Center profile (me) : z-index 10
Radial mask (::before of .cnode--me) : z-index -1   ← behind text, above SVG
```

**Important bug-fix:** the radial mask `.cnode--me::before` MUST use
`z-index: -1`. With `z-index: 0` it painted *over* the static centered text and
hid the name/subtitle/CTA. Negative z-index keeps it behind the typography
while still above the SVG lines (because the whole `.cnode--me` context is
`z-index:10`).

---

## 5. Hover Behavior (`highlightNode`)

On hover of node `id`:
1. `getPath(id)` walks `parent` up to `me` → **ancestor path** (element →
   subgroup → category → me). For `me`, it lights the hub + all categories.
2. The node's **direct relationships** (`edgeLookup[id]`, i.e. all `rel` edges
   touching it) are also added, so related items shine (e.g. hovering
   *Burp Suite* also lights *Vuln Assessment* and its connecting edge).
3. Everything not in the lit set gets `.cnode--dimmed` / `.constellation-edge--dimmed`
   (opacity `0.15`). Lit edges get `.constellation-edge--active` (opacity 1,
   `stroke-width: 3`, `--edge-color`).

Lit nodes = `pathNodes ∪ neighbors(id)`; lit edges = ancestor edges ∪ edges
touching `id`.

---

## 6. Escape Hatch (List View)

- Navbar button `#graph-list-toggle` toggles `body.portfolio-list-mode`.
- `#portfolio-list-view` is populated by `buildListView()` from `PORTFOLIO_DATA`,
  grouped by the 5 categories (categories/subgroups excluded).
- **Mobile (<768px)** defaults to list view via a resize/load check.

---

## 7. Centered Typography (prototype style)

Inside the me node (`graph.js` builds it dynamically):
- `.cnode-me-name` — `2rem` JetBrains Mono, `-1px` tracking.
- `.cnode-me-subtitle` — red `#ff4655`, uppercase, `1px` tracking
  ("CYBERSECURITY ENGINEER | PENETRATION TESTER").
- `.cnode-cta` (class also `hire-me-btn`) — red-outline button, fills red on
  hover. Overrides the legacy purple `.hire-me-btn` gradient via the more
  specific `.cnode--me .cnode-cta` selector. Opens `.hire-me-popup` (contact links).

The left-side `#1 VISITOR` block was replaced with a subtle vertical
`// CYBERSECURITY_PORTFOLIO` badge (`.vertical-badge`).

---

## 8. Radial Mask

`.cnode--me::before` is a `480px` radial gradient (`var(--bg)` 30% → transparent
70%) centered on the me node. It hides the inner ends of lines near the face.
Uses `var(--bg)` (theme variable) so it works in both light/dark themes.

---

## 9. Blog Posts Enhanced

`content/blogs/secure-malware-analysis-with-docker.md` and
`content/blogs/hardening-linux-servers-production-checklist.md` were upgraded
with realistic, engagement-style command/output evidence (gdb disassembly,
strace, YARA, tcpdump, `sshd -T`, Lynis, ssh-audit, auditctl, rkhunter). All
sample IOCs use documentation ranges (`198.51.100.0/24`, `example.com`). Keep
markdown fenced code blocks (language-tagged) — the theme already highlights them.

---

## 10. Gotchas for Future Agents

- **Edit `hugo.yaml` carefully.** It uses **CRLF** line endings. Editing with
  tools that normalize to LF can drop indentation and break YAML (seen once on
  the `params:` block). Verify with `hugo` after editing.
- Keep `rel` edges out of the physics loops (search for `if (e.type === 'rel') return;`
  in both attraction sections) or the tree layout collapses into a web.
- Node `cluster` must be set for every node or it falls back to `CLUSTERS.me`
  and stacks on the center.
- The detail panel (`portfolio-panel.js`) only knows node types: `me, skill,
  project, experience, education, course, certificate, award, category,
  subgroup`. Add a branch there for any new type or clicks open an empty panel.
- GSAP entrance animation targets node-type groups; new types won't animate
  unless added to the GSAP block (non-fatal).
- `getCatColor()` and `GROUP_COLORS` are defined at the top of the IIFE
  (before the list-view builder runs). Do not move the data/helper setup below
  the list-view code or it throws at runtime.

---

## 11. How to Preview

```bash
# local server (Hugo extended)
hugo server -D --bind 0.0.0.0 --port 1313
```
