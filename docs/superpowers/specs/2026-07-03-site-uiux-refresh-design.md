# Site UI/UX/IA Refresh — Design

**Date:** 2026-07-03
**Scope:** dongdongbh.tech (Jekyll + Minimal Mistakes 4.24.0 remote theme)
**Approach chosen:** A — Streamlined refresh (blog-first, stay on Minimal Mistakes)

## Goals

The site serves blog readers first. Improve four areas: post discovery,
homepage feed, visual design, and post reading experience — without leaving
the Minimal Mistakes theme or breaking search, comments (giscus), SEO, or
existing URLs.

## Current problems

1. `_pages/home.md` (splash landing page) and `index.html` (blog feed) both
   claim permalink `/`; the feed wins, so the splash is dead code that never
   renders.
2. Visitors land on a bare chronological post list with no introduction;
   the sidebar bio is the placeholder "Hello world!".
3. Navigation is Tags / Notes / CV / About — no Posts or Categories entry,
   and the external Notes link is not marked as external.
4. The `dirt` skin looks dated; there is no dark mode.
5. Config declares unused collections (`tech`, `research`, `docs`).

## Design

### 1. Information architecture & navigation

- Navigation becomes: **Posts · Categories · Tags · Notes ↗ · CV · About**
  - Posts → `/year-archive/` (existing year archive page)
  - Categories → `/categories/` (existing category archive page)
  - Notes keeps its external URL and gains an external-link icon/indicator.
- Delete `_pages/home.md`. The root `/` is served solely by `index.html`
  (layout `home`). No URL changes anywhere else.

### 2. Homepage feed

- Add a short intro strip above the feed in `index.html`: 2–3 sentences
  distilled from the About page (name, handle, RL/NCO → CV/VLM research,
  open-source / Mindwtr) with inline links to CV, GitHub, and Google Scholar.
- Feed entries show title, date, reading time, and excerpt consistently.
- Sidebar author bio replaces "Hello world!" with a real one-liner
  ("RL/NCO → CV/VLM researcher · open-source builder") and adds a Google
  Scholar link to the author profile links.

### 3. Visual design

- Base skin: switch `dirt` → custom skin file
  `_sass/minimal-mistakes/skins/_custom.scss` (set
  `minimal_mistakes_skin: "custom"`), starting from the `air` skin values.
- Typography: keep the system font stack; raise base body size slightly and
  set post-body line-height ≈ 1.7; tighten heading hierarchy.
- One accent color — deep teal (`#0f766e` light mode / `#2dd4bf` dark mode)
  — for links, buttons, masthead hover, replacing the beige/brown palette.
- Auto dark mode: `@media (prefers-color-scheme: dark)` overrides for
  background, text, borders, and code-block syntax colors inside the custom
  skin. giscus `theme` set to `preferred_color_scheme`.
- Feed spacing: more whitespace between entries; muted metadata line.

### 4. Reading experience & config cleanup

- `_config.yml` post defaults gain `toc: true`, `toc_sticky: true`
  (posts can opt out individually; the 22 posts already setting `toc`
  are unaffected).
- Keep default single-column reading width for posts; `classes: wide`
  remains only on pages that need it (e.g., CV).
- Remove unused `tech`/`research`/`docs` collections from `_config.yml`.
- Out of scope: CV page redesign. Open question flagged to owner: the CV
  lists `dli160@syr.edu` — confirm whether it should change. No edit
  without confirmation.

## Error handling / risks

- Skin switch risk: a `custom` skin file must define every variable the
  theme's SCSS expects; start by copying `air` skin contents from the
  theme's 4.24.0 tag so nothing is undefined.
- Dark mode is override-based (media query), so a failure mode is partial
  theming (e.g., code blocks staying light); the verification checklist
  explicitly checks code blocks, tables, and giscus in dark mode.
- Deleting `home.md` cannot break links: it never rendered (the feed wins
  the permalink conflict today).

## Verification

Local `bundle exec jekyll serve`, then check:

1. `/` renders the feed with the intro strip; pagination works.
2. All nav links resolve (Posts, Categories, Tags, Notes, CV, About).
3. Dark mode via emulated `prefers-color-scheme: dark` — body, code blocks,
   tables, sidebar, giscus.
4. A long post (e.g., the RL note) shows a sticky TOC.
5. Search overlay and giscus comments still load.
6. Before/after screenshots for the owner.
