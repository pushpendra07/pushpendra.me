# SEO maintenance

## Local checks

Use the repository's Node 22 runtime (22.19 or newer for Lighthouse), Python 3.9 or newer, and Chrome or Chromium. The audit uses Python's standard library. The performance command uses the pinned open-source Lighthouse CLI via npm and may need registry access on first use.

```sh
npm ci
npm run build
npm run seo:validate
npm run seo:lighthouse
```

`seo:audit` and `seo:validate` run the same deterministic checks against the built site. Open `seo-reports/audit.md` for findings, redirects and the external-link inventory. The corresponding JSON report is intended for tooling. The auditor fetches internal routes and resources with four workers. It inventories external HTTP links without visiting them.

Lighthouse writes HTML and JSON per run and a median `summary.json` under `seo-reports/lighthouse/`. By default it runs three trials for each device profile against the homepage. Use `--route` for other canonical paths, `--runs 1` for a quick smoke run, and `--chrome-path` if Chrome is installed in a nonstandard location.

```sh
npm run seo:lighthouse -- --route / --route /projects/toolmart/
npm run seo:audit -- --base-url https://pushpendra.me --reports seo-reports/live
```

Run the live command after the same revision deploys. It compares live routes to the local build and will flag differences while production is on an older revision. Local preview models clean static URLs, the custom 404, the built CSP and text compression. Use the live run to validate Cloudflare behavior.

## Publishing and monitoring

- Add projects and products through the existing data files. Rebuild and review the sitemap, case-study metadata and social images whenever a slug changes. Add and verify a hosting redirect separately if an established URL moves.
- Keep sitemap lastmod absent until a reliable per-page content modification date is available. Keep error pages out of the sitemap and let crawlers see their noindex.
- Include useful image alt text and dimensions. The validator recognizes the existing decorative brand, avatar and credential badges and images explicitly marked decorative.
- On a pull request or push to main, download the `seo-reports` artifact from the existing CI workflow. Fix deterministic audit failures before merging. Treat a single Lighthouse warning as a prompt to rerun and examine the median and report diagnostics.
- After a normal Cloudflare Pages deployment, use Google Search Console's Sitemaps and URL Inspection views and Bing Webmaster Tools' Sitemaps and URL Inspection views to check crawl status and selected canonicals. Check the homepage, one project and one AI build. Review the existing sitemap entry for processing errors. Submit it manually only if needed and authorized.
- Check Search Console's Core Web Vitals and PageSpeed Insights field data when available. The reference targets at the 75th percentile are LCP ≤2.5 s, INP ≤200 ms and CLS ≤0.1. Leave INP unavailable when field data is absent. Validate analytics delivery separately in the existing GA4, Tag Manager and Clarity dashboards.

The workflow uploads artifacts for 14 days and adds no deployment or scheduled job.
