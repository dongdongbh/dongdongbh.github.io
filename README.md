# dongdongbh.github.io

Source for [https://dongdongbh.tech](https://dongdongbh.tech), a Jekyll site built on the Minimal Mistakes theme. The repo contains the Markdown content, data files, and configuration that feed both the local preview server and the production build triggered from AWS Lightsail.

## Tech stack
- **Jekyll 3.10** with Ruby/Bundler 2.3.x
- **Minimal Mistakes 4.24.0** as a remote theme
- MathJax for rendering LaTeX-heavy posts
- Optional JS bundling via `npm` for assets in `assets/js`

## Repository layout
- `_posts/`, `_pages/`, `_data/`: primary content and metadata
- `_includes/`, `_layouts/`, `_sass/`, `assets/`: theme overrides and custom assets
- `banner.js`, `staticman.yml`, `google*.html`: site-specific static files
- `_site/`: generated output (ignored)

## Getting started
1. Install Ruby ≥3.1 and Bundler 2.3.7 (`gem install bundler -v 2.3.7`).
2. Install dependencies:
   ```bash
   bundle config set --local path 'vendor/bundle'
   bundle install
   ```
3. (Optional) install npm packages with `npm install` if you plan to rebuild JS assets.

## Local development
- Live preview: `bundle exec jekyll serve --livereload`
- Production build check: `bundle exec jekyll build`
- Sanity checks: `bundle exec jekyll doctor`
- Math-heavy posts rely on `_includes/mathjax.html`; keep LaTeX syntax valid (`$...$` inline, `$$...$$` block) when editing.

## Deployment
Pushing to the `master` branch of the Lightsail bare repo (`/srv/git/website.git`) runs the `post-receive` hook. The hook:
1. Caches a working tree in `/var/www/build`.
2. Installs gems into `vendor/bundle` (also cached).
3. Runs `JEKYLL_ENV=production bundle exec jekyll build`.
4. Syncs `_site/` into `/var/www/mysite`.

Use `git push all` locally to update both GitHub and the server remote in one command. Watch the remote output for Bundler warnings or build failures.

## Content & contribution notes
- Posts/pages use YAML front matter with `title`, `excerpt`, `categories`, `tags`, and `toc` fields in sentence case.
- Keep assets organized under `assets/` and `_sass/`; avoid checking in `_site/` or other generated files.
- Update screenshots or PDFs referenced from posts whenever you change substantive visual content.
