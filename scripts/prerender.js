// Post-build step: renders the home page and every case-study page to static
// HTML and inlines the CSS so each page paints before any JavaScript or
// stylesheet request finishes.
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const SITE = 'https://pushpendra.me';
const dist = resolve('dist');
const ssrDir = resolve('dist-ssr');
const { render, caseStudies, homeJsonLd } = await import(pathToFileURL(resolve(ssrDir, 'entry-server.js')).href);

let template = readFileSync(resolve(dist, 'index.html'), 'utf8');
template = template.replace(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/, (_, href) => {
  const css = readFileSync(resolve(dist, `.${href}`), 'utf8');
  return `<style>${css}</style>`;
});

// Inline scripts (the Google tag) are allowed by hash in the CSP in public/_headers.
const headers = readFileSync(resolve('public/_headers'), 'utf8');
for (const [, body] of template.matchAll(/<script>([\s\S]*?)<\/script>/g)) {
  const hash = `'sha256-${createHash('sha256').update(body).digest('base64')}'`;
  if (!headers.includes(hash)) throw new Error(`prerender: add ${hash} to script-src in public/_headers`);
}

const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// Swaps the home page's title, description, canonical, Open Graph and Twitter card tags.
function withHead(html, { path, title, description, image }) {
  const url = `${SITE}${path}`;
  const swaps = [
    [/<title>[^<]*<\/title>/, `<title>${attr(title)}</title>`],
    [/(<meta name="description" content=")[^"]*/, `$1${attr(description)}`],
    [/(<link rel="canonical" href=")[^"]*/, `$1${url}`],
    [/(<meta property="og:url" content=")[^"]*/, `$1${url}`],
    [/(<meta property="og:title" content=")[^"]*/, `$1${attr(title)}`],
    [/(<meta property="og:description" content=")[^"]*/, `$1${attr(description)}`],
    [/(<meta property="og:type" content=")[^"]*/, '$1article'],
    [/(<meta property="og:image" content=")[^"]*/, `$1${image}`],
    [/(<meta property="og:image:width" content=")[^"]*/, '$11200'],
    [/(<meta property="og:image:height" content=")[^"]*/, '$1630'],
    [/(<meta property="og:image:alt" content=")[^"]*/, `$1${attr(title)}`],
    [/(<meta name="twitter:card" content=")[^"]*/, '$1summary_large_image'],
  ];
  return swaps.reduce((out, [re, to]) => {
    if (!re.test(out)) throw new Error(`prerender: ${re} not found in index.html`);
    return out.replace(re, to);
  }, html);
}

// JSON-LD block for the page; `<` is escaped so the data can't close the script tag.
const jsonLd = (data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

function write(path, html, data) {
  const markup = render(path);
  if (!markup.startsWith('<')) throw new Error(`prerender: app markup missing for ${path}`);
  const dir = resolve(dist, `.${path}`);
  mkdirSync(dir, { recursive: true });
  const page = html
    .replace('</head>', `${jsonLd(data)}</head>`)
    .replace('<div id="root"></div>', `<div id="root">${markup}</div>`);
  writeFileSync(resolve(dir, 'index.html'), page);
}

write('/', template, homeJsonLd);
for (const page of caseStudies) write(page.path, withHead(template, page), page.jsonLd);

rmSync(ssrDir, { recursive: true, force: true });
console.log(`prerendered ${1 + caseStudies.length} pages`);
