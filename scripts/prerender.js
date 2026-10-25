// Post-build step: renders the app to static HTML and inlines the CSS so the
// hero paints before any JavaScript or stylesheet request finishes.
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const dist = resolve('dist');
const ssrDir = resolve('dist-ssr');
const { render } = await import(pathToFileURL(resolve(ssrDir, 'entry-server.js')).href);

let html = readFileSync(resolve(dist, 'index.html'), 'utf8');
html = html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`);

html = html.replace(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/, (_, href) => {
  const css = readFileSync(resolve(dist, `.${href}`), 'utf8');
  return `<style>${css}</style>`;
});

if (!html.includes('<div id="root"><')) throw new Error('prerender: app markup missing');
writeFileSync(resolve(dist, 'index.html'), html);
rmSync(ssrDir, { recursive: true, force: true });
console.log('prerendered dist/index.html');
