# Technical SEO baseline

Audited November 9, 2026 against local commit `a2edcbd` and sampled production responses.

## Repository and deployment

- React 18 and Vite 6 build split home and case-study client entry points. The SSR build is consumed by `scripts/prerender.js`, which emits complete page HTML and inlines CSS. The browser hydrates the same route. No application secrets or environment variables are needed for the build.
- `src/data/profile.js`, `src/data/caseStudies.js` and `src/lib/projects.js` drive 17 public HTML routes. These are the homepage, 12 client case studies under `/projects/` and four AI builds under `/products/`. The two collection views are homepage sections. `404.html` is a separate noindex fallback. The résumé, assets, manifest and crawler files are static resources.
- Cloudflare Pages deploys `dist` after the existing main-branch build. GitHub Actions already runs npm ci and npm run build on pushes to main and PRs. There was no separate test command or SEO regression suite.
- The analytics head queues GA4 and defers the Google tag and Clarity. The local implementation loads Google’s gtag.js from the Google Tag Manager host. The brief reports a separate GTM container and webmaster account verification. Confirmation of those account settings requires owner access. `src/lib/analytics.js` contains delegated resume, contact, project and other events. These integrations are outside the changes.

## Crawl and metadata findings

- The baseline production build succeeded. All 17 indexable pages had prerendered headings and content, one H1 each, no skipped heading levels and no repeated element IDs. Each rendered image included alt and both dimensions. The hero uses a responsive WebP/JPEG picture with high fetch priority. Decorative logos and badges use empty alt where adjacent text conveys their meaning. Below-fold gallery images use lazy loading.
- Live robots and sitemap returned HTTP 200 as text/plain and application/xml. The sitemap parsed locally and contained 17 route-derived entries with real 1200×630 share images. Every lastmod was set to build day regardless of changes. The wildcard robots group disallowed the error document despite the page already declaring noindex. The site exposes no private/admin HTML routes in its static build.
- Live root and sampled canonical case study returned 200. The case study without the slash and explicit index.html variants returned 308 to clean URLs. The www root returned 301 to the apex. A query-tagged case study returned 200 and the sample unknown route returned 404.
- The source and generated HTML already used absolute apex canonicals with trailing slashes. Open Graph was route-specific. Twitter had only a card type and relied on Open Graph fallbacks. The homepage description was 200 characters. Case-study descriptions ranged from 103 to 200 and were derived from visible summaries.
- Existing JSON-LD uses ProfilePage with Person, Article for authored client case studies, and SoftwareApplication for product pages. Professional claims and profile links come from the site's content and profile configuration. The audit verifies the configured links and their presence, with account ownership left to the site owner.

Keep the existing route conventions and schema types. Remove build-date sitemap timestamps, expose the existing noindex to crawlers, fill the explicit Twitter tags and add generated-output checks. Hosting-specific redirects and caching remain independently verifiable through live checks. Performance measurements are recorded separately.
