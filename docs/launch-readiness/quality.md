# Accessibility, responsiveness and performance

## Local accessibility evaluation

[WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/) is the evaluation target. This smoke check provides sampled evidence only.

| Area | Observed evidence | Remaining work |
| --- | --- | --- |
| Landmarks and headings | Chromium 156.0.8078.82 reported one main landmark and one level-one heading on each of ten routes, at 320/375/768/1024/1440 CSS px. Document language was English. | Validate complete heading and landmark announcements with screen readers on supported mobile and desktop combinations. |
| Keyboard and focus | At 320 px Tab showed the skip-link outline; Enter focused main. Tab reached the labeled search field. Enter submitted mixed-case search, category activation showed the empty state, clearing restored results, and keyboard activation opened a profile. | Check natural tab order through every control, focus after client navigation and history, zoom, high contrast, forced colors and screen-reader browse/forms modes. Some smoke actions focused their target directly. |
| Search and errors | Observed live status-region text, an empty-state heading, gallery labels and captions, and custom 404 for a cross-city profile. The city exception handler has an alert and retry control in source. | Test actual live announcements, fault-inject retry and unexpected errors, test reduced-motion and slow-network behavior. |
| Responsive and RTL | No document horizontal overflow in 50 route/width combinations. One 320 px profile also passed a forced RTL overflow probe. | Test in Firefox, Safari and real mobile browsers, long Arabic copy, mixed direction, 200–400% zoom/reflow, orientation and touch targets. English is the only implemented locale. |
| Contrast | Sampled solid CSS pairs using relative luminance. Body text on page 16.48:1, muted on panel 8.42:1, placeholder on input 7.35:1, selected control text on dark gold 9.33:1, focus outline on panel 11.76:1. | Sampled neutral card border against panel is 1.73:1. Audit where a boundary is needed to identify a control or state. Review all states, adjacent colors, gradients and forced colors independently. |

Release requires a representative independent audit with VoiceOver, NVDA or equivalent assistive technology, cross-browser test matrix, localized layout review as applicable, and remediation and retest of blockers. Screen-reader and fault-injection testing were not performed here.

## Reproducible local baseline

Windows, Node 24.22.3, npm 10.9.4, Next.js 15.5.29. With previous generated build/types moved aside and a clean cached dependency install, measured wall time was 3.81 s for unit tests, 5.17 s for TypeScript, and 45.53 s for the production build. Build output reported 103 kB shared first-load JS, 106 kB for home and profiles, 108 kB for city pages. These are tool-reported sizes.

On the loopback production server each route was fetched serially 22 times using Node fetch. Discarded first two calls, timed request through fully consumed response using a monotonic clock, sorted 20 observations, used mean of middle two for p50 and 19th sample for p95. Body sizes count decoded HTML bytes. One run, no concurrency, no browser asset waterfall or remote network.

| Route | Median ms | p95 ms | HTML bytes |
| --- | ---: | ---: | ---: |
| / | 11.89 | 16.27 | 8,481 |
| /dubai | 35.42 | 40.68 | 11,424 |
| /dubai?q=creative&category=creative | 32.21 | 40.14 | 10,969 |
| /dubai/listing/creative-studio | 14.15 | 29.30 | 12,800 |

To reproduce, run the [clean build and loopback commands](evidence.md) and repeat this Node snippet with the production server listening:

```js
const paths = ["/", "/dubai", "/dubai?q=creative&category=creative", "/dubai/listing/creative-studio"];
for (const path of paths) {
  const samples = [];
  let bytes;
  for (let index = 0; index < 22; index++) {
    const start = performance.now();
    const response = await fetch("http://127.0.0.1:43136" + path);
    if (response.status !== 200) throw new Error(String(response.status));
    bytes = (await response.arrayBuffer()).byteLength;
    if (index >= 2) samples.push(performance.now() - start);
  }
  samples.sort((a, b) => a - b);
  console.log(path, (samples[9] + samples[10]) / 2, samples[18], bytes);
}
```

## Cache and reliability implications

Home and the sampled profile returned `s-maxage=31536000`. Dubai with and without filters returned private, no-cache/no-store. All sampled responses emitted `X-Powered-By: Next.js`. Loopback responses lacked CSP, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy and Permissions-Policy. Loopback HTTP does not exercise TLS or any future edge controls. Before launch define and test transport, framing, CSP and referrer policy at the actual boundary, and disable unnecessary disclosure headers. Noindex was verified on profile responses and is not access control.

Production bottlenecks to measure include city search cache cardinality, database indexes and cold starts, oversized input, media processing/egress, staff queues and recovery. Require representative concurrent workload, device/network diversity, cache purge and city separation tests, load shedding and a rollback/restore exercise. No Core Web Vitals, production latency, availability or SLA was measured.
