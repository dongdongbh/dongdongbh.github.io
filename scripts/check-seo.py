#!/usr/bin/env python3
"""Check the generated site's indexing, metadata, and structured-data contracts."""

import json
import re
import sys
from collections import Counter
from datetime import datetime
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
from xml.etree import ElementTree


class Page(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.meta = {}
        self.links = []
        self.title = ""
        self.headings = []
        self.schemas = []
        self.videos = []
        self.sources = []
        self.active = None
        self.buffer = ""
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "meta":
            key = attrs.get("name", attrs.get("property"))
            self.meta.setdefault(key, []).append(attrs.get("content", ""))
        elif tag == "link":
            self.links.append(attrs)
        elif tag == "video":
            self.videos.append(attrs)
        elif tag == "source":
            self.sources.append(attrs.get("src"))
        if tag in ("title", "h1") or (tag == "script" and attrs.get("type") == "application/ld+json"):
            self.active, self.buffer = tag, ""

    def handle_data(self, data):
        if self.active:
            self.buffer += data

    def handle_endtag(self, tag):
        if tag != self.active:
            return
        if tag == "title":
            self.title = self.buffer.strip()
        elif tag == "h1":
            self.headings.append(self.buffer.strip())
        else:
            self.schemas.append(json.loads(self.buffer))
        self.active, self.buffer = None, ""

    def one_meta(self, name):
        values = self.meta.get(name, [])
        assert len(values) == 1 and values[0].strip(), f"Expected one nonempty {name}"
        return values[0]


def check_site(root):
    failures, titles, descriptions = [], [], []
    sitemap = ElementTree.parse(root / "sitemap.xml")
    locations = [e.text for e in sitemap.findall(".//{*}loc")]
    assert len(locations) == len(set(locations)), "Duplicate sitemap URLs"
    indexed = set(locations)
    pages = 0

    for path in sorted(root.rglob("*.html")):
        source = path.read_text(encoding="utf-8")
        if "<!-- begin _includes/seo.html -->" not in source:
            continue  # Verification files are static, not site pages.
        try:
            page = Page(source)
            pages += 1
            assert page.title, "Empty title"
            description = page.one_meta("description")
            assert "an amazing website" not in description, "Placeholder description"
            canonical = [link["href"] for link in page.links if link.get("rel") == "canonical"]
            assert len(canonical) == 1, "Expected one canonical"
            url = urlsplit(canonical[0])
            assert url.scheme == "https" and url.netloc and not url.fragment, "Invalid canonical"
            assert page.one_meta("og:url") == canonical[0], "Open Graph URL differs from canonical"
            assert page.one_meta("og:title") == page.title, "Social title differs from title"
            assert page.one_meta("twitter:description") == description, "Social description differs"
            assert re.search(r'<html\s+lang="[^"]+"', source), "Missing document language"
            robots = page.one_meta("robots")
            if "noindex" in robots:
                assert canonical[0] not in indexed, "Noindex URL in sitemap"
                assert "nofollow" not in robots, "Noindex page prevents following post links"
            else:
                assert any(page.headings), "Missing nonempty H1"
                assert canonical[0] in indexed, "Indexable HTML missing from sitemap"
                titles.append(page.title)
                descriptions.append(description)

            nodes = [node for schema in page.schemas for node in schema.get("@graph", [schema])]
            types = {node.get("@type"): node for node in nodes}
            person, website = types["Person"], types["WebSite"]
            assert person["name"] and person["url"] and person["sameAs"], "Incomplete author identity"
            assert website["publisher"]["@id"] == person["@id"], "Disconnected publisher"
            if page.one_meta("og:type") == "article":
                article = types["BlogPosting"]
                assert article["url"] == canonical[0], "Article URL mismatch"
                assert article["author"]["@id"] == person["@id"], "Disconnected article author"
                assert article["datePublished"] == page.one_meta("article:published_time"), "Publication date mismatch"
                assert datetime.fromisoformat(article["dateModified"]) >= datetime.fromisoformat(article["datePublished"]), "Modification precedes publication"
                for video in article.get("video", []):
                    assert video["name"] and video["description"], "Missing video text"
                    assert video["contentUrl"] in page.sources, "Structured video is not embedded"
                    assert video["thumbnailUrl"] in [v.get("poster") for v in page.videos], "Video poster mismatch"
                    assert re.match(r"^P(T|\d)", video["duration"]), "Invalid video duration"
                    assert re.match(r"^\d{4}-\d{2}-\d{2}T.*(Z|[+-]\d{2}:\d{2})$", video["uploadDate"]), "Missing video publication timezone"
            else:
                assert "BlogPosting" not in types, "Non-article marked as a blog post"
            if "ProfilePage" in types:
                assert types["ProfilePage"]["mainEntity"]["@id"] == person["@id"], "Profile has wrong main entity"

            for image in page.meta.get("og:image", []):
                image_url = urlsplit(image)
                assert image_url.scheme == "https", "Non-HTTPS social image"
                if image_url.netloc == url.netloc:
                    assert (root / unquote(image_url.path).lstrip("/")).is_file(), "Missing social image file"
            assert "&lt;/figcaption&gt;" not in source, "Video caption markup leaked into text"
        except (AssertionError, KeyError, ValueError) as error:
            failures.append(f"{path.relative_to(root)}: {error}")

    for label, values in (("title", titles), ("description", descriptions)):
        failures.extend(f"Duplicate indexable {label}: {value}" for value, count in Counter(values).items() if count > 1)
    for url in locations:
        relative = unquote(urlsplit(url).path).lstrip("/")
        target = root / relative
        if url.endswith("/"):
            target /= "index.html"
        if not target.is_file():
            failures.append(f"Sitemap target missing: {url}")
    for name in ("AGENTS.md", "staticman.yml", "banner.js", "scripts", "docs"):
        if (root / name).exists():
            failures.append(f"Repository-only file published: {name}")
    assert pages > 0, "No rendered pages checked"
    if failures:
        raise SystemExit("\n".join(failures))
    print(f"SEO checks passed: {pages} HTML pages, {len(indexed)} sitemap URLs; JSON-LD, metadata, images, video references, and indexing rules valid.")


if __name__ == "__main__":
    check_site(Path(sys.argv[1] if len(sys.argv) > 1 else "_site"))
