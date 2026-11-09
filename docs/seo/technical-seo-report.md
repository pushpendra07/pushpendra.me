# Technical SEO report

## Crawl and indexing

The production crawl on November 9, 2026 reached all 17 sitemap pages. Each returned 200, contained prerendered content and used a single self-referencing HTTPS canonical. The crawl confirmed 33 clean-URL redirects and verified that tracking-query variants declared the clean canonical. The sample missing URL returned 404. No orphan page, broken internal link, redirect chain, redirect loop or broken internal anchor was found in the audited navigation. Four external destinations were inventoried without requesting them.

The deployed baseline lacked explicit Twitter title, description and image tags on all 17 pages. The local build now emits them alongside existing Open Graph fields and uses the verified 1200×630 preview images. The homepage search description now describes the portfolio in roughly 150 characters. Existing case-study descriptions follow their visible summaries and have no hard character limit.

The local sitemap retains all 17 route-derived URLs and existing image entries. It omits lastmod pending reliable per-page dates. Robots still allows public routes and rendering assets and references the production sitemap. The change also permits crawling of the existing noindex error document.

## Structured data

- **ProfilePage** and **Person** describe the homepage and portfolio owner, using public profile information from the existing content.
- **Article** describes each authored client case study.
- **SoftwareApplication** describes the four product builds using their visible names and summaries.

The validator parses each JSON-LD block, checks the expected type and canonical URL, and validates the author or profile entity, required site fields and HTTPS image and profile links. This is a site-specific structural check. Review the deployed markup in webmaster tooling if checking rich-result eligibility.

## Verification

The production build and XML parse succeeded. The local HTTP audit completed 2,654 checks across 17 routes, 59 linked targets, their anchors, 33 redirect variants and the sitemap and robots responses, with zero issues. A temporary copy with deliberate canonical, JSON-LD, noindex, alt, link and anchor defects failed validation as expected. The original GitHub Actions build was the repository's only existing test step. The new CI steps add blocking deterministic validation and advisory Lighthouse reports.

A Chrome smoke check compared mobile and desktop layout measurements and computed animation names on the homepage, ToolMart and Artha360 before and after. It also exercised mobile navigation, theme switching and project filtering. The Google and Clarity loader requests and GA4 event queue were observed with analytics responses stubbed. No browser console or page errors were recorded in that check.

See [performance comparison](performance-comparison.md) for measured transfer and lab timings and [maintenance guide](maintenance-guide.md) for release checks. The updated build is local. Live verification of the updated crawl files, Google and Bing index coverage, field Core Web Vitals and receipt of analytics events remains an owner-side follow-up after deployment.
