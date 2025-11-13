# Repository Guidelines

## Project Structure & Module Organization
Content lives under `_pages` and `_posts` (Markdown with YAML front matter) while shared snippets reside in `_includes` and layouts in `_layouts`. Styles extend Minimal Mistakes via `_sass` and `assets/css`, and custom scripts live in `assets/js`. Data-driven sections (navigation, profiles) pull from `_data/*.yml`. Static resources such as favicons and verification files stay in the repo root; avoid mixing generated `_site` output into version control.

## Build, Test, and Development Commands
Install Ruby gems with `bundle install` and JS tooling with `npm install`. Use `bundle exec jekyll serve --livereload` for local previews, which watches Markdown, HTML, SCSS, and data files. Run `bundle exec jekyll build` before deploying to ensure production parity. Minify and banner scripts with `npm run build:js`; use `npm run watch:js` while iterating on `assets/js`. When assets change, commit the resulting `assets/js/main.min.js` alongside the sources.

## Coding Style & Naming Conventions
Follow Kramdown-flavored Markdown, keeping titles in sentence case and permalinks derived from filenames (e.g., `_posts/2024-05-10-new-feature.md`). Front matter keys should mirror existing posts (`title`, `excerpt`, `categories`, `tags`, `toc`). Prefer two-space indentation in HTML/SCSS and const/let-only JavaScript. Keep SCSS partials prefixed with `_` and snake_case data keys to stay compatible with Liquid includes.

## Testing Guidelines
This site lacks a formal test suite, so rely on runtime checks. Run `bundle exec jekyll doctor` to catch config drift and `bundle exec jekyll build --trace` before pushing to ensure clean generation. Optional link validation can be done via `bundle exec htmlproofer ./_site --disable-external`. Document manual verifications (hero images, navigation) in your PR description.

## Commit & Pull Request Guidelines
Write commits in the imperative mood (`Add hero image`) and group unrelated work separately to keep history clean; glance at `git log --oneline` for local examples. Every PR should summarize user-facing changes, note any config edits (`_config.yml`, `_data/*.yml`), and link related issues. Include before/after screenshots for visual tweaks and confirm local `jekyll build` success. Request review when the branch is rebased on main and checks pass.

## Configuration & Deployment Tips
Keep `_config.yml` authoritative—mirror any per-environment overrides via `_config.dev.yml` if needed and run `bundle exec jekyll serve --config _config.yml,_config.dev.yml`. Secrets (API tokens, Staticman keys) must live outside the repo; reference them via environment variables. Update `staticman.yml` only when coordinating with backend changes, and verify metadata such as `google*.html` files remain untouched to preserve site verification.
