// Generates the 1200×630 social preview card for each case study into public/og/<public slug>.jpg.
// Run with `npm run og` after changing project titles, tags or platforms, then commit the
// images. Needs Google Chrome (headless screenshot) and macOS `sips` (PNG → JPEG).
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { projects } from '../src/data/profile.js';
import { clientName, publicSlug } from '../src/lib/projects.js';

const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const out = resolve('public/og');
const fonts = pathToFileURL(resolve('public/fonts')).href;
const tmp = mkdtempSync(join(tmpdir(), 'og-'));
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const card = (pj) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: 'Space Grotesk'; src: url('${fonts}/space-grotesk.woff2') format('woff2'); font-weight: 100 900; }
@font-face { font-family: 'DM Sans'; src: url('${fonts}/dm-sans.woff2') format('woff2'); font-weight: 100 900; }
@font-face { font-family: 'JetBrains Mono'; src: url('${fonts}/jetbrains-mono.woff2') format('woff2'); font-weight: 100 900; }
* { box-sizing: border-box; margin: 0; }
body { width: 1200px; height: 630px; overflow: hidden; font-family: 'DM Sans', sans-serif; color: #e8e6f3;
  background: radial-gradient(90% 90% at 85% 0%, #2a1f6b 0%, #0d1030 45%, #06070d 100%); position: relative; padding: 64px 72px; }
.dots { position: absolute; inset: 0; background-image: radial-gradient(rgba(196,181,253,.16) 1px, transparent 1.3px); background-size: 24px 24px;
  -webkit-mask-image: radial-gradient(60% 70% at 85% 30%, #000, transparent 75%); }
.orbit { position: absolute; right: -120px; top: -90px; width: 560px; height: 560px; border-radius: 50%; border: 1px solid rgba(167,139,250,.35); }
.orbit.two { right: -40px; top: 40px; width: 380px; height: 380px; border-style: dashed; border-color: rgba(103,232,249,.3); }
.brand { position: relative; display: flex; align-items: center; gap: 14px; font-family: 'Space Grotesk'; font-weight: 600; font-size: 26px; }
.mark { width: 52px; height: 52px; border-radius: 14px; display: grid; place-items: center; background: linear-gradient(135deg,#1a1440,#0d1330);
  border: 1px solid rgba(167,139,250,.4); font-family: 'JetBrains Mono'; font-size: 17px; color: #c4b5fd; }
.eyebrow { position: relative; margin-top: 70px; font-family: 'JetBrains Mono'; font-size: 20px; letter-spacing: .08em; text-transform: uppercase; color: #a78bfa; }
h1 { position: relative; margin-top: 18px; max-width: 900px; font-family: 'Space Grotesk'; font-weight: 600; font-size: 84px; line-height: 1; letter-spacing: -.035em; color: #fff; }
.meta { position: relative; margin-top: 22px; font-size: 26px; color: #b9b6cc; }
.tags { position: absolute; left: 72px; bottom: 64px; display: flex; gap: 10px; }
.tag { font-family: 'JetBrains Mono'; font-size: 18px; padding: 8px 14px; border-radius: 10px; border: 1px solid rgba(167,139,250,.35); color: #ddd6fe; background: rgba(139,92,246,.1); }
.url { position: absolute; right: 72px; bottom: 72px; font-family: 'JetBrains Mono'; font-size: 18px; color: #8f8daa; }
</style></head><body>
<div class="dots"></div><div class="orbit"></div><div class="orbit two"></div>
<div class="brand"><span class="mark">&lt;ps/&gt;</span>Pushpendra Singh</div>
<p class="eyebrow">Case study · ${esc(pj.category)}</p>
<h1>${esc(clientName(pj))}</h1>
<p class="meta">${esc([pj.platform, pj.place].filter(Boolean).join(' · '))}</p>
<div class="tags">${pj.tags.slice(0, 4).map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
<span class="url">pushpendra.me</span>
</body></html>`;

mkdirSync(out, { recursive: true });
for (const pj of projects) {
  const slug = publicSlug(pj);
  const html = join(tmp, `${slug}.html`);
  const png = join(tmp, `${slug}.png`);
  writeFileSync(html, card(pj));
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
    '--window-size=1200,630', '--virtual-time-budget=2000', `--screenshot=${png}`, pathToFileURL(html).href], { stdio: 'ignore' });
  execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '84', png, '--out', join(out, `${slug}.jpg`)], { stdio: 'ignore' });
  console.log(`og/${slug}.jpg`);
}
rmSync(tmp, { recursive: true, force: true });
