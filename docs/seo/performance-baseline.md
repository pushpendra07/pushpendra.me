# Performance baseline

Local homepage snapshot from commit `a2edcbd`, measured November 9, 2026 using Lighthouse 13.6.0 and headless Chrome 156. Each value is the median of three runs per profile. Lighthouse used its standard simulated mobile and desktop presets against a loopback server serving production HTML, CSP and gzip. The lab runner blocks third-party analytics requests for repeatability and avoids sending test traffic. The live homepage independently returned Brotli for a client advertising support.

| Metric | Mobile | Desktop |
| --- | ---: | ---: |
| Performance | 100 | 100 |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| SEO | 100 | 100 |
| LCP | 1,062 ms | 268 ms |
| FCP | 1,062 ms | 268 ms |
| CLS | 0 | 0 |
| TBT | 58 ms | 0 ms |
| Speed Index | 1,404 ms | 623 ms |
| JavaScript transfer | 97,708 B | 97,708 B |
| Separate CSS transfer | 0 B | 0 B |
| Image transfer | 19,987 B | 19,987 B |
| HTML transfer, including inlined CSS | 61,263 B | 61,263 B |
| Total transfer | 278,392 B | 278,392 B |

Field INP, LCP and CLS are **unavailable** for this audit. The public PageSpeed field-data request returned a quota error, so field-data availability for the origin could not be established. Lighthouse TBT is a separate lab metric. The owner can review field percentiles in Search Console or PageSpeed Insights.

An initial uncompressed run with Lighthouse 12 flagged the local transport and roughly 73 KiB of CSS it did not use in that homepage trace. That run had a Chrome trace compatibility warning and uses different transport and tooling. It is excluded from the comparison. Source inspection identified a self-contained case-study block with no homepage selectors. The follow-up removes that block from the homepage inline CSS and keeps styles in their original order on case studies.
