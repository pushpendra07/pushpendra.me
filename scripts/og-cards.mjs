// Generates the 1200×630 social preview cards: public/og/home.jpg for the home page and
// public/og/<public slug>.jpg for each case study.
// Run with `npm run og` after changing project titles, tags or platforms, then commit the
// images. Needs Google Chrome (headless screenshot) and macOS `sips` (PNG → JPEG).
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { products, projects } from '../src/data/profile.js';
import { clientName, publicSlug } from '../src/lib/projects.js';

const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const out = resolve('public/og');
const fonts = pathToFileURL(resolve('public/fonts')).href;
const portrait = pathToFileURL(resolve('public/images/portrait-760.jpg')).href;
const tmp = mkdtempSync(join(tmpdir(), 'og-'));
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const card = ({ eyebrow, title, meta, tags, photo }) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: 'Inter Tight'; src: url('${fonts}/inter-tight.woff2') format('woff2'); font-weight: 100 900; }
@font-face { font-family: 'Inter'; src: url('${fonts}/inter.woff2') format('woff2'); font-weight: 100 900; }
@font-face { font-family: 'Geist Mono'; src: url('${fonts}/geist-mono.woff2') format('woff2'); font-weight: 100 900; }
* { box-sizing: border-box; margin: 0; }
body { width: 1200px; height: 630px; overflow: hidden; position: relative; padding: 64px 72px; font-family: 'Inter', sans-serif; color: #0d0f1c; -webkit-font-smoothing: antialiased;
  background: #fff; background-image: linear-gradient(rgba(15,18,40,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15,18,40,.05) 1px, transparent 1px); background-size: 40px 40px; }
.brand { display: flex; align-items: center; gap: 14px; font: 600 26px 'Inter Tight'; letter-spacing: -.02em; }
.mark { width: 48px; height: 48px; border-radius: 12px; display: grid; place-items: center; color: #fff; font: 700 22px 'Inter Tight'; letter-spacing: -.04em; background: linear-gradient(135deg, #5b3df5, #9b5cf6 55%, #ff6a3d); box-shadow: 0 10px 24px -8px rgba(91,61,245,.55); }
.eyebrow { display: inline-flex; align-items: center; gap: 10px; margin-top: 64px; padding: 8px 16px; border-radius: 999px; background: #fff; box-shadow: inset 0 0 0 1px rgba(13,15,28,.12); font: 500 18px 'Geist Mono'; letter-spacing: .05em; text-transform: uppercase; color: #4b5068; }
.eyebrow::before { content: ''; width: 9px; height: 9px; border-radius: 50%; background: #5b3df5; }
h1 { margin-top: 22px; max-width: 920px; font: 600 80px/1.02 'Inter Tight'; letter-spacing: -.045em; }
h1 span { color: #5b3df5; }
.meta { margin-top: 22px; font-size: 28px; color: #4b5068; }
.has-photo h1, .has-photo .meta { max-width: 640px; }
.has-photo h1 { font-size: 66px; }
.has-photo .eyebrow { margin-top: 48px; }
.tags { position: absolute; left: 72px; bottom: 60px; display: flex; gap: 10px; }
.tag { padding: 8px 16px; border-radius: 999px; font-size: 19px; color: #4b5068; background: #fff; box-shadow: inset 0 0 0 1px rgba(13,15,28,.14); }
.ring { position: absolute; right: 72px; top: 70px; width: 360px; height: 360px; padding: 10px; border-radius: 50%; background: conic-gradient(from 200deg, #5b3df5, #ff6a3d, #ffb547, #8b74ff, #5b3df5); box-shadow: 0 30px 60px -20px rgba(91,61,245,.45); }
.ring img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; object-position: 50% 20%; border: 7px solid #fff; display: block; }
.url { position: absolute; right: 72px; bottom: 66px; font: 500 20px 'Geist Mono'; color: #5b3df5; }
</style></head><body${photo ? ' class="has-photo"' : ''}>
<div class="brand"><span class="mark">ps</span>Pushpendra Singh Sodha</div>
${photo ? `<div class="ring"><img src="${portrait}" alt=""></div>` : ''}
<p class="eyebrow">${esc(eyebrow)}</p>
<h1>${esc(title)}</h1>
<p class="meta">${esc(meta)}</p>
<div class="tags">${tags.slice(0, photo ? 3 : 4).map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
<span class="url">pushpendra.me</span>
</body></html>`;

const cards = [
  {
    slug: 'home',
    photo: true,
    eyebrow: 'Adobe Certified Expert',
    title: 'Magento 2 & Adobe Commerce developer',
    meta: '12+ years · PHP · Middle East, Australia, USA',
    tags: ['Available immediately', 'Adobe Commerce', 'Magento 2', 'Headless GraphQL'],
  },
  ...projects.map((pj) => ({
    slug: publicSlug(pj),
    eyebrow: `Case study · ${pj.category}`,
    title: clientName(pj),
    meta: [pj.platform, pj.place].filter(Boolean).join(' · '),
    tags: pj.tags,
  })),
  ...products.map((pj) => ({
    slug: pj.slug,
    eyebrow: 'Built with AI · Product case study',
    title: pj.title,
    meta: pj.platform,
    tags: pj.tags,
  })),
];

mkdirSync(out, { recursive: true });
for (const { slug, ...content } of cards) {
  const html = join(tmp, `${slug}.html`);
  const png = join(tmp, `${slug}.png`);
  writeFileSync(html, card(content));
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
    '--window-size=1200,630', '--virtual-time-budget=2000', `--screenshot=${png}`, pathToFileURL(html).href], { stdio: 'ignore' });
  execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '84', png, '--out', join(out, `${slug}.jpg`)], { stdio: 'ignore' });
  console.log(`og/${slug}.jpg`);
}
rmSync(tmp, { recursive: true, force: true });
