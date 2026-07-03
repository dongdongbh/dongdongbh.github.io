# Site UI/UX/IA Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modernize dongdongbh.tech (blog-first): fix the `/` permalink conflict, add nav + homepage intro, replace the dated `dirt` skin with a clean custom light skin + auto dark mode, and improve post reading defaults.

**Architecture:** Jekyll site on the Minimal Mistakes 4.24.0 remote theme, with the theme's SCSS vendored locally in `_sass/`. All visual changes go through a new custom skin file (SCSS variables only) plus CSS appended to `assets/css/main.scss` (polish + dark-mode media query). IA changes touch `_data/navigation.yml`, `index.html`, `_config.yml`, and delete one dead page.

**Tech Stack:** Jekyll 4 / Minimal Mistakes 4.24.0, kramdown, SCSS, giscus comments.

**Spec:** `docs/superpowers/specs/2026-07-03-site-uiux-refresh-design.md`

## Global Constraints

- Do NOT change any post/page URL. The only file deletion is `_pages/home.md`, which never renders (loses the `/` permalink conflict to `index.html`).
- Stay on Minimal Mistakes; do not fork layouts unless a task says so. No layout files are modified in this plan.
- Accent color: `#0f766e` (light mode), `#2dd4bf` (dark mode) — exact values from spec.
- Dark mode is automatic via `@media (prefers-color-scheme: dark)` only; no toggle button.
- Search, giscus comments, Google Analytics, and SEO tags must keep working (verified in Task 7).
- Build/verify command for every task: `bundle exec jekyll build` (output in `_site/`). If `bundle` is missing gems, run `bundle install` once first.
- Commit after every task with the message given in the task.

---

### Task 1: Fix root permalink conflict and rebuild navigation

**Files:**
- Modify: `_data/navigation.yml`
- Delete: `_pages/home.md`
- Verify against: `_site/index.html`

**Interfaces:**
- Produces: nav order **Posts · Categories · Tags · Notes ↗ · CV · About** consumed visually by all pages. `/` is served only by `index.html` (layout `home`).

- [ ] **Step 1: Confirm the build works before changing anything**

Run: `bundle exec jekyll build 2>&1 | tail -3`
Expected: `done in X seconds.` (if gems missing: run `bundle install`, then retry)

- [ ] **Step 2: Replace `_data/navigation.yml` main list**

Replace the whole file content with:

```yaml
# main links
main:
  - title: "Posts"
    url: /year-archive/
  - title: "Categories"
    url: /categories/
  - title: "Tags"
    url: /tags/
  - title: "Notes ↗"
    url: https://dongdongbh.github.io/note/
    description: "External notes site"
  - title: "CV"
    url: /cv/
  - title: "About"
    url: /About/
```

(Note: `masthead.html` passes `link.url` through `relative_url`, which leaves absolute URLs untouched, so the external Notes link is safe.)

- [ ] **Step 3: Delete the dead splash page**

Run: `git rm _pages/home.md`

- [ ] **Step 4: Build and verify**

Run: `bundle exec jekyll build 2>&1 | tail -1 && grep -o 'layout--home' _site/index.html && grep -c 'masthead__menu-item' _site/index.html`
Expected: build `done`, `layout--home` printed (feed still owns `/`), menu-item count `6`.

- [ ] **Step 5: Verify year-archive and categories pages exist in output**

Run: `ls _site/year-archive/index.html _site/categories/index.html _site/tags/index.html`
Expected: all three paths listed, no error.

- [ ] **Step 6: Commit**

```bash
git add -A _data/navigation.yml _pages/home.md
git commit -m "IA: full nav (Posts/Categories/Tags/Notes/CV/About), remove dead splash home"
```

---

### Task 2: Homepage intro strip, feed dates, sidebar bio + Scholar link

**Files:**
- Modify: `index.html`
- Modify: `_config.yml` (author `bio`, author `links`, posts defaults `show_date`)
- Verify against: `_site/index.html`

**Interfaces:**
- Produces: `.home-intro` and `.home-intro__links` CSS classes styled later by Task 4. Do not rename them.

- [ ] **Step 1: Rewrite `index.html`**

Replace the whole file content with:

```html
---
layout: home
author_profile: true
---

<div class="home-intro">
  <p>
    Hi, I'm <strong>Dongda Li</strong> (<a href="https://github.com/dongdongbh">dongdongbh</a>).
    I do research on reinforcement learning and neural combinatorial optimization,
    and these days computer vision and vision-language models. I like hacking on
    open-source software — I'm the creator of
    <a href="https://github.com/dongdongbh/Mindwtr">Mindwtr</a>.
  </p>
  <p class="home-intro__links">
    <a href="{{ '/cv/' | relative_url }}" class="btn btn--primary"><i class="fas fa-id-card"></i> CV</a>
    <a href="https://github.com/dongdongbh" class="btn btn--inverse"><i class="fab fa-github"></i> GitHub</a>
    <a href="https://scholar.google.com/citations?user=rIFpsA0AAAAJ" class="btn btn--inverse"><i class="fas fa-graduation-cap"></i> Google Scholar</a>
  </p>
</div>
```

(The `home` layout renders this content above the "Recent posts" heading.)

- [ ] **Step 2: Update the author block in `_config.yml`**

Change `bio` and add `links` under `author:` (keep every other author key as-is):

```yaml
author:
  name             : "Dongda Li"
  avatar           :  "/assets/images/bio-photo.jpg"
  bio              : "RL/NCO → CV & VLM researcher · open-source builder"
  location         : "NY, US"
  email            : "dongdongbhbh@gmail.com"
  links:
    - label: "Google Scholar"
      icon: "fas fa-fw fa-graduation-cap"
      url: "https://scholar.google.com/citations?user=rIFpsA0AAAAJ"
```

(`author.links` is additive in this theme version — Email and GitHub entries keep rendering from their own keys.)

- [ ] **Step 3: Add `show_date` to posts defaults in `_config.yml`**

In `defaults:` → the `type: posts` scope's `values:`, add one line:

```yaml
      show_date: true
```

- [ ] **Step 4: Build and verify**

Run: `bundle exec jekyll build 2>&1 | tail -1 && grep -c 'home-intro' _site/index.html && grep -o 'RL/NCO' _site/index.html | head -1 && grep -c 'fa-calendar-alt' _site/index.html`
Expected: build `done`; `home-intro` count ≥ 2; `RL/NCO` printed; calendar-icon count ≥ 10 (dates on feed entries).

- [ ] **Step 5: Commit**

```bash
git add index.html _config.yml
git commit -m "Homepage: intro strip with CV/GitHub/Scholar links, feed dates, real sidebar bio"
```

---

### Task 3: Custom light skin (teal accent)

**Files:**
- Create: `_sass/minimal-mistakes/skins/_custom.scss`
- Modify: `_config.yml:14` (`minimal_mistakes_skin`)
- Verify against: `_site/assets/css/main.css`

**Interfaces:**
- Produces: compiled theme colors. Task 4/5 CSS assumes light background `#ffffff`, text `#1a202c`, accent `#0f766e`.

- [ ] **Step 1: Create `_sass/minimal-mistakes/skins/_custom.scss`**

```scss
/* ==========================================================================
   Custom skin — clean light, teal accent
   ========================================================================== */

/* Colors */
$background-color: #ffffff !default;
$text-color: #1a202c !default;
$muted-text-color: #6b7280 !default;
$primary-color: #0f766e !default;
$border-color: #e5e7eb !default;
$code-background-color: #f6f8fa !default;
$code-background-color-dark: #eef2f6 !default;
$form-background-color: #f9fafb !default;
$footer-background-color: #f9fafb !default;
$link-color: #0f766e !default;
$link-color-hover: mix(#000, $link-color, 25%) !default;
$link-color-visited: $link-color !default;
$masthead-link-color: $text-color !default;
$masthead-link-color-hover: $link-color !default;
$navicon-link-color-hover: mix(#fff, $text-color, 85%) !default;
```

- [ ] **Step 2: Switch the skin in `_config.yml`**

Change:

```yaml
minimal_mistakes_skin    : "dirt" # "air", "aqua", "contrast", "dark", "dirt", "neon", "mint", "plum", "sunrise"
```

to:

```yaml
minimal_mistakes_skin    : "custom" # custom light skin, see _sass/minimal-mistakes/skins/_custom.scss
```

- [ ] **Step 3: Build and verify compiled colors**

Run: `bundle exec jekyll build 2>&1 | tail -1 && grep -c '0f766e' _site/assets/css/main.css; grep -c 'e9dcbe' _site/assets/css/main.css`
Expected: build `done`; first count ≥ 5 (teal present); second count `0` (dirt's beige `#e9dcbe` gone — note `grep -c` exits 1 on zero matches, hence the `;`).

(Dirt also defined a custom base16 syntax palette; the custom skin intentionally omits `$base00`–`$base0f`, falling back to the theme's default light syntax colors.)

- [ ] **Step 4: Commit**

```bash
git add _sass/minimal-mistakes/skins/_custom.scss _config.yml
git commit -m "Design: custom clean-light skin with teal accent, replacing dirt"
```

---

### Task 4: Modern polish CSS (cards, masthead, rhythm)

**Files:**
- Modify: `assets/css/main.scss` (append after existing content)
- Verify against: `_site/assets/css/main.css`

**Interfaces:**
- Consumes: `.home-intro` / `.home-intro__links` markup from Task 2.
- Produces: class-level styling only; no markup changes.

- [ ] **Step 1: Append polish CSS to `assets/css/main.scss`**

Append at the end of the file:

```scss
/* ==========================================================================
   Modern polish (2026 refresh)
   ========================================================================== */

/* Slimmer, airier masthead */
.masthead {
  border-bottom: 1px solid #e5e7eb;
}
.masthead__inner-wrap {
  padding: 0.6em 1em;
}
.site-title {
  font-weight: 700;
  letter-spacing: -0.01em;
}

/* Homepage intro strip */
.home-intro {
  margin: 0.5em 0 1.5em;
  padding-bottom: 1.5em;
  border-bottom: 1px solid #e5e7eb;
}
.home-intro p {
  font-size: 1.05em;
  line-height: 1.7;
  max-width: 46em;
}
.home-intro__links .btn {
  margin-right: 0.5em;
  margin-bottom: 0.5em;
  border-radius: 8px;
}

/* Feed entries as soft cards */
.list__item .archive__item {
  padding: 1em 1.25em;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  margin-bottom: 1.25em;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.list__item .archive__item:hover {
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);
}
.archive__item-title {
  margin-top: 0;
  letter-spacing: -0.01em;
}
.archive__item-title a {
  text-decoration: none;
}
.archive__item-excerpt {
  color: #6b7280;
}
.page__meta {
  color: #9ca3af;
  font-size: 0.75em;
}

/* Reading rhythm on posts */
.page__content {
  line-height: 1.7;
}
.page__content p,
.page__content li {
  font-size: 0.95em;
}
.page__content h2 {
  padding-bottom: 0.3em;
  border-bottom: 1px solid #e5e7eb;
}

/* Softer corners everywhere */
.page__content pre,
.page__content img,
.notice,
.notice--primary,
.notice--info,
.notice--warning,
.notice--success,
.notice--danger {
  border-radius: 8px;
}
```

- [ ] **Step 2: Build and verify**

Run: `bundle exec jekyll build 2>&1 | tail -1 && grep -c 'home-intro' _site/assets/css/main.css && grep -c 'border-radius:10px' _site/assets/css/main.css`
Expected: build `done`; both counts ≥ 1 (compressed CSS drops spaces).

- [ ] **Step 3: Commit**

```bash
git add assets/css/main.scss
git commit -m "Design: modern polish — card feed entries, slim masthead, reading rhythm"
```

---

### Task 5: Automatic dark mode

**Files:**
- Modify: `assets/css/main.scss` (append after Task 4 block)
- Modify: `_config.yml` (giscus `theme`)
- Verify against: `_site/assets/css/main.css`

**Interfaces:**
- Consumes: light-mode values from Task 3/4.
- Produces: dark palette — background `#111827`, surface `#1f2937`, text `#d1d5db`, accent `#2dd4bf`.

- [ ] **Step 1: Append the dark-mode block to `assets/css/main.scss`**

Append at the end of the file:

```scss
/* ==========================================================================
   Automatic dark mode (follows system preference)
   ========================================================================== */

@media (prefers-color-scheme: dark) {
  html,
  body {
    background-color: #111827;
    color: #d1d5db;
  }

  h1, h2, h3, h4, h5, h6,
  .page__title,
  .archive__item-title,
  .site-title,
  .author__name {
    color: #f3f4f6;
  }

  a { color: #2dd4bf; }
  a:hover { color: #5eead4; }

  /* Masthead + nav */
  .masthead {
    background-color: #111827;
    border-bottom-color: #1f2937;
  }
  .masthead a,
  .greedy-nav,
  .greedy-nav a,
  .greedy-nav .visible-links a:before {
    background-color: #111827;
    color: #d1d5db;
  }
  .greedy-nav a:hover { color: #2dd4bf; }
  .greedy-nav .hidden-links {
    background-color: #1f2937;
    border-color: #374151;
  }
  .greedy-nav .hidden-links a { background-color: #1f2937; }
  .greedy-nav .hidden-links:before { border-color: transparent transparent #1f2937 transparent; }

  /* Sidebar / author profile */
  .author__bio,
  .author__urls-wrapper button,
  .sidebar,
  .sidebar p,
  .sidebar li {
    color: #9ca3af;
  }
  .author__urls {
    background-color: #1f2937;
    border-color: #374151;
  }
  .author__urls:before { border-color: transparent transparent #374151 transparent; }
  .author__urls:after { border-color: transparent transparent #1f2937 transparent; }
  .author__urls a { color: #d1d5db; }

  /* Feed cards, borders, meta */
  .home-intro { border-bottom-color: #1f2937; }
  .list__item .archive__item {
    border-color: #1f2937;
    background-color: #151d2b;
  }
  .list__item .archive__item:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.45);
  }
  .archive__item-excerpt,
  .page__meta,
  .archive__subtitle {
    color: #9ca3af;
  }
  .archive__subtitle { border-bottom-color: #1f2937; }
  .page__content h2 { border-bottom-color: #1f2937; }

  /* Code blocks */
  .page__content pre,
  .highlight,
  .highlighter-rouge .highlight,
  code.highlighter-rouge,
  .page__content code {
    background-color: #1f2937;
    color: #e5e7eb;
  }
  .highlight .c, .highlight .c1, .highlight .cm { color: #8b949e; } /* comments */
  .highlight .k, .highlight .kd, .highlight .kn { color: #ff7b72; } /* keywords */
  .highlight .s, .highlight .s1, .highlight .s2 { color: #a5d6ff; } /* strings */
  .highlight .nf, .highlight .nx { color: #d2a8ff; }                /* functions */
  .highlight .mi, .highlight .mf { color: #79c0ff; }                /* numbers */

  /* Tables */
  .page__content table {
    background-color: #151d2b;
    border-color: #374151;
  }
  .page__content th { background-color: #1f2937; }
  .page__content td { border-color: #374151; }

  /* Notices */
  .notice,
  .notice--primary,
  .notice--info,
  .notice--warning,
  .notice--success,
  .notice--danger {
    background-color: #1f2937 !important;
    color: #d1d5db !important;
  }

  /* Footer, search, TOC, pagination */
  .page__footer {
    background-color: #0d1320;
    color: #9ca3af;
  }
  .page__footer footer { color: #9ca3af; }
  .search-content { background-color: #111827; }
  .search-content .search-input {
    background-color: #111827;
    color: #e5e7eb;
  }
  .toc {
    background-color: #151d2b;
    border-color: #1f2937;
  }
  .toc .nav__title { background-color: #0f766e; }
  .toc .toc__menu a {
    color: #9ca3af;
    border-bottom-color: #1f2937;
  }
  .pagination--pager {
    color: #d1d5db;
    border-color: #374151;
  }
}
```

- [ ] **Step 2: Point giscus at the system theme in `_config.yml`**

Change (under `comments: giscus:`):

```yaml
    theme                : "light" # "light" (default), "dark", "dark_dimmed", "transparent_dark", "preferred_color_scheme"
```

to:

```yaml
    theme                : "preferred_color_scheme" # follows the reader's system light/dark preference
```

- [ ] **Step 3: Build and verify**

Run: `bundle exec jekyll build 2>&1 | tail -1 && grep -c 'prefers-color-scheme' _site/assets/css/main.css && grep -rl 'preferred_color_scheme' _site/ | head -2`
Expected: build `done`; count ≥ 1; at least one post HTML file listed (giscus script carries the theme).

- [ ] **Step 4: Commit**

```bash
git add assets/css/main.scss _config.yml
git commit -m "Design: automatic dark mode via prefers-color-scheme, giscus follows system theme"
```

---

### Task 6: Reading defaults + config cleanup + CV emails

**Files:**
- Modify: `_config.yml` (posts defaults, remove collections block)
- Modify: `_pages/cv.md:16`
- Verify against: `_site/` output

**Interfaces:**
- Consumes: nothing from other tasks. Produces: no new names.

- [ ] **Step 1: Add TOC defaults for posts in `_config.yml`**

In `defaults:` → the `type: posts` scope's `values:`, add:

```yaml
      toc: true
      toc_sticky: true
```

(Posts that already set `toc`/`toc_label` keep their own values; front matter wins over defaults.)

- [ ] **Step 2: Remove the unused collections block from `_config.yml`**

Delete these lines (there are no `_tech`/`_research`/`_docs` content folders; note `docs/` is already in `exclude`, so plan/spec files stay unpublished either way):

```yaml
# Collections
collections:
  tech:
    output: true
    permalink: /:collection/:path/
  research:
    output: true
    permalink: /:collection/:path/
  docs:
    output: true
    permalink: /:collection/:path/
```

- [ ] **Step 3: List both emails on the CV**

In `_pages/cv.md` change line 16:

```markdown
__E-mail:__ <dli160@syr.edu><br>
```

to:

```markdown
__E-mail:__ <dli160@syr.edu> / <dongdongbhbh@gmail.com><br>
```

- [ ] **Step 4: Build and verify**

Run: `bundle exec jekyll build 2>&1 | tail -1 && grep -c 'toc__menu' _site/rl/RL-note/index.html 2>/dev/null || grep -rc 'toc__menu' _site/$(ls _site | head -5) 2>/dev/null | head; grep -c 'dongdongbhbh@gmail.com' _site/cv/index.html`
Expected: build `done`; a TOC appears in post output; gmail count ≥ 1 on CV page. (If the RL-note path differs, find it with `grep -rl 'UBC' _site --include=index.html | head -1` and grep that file for `toc__menu`.)

- [ ] **Step 5: Commit**

```bash
git add _config.yml _pages/cv.md
git commit -m "Posts: sticky TOC by default; config: drop unused collections; CV: list both emails"
```

---

### Task 7: End-to-end verification

**Files:**
- No source changes (fixes only if a check fails).

- [ ] **Step 1: Serve the site locally**

Run: `bundle exec jekyll serve --port 4000 --detach` (or in background)
Expected: `Server address: http://127.0.0.1:4000`

- [ ] **Step 2: Walk the checklist against http://127.0.0.1:4000**

Use curl/grep (or a browser screenshot tool if available):

1. `/` → feed renders with `.home-intro`, six nav items, dated entries with excerpts.
2. `/year-archive/`, `/categories/`, `/tags/`, `/cv/`, `/About/` all return 200 with content.
3. `curl -s http://127.0.0.1:4000/assets/css/main.css | grep -c prefers-color-scheme` ≥ 1.
4. A long post (find via `grep -rl 'toc__menu' _site | head -1`) contains the TOC markup.
5. Search overlay markup present: `grep -c 'search__toggle' _site/index.html` ≥ 1.
6. giscus script present on a post with `preferred_color_scheme`.
7. If a screenshot tool is available: capture `/` in light and dark (emulate `prefers-color-scheme: dark`) for the owner; otherwise note that visual dark-mode QA falls to the owner.

- [ ] **Step 3: Kill the server**

Run: `pkill -f "jekyll serve" || true`

- [ ] **Step 4: Report**

Summarize checklist results to the owner; do NOT push — the owner decides when to deploy (site auto-deploys from master on GitHub Pages).
