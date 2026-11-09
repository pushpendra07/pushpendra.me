# Performance comparison

Homepage medians, three Lighthouse 13.6.0 trials per profile per build, under the same headless Chrome 156 and compressed loopback setup. See [methodology](performance-baseline.md).

| Metric | Mobile before → after | Desktop before → after |
| --- | ---: | ---: |
| Performance | 100 → 100 | 100 → 100 |
| Accessibility | 100 → 97 | 100 → 100 |
| Best practices | 100 → 100 | 100 → 100 |
| SEO | 100 → 100 | 100 → 100 |
| LCP | 1,062 → 1,040 ms | 268 → 268 ms |
| FCP | 1,062 → 1,040 ms | 268 → 268 ms |
| CLS | 0 → 0 | 0 → 0 |
| TBT | 58 → 48 ms | 0 → 0 ms |
| Speed Index | 1,404 → 1,466 ms | 623 → 609 ms |
| JavaScript transfer | 97,708 → 97,712 B | 97,708 → 97,712 B |
| Separate CSS transfer | 0 → 0 B | 0 → 0 B |
| Image transfer | 19,987 → 19,987 B | 19,987 → 19,987 B |
| HTML transfer, including inlined CSS | 61,263 → 58,458 B | 61,263 → 58,458 B |
| Total transfer | 278,392 → 275,591 B | 278,392 → 275,591 B |

The homepage response transferred 2,805 fewer bytes of compressed HTML in the lab, a 4.6% reduction. The timing changes are small and mixed. These samples support a transfer reduction, with real-user performance still unmeasured. The skills illustration contrast finding appeared in one baseline mobile run and in all three follow-up mobile runs. The portrait link's accessible-name diagnostic also appeared in both builds. The affected markup and style rules were preserved as part of the visual and interaction constraints. Review these accessibility findings separately if changing color or accessible labels is in scope.

The CI budgets are advisory. Mobile warns below a performance score of 90, above 2.5 s LCP or above 300 ms TBT. Desktop uses 95, 1.5 s and 200 ms, respectively. Both warn above 0.1 CLS. These are lab budgets with headroom for runner variance. Field INP is unavailable.

## Case-study follow-up

Three isolated ToolMart runs per profile produced a median performance score of 100 on both profiles, LCP of 816 ms on mobile and 226 ms on desktop, and zero CLS. Mobile median TBT was 26.5 ms. An earlier single run during concurrent browser checks recorded 5,962 ms TBT, mostly unattributed. It did not recur in the isolated runs. The case study had no matched pre-change Lighthouse runs, so these values are follow-up measurements only.
