# SEO and generative-search audit guidance

Research date: 2026-09-08. Scope: first-party Google, Microsoft/Bing, and Schema.org guidance applied to `https://dongdongbh.tech`. This is an implementation and measurement note, not a claim that any markup will improve ranking or guarantee inclusion.

## Implementation and validation

The September 8 update replaces placeholder metadata, connects the author/site/page/article entities, identifies About as a profile, and adds video metadata for the two playable Mindwtr videos. It restores the original Mindwtr SEO title at the owner's request. Video publication timestamps come from the first website asset commit (`2026-09-07T17:26:43-04:00` in `mindwtr-web`); durations and source/poster URLs match the video library.

The update improves post summaries and the homepage heading, preserves existing URLs and pagination, changes intentional exclusions to `noindex, follow`, and removes theme examples and verification URLs from the XML sitemap. Verification files remain unchanged and publicly accessible. Repository configuration, scripts, and agent instructions are excluded from the generated site.

Local validation: Jekyll doctor and the production build pass. `python3 scripts/check-seo.py` checks 42 generated HTML pages and 35 sitemap URLs for JSON-LD, metadata consistency, canonical URLs, indexing rules, local social images, and embedded video references. Desktop/mobile browser checks confirm the homepage summaries, original Mindwtr title, and absence of horizontal overflow. The live Cloudflare robots policy allows general crawling while restricting several training crawlers; this change does not alter that policy. Search Console/Bing analytics were not accessed, so no traffic baseline or ranking improvement is claimed.

The findings below describe the pre-change audit and the guidance used for implementation.

## Executive guidance

Treat generative-search visibility as ordinary technical SEO plus clear, attributable, expert content. Google says pages need to be indexed and snippet-eligible for AI Overviews and AI Mode, with **no additional technical requirement, special schema, AI file, or `llms.txt`**. Google also does not guarantee crawling, indexing, serving, or AI inclusion. Its practical advice is crawlability, internal links, textual versions of important information, useful media, page experience, and structured data that matches visible content ([Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)).

Microsoft likewise says there is no secret or guaranteed selection strategy. Its Bing guidance emphasizes crawlability, metadata and internal links, then clear title/description/H1 alignment, descriptive headings, concise self-contained answers, and consistent entities across text and media ([Microsoft: optimizing content for AI search answers](https://about.ads.microsoft.com/en/blog/post/october-2025/optimizing-your-content-for-inclusion-in-ai-search-answers)). These are editorial quality practices, not a separate ranking system to game.

## Repository-specific audit

Current strengths:

- `_config.yml` has an HTTPS production origin and the Jekyll sitemap/feed plugins.
- `_includes/seo.html` emits an absolute self-canonical, title, description, Open Graph metadata, publication/modification dates, and a site-level `Person` JSON-LD object.
- Pagination has crawlable `<a href>` links and each `/pageN/` URL currently self-canonicalizes.
- Posts can declare a focused `description`, `last_modified_at`, and representative images.

Priority gaps and checks:

1. Replace the placeholder global description (`"Homepage of Dongda Li, an amazing website."`) and ensure every important page has a specific visible H1, title, and description. This is both a conventional snippet issue and a Bing clarity issue.
2. Model what each page actually is. A `Person` object on every URL does not identify a post as a `BlogPosting`/`Article`, a profile page as `ProfilePage`, or the site as `WebSite`. Prefer a stable graph with reusable `@id` values: one `WebSite`, one `Person`, `ProfilePage` on the About page, and `BlogPosting` on posts. Keep every property true and visible; structured data that misrepresents or hides content can lose rich-result eligibility ([Google structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)).
3. For posts, useful `BlogPosting` fields are `headline`, `description`, `image`, `datePublished`, truthful `dateModified`, `mainEntityOfPage`, and `author` as a `Person` with a stable author/profile URL. Google has no required Article properties, but recommends all applicable properties and explicitly recommends `author.name`, `author.@type`, and `author.url` or `sameAs` ([Google Article markup](https://developers.google.com/search/docs/appearance/structured-data/article)). Do not change `dateModified` merely to appear fresh.
4. Use `ProfilePage` only where the page's primary focus is one affiliated person—here, the About/profile page—with `mainEntity` pointing to the same stable `Person` node. A generic homepage need not be mislabeled as a profile page ([Google ProfilePage markup](https://developers.google.com/search/docs/appearance/structured-data/profile-page)). `Person` and `WebSite` remain useful vocabulary even where Google offers no corresponding rich result; Schema.org defines their semantics ([Person](https://schema.org/Person), [WebSite](https://schema.org/WebSite)).
5. Verify that non-content/theme demonstration pages are either removed from discovery or intentionally `noindex` and excluded from the XML sitemap. `noindex` must be crawlable to be seen; blocking the same URL in `robots.txt` can prevent the crawler from reading the directive ([Google robots meta specification](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)). A global `noindex, nofollow` is usually unnecessarily destructive when `noindex` alone is intended, because it also tells crawlers not to follow links on that page.
6. Keep Cloudflare's managed robots policy an external operational setting. There is no need to add a special AI robots override for Google Search inclusion. Google states that Googlebot controls Search/AI-feature crawling; `nosnippet`, `data-nosnippet`, `max-snippet`, and `noindex` control Search presentation. `Google-Extended` concerns some other Google AI training/grounding uses, not eligibility for Google Search AI features ([Google AI controls](https://developers.google.com/search/docs/appearance/ai-features#controlling)). Recheck the live policy after CDN configuration changes.

## Canonical URLs and pagination

- Keep one absolute, self-referential canonical on each indexable HTML page. Align internal links and `sitemap.xml` with the same preferred HTTPS URLs. Google treats redirects and `rel="canonical"` as strong signals, sitemap inclusion as weaker, and recommends absolute canonical URLs in valid `<head>` markup ([Google canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)).
- Do not canonicalize `/page2/`, `/page3/`, and so on to page 1. Google treats paginated pages as separate URLs and recommends a self-canonical for each. The existing `rel="prev"`/`rel="next"` may remain for other consumers, but Google no longer uses them as an indexing signal ([Google pagination guidance](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading)).
- Where the same substantive research content is available as HTML and PDF, decide deliberately whether both should be indexed. GitHub Pages cannot ordinarily add a `Link` HTTP header per PDF; avoid asserting an HTML canonical for a PDF unless the hosting layer actually emits it. Preserve PDFs that are primary publications rather than treating all PDFs as duplicates.

## Video pages and embeds

Only add `VideoObject` when a user can watch that specific video on the marked-up page and the metadata matches it. For Google's video feature, the required properties are:

- unique `name`;
- crawlable, indexable, representative `thumbnailUrl`;
- truthful first-publication `uploadDate` in ISO 8601 format (include a timezone).

Google recommends a unique `description`, ISO 8601 `duration`, and a fetchable `contentUrl` pointing to the actual media bytes. If that is unavailable, use the specific player's `embedUrl`; neither field should point back to the article page. Google prefers `contentUrl` because it can fetch the video directly ([Google VideoObject markup](https://developers.google.com/search/docs/appearance/structured-data/video)). For local MP4 assets such as the Mindwtr videos, confirm the production response is fetchable by Google and provide a distinct thumbnail before emitting markup. For YouTube/Vimeo embeds, use the actual player URL as `embedUrl` and do not invent an inaccessible `contentUrl`.

## Measurement plan

Record a baseline before rollout and compare equivalent 28-day windows after recrawl; annotate publication dates so content launches are not confused with metadata effects.

| Surface | Weekly measures | Diagnostic slices |
| --- | --- | --- |
| Google Search Console | indexed pages, impressions, clicks, CTR, average position | page, query, country, device, Search appearance; URL Inspection for representative templates |
| Google AI features | dedicated Generative AI impressions and appearing pages; on-site engaged sessions/conversions from organic search | The dedicated Search/Discover reports rolled out worldwide on 2026-08-31 and break down pages, countries, devices (Search), and time; AI data also remains in overall Performance ([Google announcement](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports)). Do not attribute all Web changes to AI. |
| Bing Webmaster Tools | indexed/crawl errors, search impressions/clicks, submitted sitemap health | URL Inspection and top pages/queries |
| Bing AI Performance | total citations, average cited pages, grounding queries, cited pages, trend | citation count is not rank, authority, placement, or the role of a page in an answer ([Bing AI Performance](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview)) |
| Validation | template samples passing Rich Results Test and Schema Markup Validator | homepage, About/ProfilePage, ordinary post, post with video, paginated archive, intentional `noindex` page |

Success criteria should be mechanical first: correct canonicals, intended pages indexed, excluded pages absent, valid and truthful structured data, discoverable sitemap URLs, and no regression in crawl/index coverage. Search impressions, clicks, engagement, and Bing citations are outcome trends to monitor, not acceptance gates or proof of causation.

## Traps to avoid

- Do not promise rankings, rich results, AI citations, or indexing; valid markup only establishes eligibility.
- Do not add FAQ/Q&A prose solely for extraction, mass-generate thin pages, keyword-stuff descriptions, or create unsupported “AI schema.”
- Do not put facts only in images, video, accordions, or PDFs; keep the important explanation in accessible HTML text.
- Do not publish structured-data properties that are absent, stale, or inconsistent with the visible page.
- Do not infer Google AI traffic from ordinary Search Console Web totals, or interpret Bing citation counts as ranking/authority.
