// Post-build step: writes the crawler and AI files into dist/ from the same data the pages use,
// so they never drift from the site. Run by `npm run build` after the pre-render.
//   robots.txt                 search and AI crawler rules, sitemap location
//   sitemap.xml                every indexable page with its share image
//   llms.txt                   short site summary for AI assistants (llmstxt.org)
//   llms-full.txt              the whole profile and every case study as plain text
//   humans.txt                 who made the site (humanstxt.org)
//   .well-known/security.txt   how to report a security issue (RFC 9116)
// The email address is never written here in plain form: see src/lib/email.js.
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { caseStudies } from '../src/data/caseStudies.js';
import { certs, config, education, experience, products, projects, skills } from '../src/data/profile.js';
import { caseStudyPath, clientName, publicSlug } from '../src/lib/projects.js';

const SITE = 'https://pushpendra.me';
const dist = resolve('dist');
const today = new Date().toISOString().slice(0, 10);
const NAME = 'Pushpendra Singh Sodha';
const write = (file, text) => {
  const path = resolve(dist, file);
  mkdirSync(resolve(path, '..'), { recursive: true });
  writeFileSync(path, text.endsWith('\n') ? text : `${text}\n`);
};
const xml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const emailText = 'pushpendra07 [at] yahoo [dot] com';

const pages = [
  { path: '/', title: `${NAME}, Magento 2 & Adobe Commerce developer`, image: `${SITE}/og/home.jpg`, extra: [`${SITE}/images/portrait-760.jpg`] },
  ...projects.map((pj) => ({ path: caseStudyPath(pj), title: `${clientName(pj)} case study`, image: `${SITE}/og/${publicSlug(pj)}.jpg` })),
  ...products.map((pj) => ({ path: caseStudyPath(pj), title: `${pj.title} product case study`, image: `${SITE}/og/${pj.slug}.jpg` })),
];

// ---------- robots.txt ----------
// Search engines and AI assistants are all welcome: the site exists to be found and cited.
const aiBots = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'anthropic-ai',
  'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'GoogleOther', 'Applebot', 'Applebot-Extended',
  'Amazonbot', 'meta-externalagent', 'DuckAssistBot', 'cohere-ai', 'MistralAI-User', 'YouBot', 'CCBot',
];
write('robots.txt', [
  '# pushpendra.me: every page may be crawled, indexed and cited.',
  '# Summary for AI assistants: https://pushpendra.me/llms.txt (full text: /llms-full.txt)',
  '',
  'User-agent: *',
  'Allow: /',
  '',
  '# AI search and assistant crawlers, named explicitly so the intent is unambiguous.',
  ...aiBots.map((b) => `User-agent: ${b}`),
  'Allow: /',
  '',
  `Sitemap: ${SITE}/sitemap.xml`,
].join('\n'));

// ---------- sitemap.xml ----------
write('sitemap.xml', [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
  ...pages.map((p) => [
    '  <url>',
    `    <loc>${SITE}${p.path}</loc>`,
    ...[p.image, ...(p.extra || [])].map((img) => `    <image:image><image:loc>${xml(img)}</image:loc></image:image>`),
    '  </url>',
  ].join('\n')),
  '</urlset>',
].join('\n'));

// ---------- llms.txt ----------
const years = new Date().getFullYear() - 2014;
const intro = `${NAME} (also known as Pushpendra Singh) is an Adobe Certified Expert and senior Magento 2 / Adobe Commerce and PHP developer, `
  + `Senior Software Developer with tech-lead responsibilities at Krish TechnoLabs, available to join immediately. `
  + `${years}+ years building enterprise Adobe Commerce platforms for retailers in the UAE, Kuwait, Saudi Arabia, Lebanon, Australia, Russia and the USA.`;
const certLines = certs.map((c) => (c.verifyUrl ? `- [${c.title}, ${c.issuer}](${c.verifyUrl}) (verification link)` : `- ${c.title}: ${c.issuer} (${c.meta})`));

write('llms.txt', [
  `# ${NAME}: Magento 2 & Adobe Commerce developer, PHP`,
  '',
  `> ${intro}`,
  '',
  `Based in ${config.location}, working remotely (IST, UTC+5:30). Open to: ${config.availableFor.join(', ')}.`,
  '',
  '## Profile',
  '',
  `- [Portfolio](${SITE}/): projects, experience, AI builds and how I work`,
  `- [Full text for AI assistants](${SITE}/llms-full.txt): the whole profile and every case study`,
  `- [Resume (PDF)](${SITE}/Pushpendra-Singh-Resume.pdf)`,
  `- [LinkedIn](${config.linkedinUrl})`,
  ...(config.githubUrl ? [`- [GitHub](${config.githubUrl})`] : []),
  '',
  '## Client case studies',
  '',
  ...projects.map((pj) => `- [${clientName(pj)}](${SITE}${caseStudyPath(pj)}): ${pj.category}${pj.place ? `, ${pj.place}` : ''}. ${pj.desc}`),
  '',
  '## Products built with AI coding agents',
  '',
  ...products.map((pj) => `- [${pj.title}](${SITE}${caseStudyPath(pj)}): ${pj.desc}`),
  '',
  '## Certifications',
  '',
  ...certLines,
  '',
  '## Contact',
  '',
  `- Email: ${emailText}`,
  `- Contact section: ${SITE}/#contact`,
  `- LinkedIn: ${config.linkedinUrl}`,
].join('\n'));

// ---------- llms-full.txt ----------
const section = (title, lines) => ['', `## ${title}`, '', ...lines];
const studyText = (pj) => {
  const s = caseStudies[pj.slug] || {};
  const out = [
    '',
    `### ${pj.kind === 'product' ? pj.title : clientName(pj)}`,
    '',
    `URL: ${SITE}${caseStudyPath(pj)}`,
    `Category: ${pj.category}${pj.place ? ` · Location: ${pj.place}` : ''} · Platform: ${pj.platform}`,
    `Technologies: ${pj.tags.join(', ')}`,
    '',
    s.lead || pj.desc,
  ];
  if (pj.problem) out.push('', `Challenge: ${pj.problem}`);
  if (pj.solution) out.push(`Approach: ${pj.solution}`);
  if (pj.metrics?.length) out.push('', 'Results:', ...pj.metrics.map((m) => `- ${m.value} ${m.label}`));
  if (pj.details?.length) out.push('', 'What was built:', ...pj.details.map((d) => `- ${d}`));
  return out;
};

write('llms-full.txt', [
  `# ${NAME}: full profile`,
  '',
  `> ${intro}`,
  '',
  `Source: ${SITE}/ · Generated ${today}`,
  ...section('Experience', experience.flatMap((x) => ['', `### ${x.title}, ${x.employer} (${x.dates})`, '', ...x.points.map((p) => `- ${p}`), '', `Stack: ${x.stack.join(', ')}`])),
  ...section('Client case studies', projects.flatMap(studyText)),
  ...section('Products built with AI coding agents', [
    'My own products, not client work. I set the product and the architecture, then reviewed and tested every module the agents wrote.',
    ...products.flatMap(studyText),
  ]),
  ...section('Skills', skills.map((sk) => `- ${sk.group}: ${sk.items.join(', ')}${sk.learning ? ' (currently learning, not yet in production)' : ''}`)),
  ...section('Certifications and awards', certLines),
  ...section('Education', education.map((e) => `- ${e.degree}, ${e.school}`)),
  ...section('Contact', [`- Email: ${emailText}`, `- Contact section: ${SITE}/#contact`, `- LinkedIn: ${config.linkedinUrl}`, `- Resume: ${SITE}/Pushpendra-Singh-Resume.pdf`]),
].join('\n'));

// ---------- humans.txt ----------
write('humans.txt', [
  '/* TEAM */',
  `  Developer: ${NAME}`,
  '  Role: Magento 2 & Adobe Commerce developer, PHP',
  `  Contact: ${SITE}/#contact`,
  `  LinkedIn: ${config.linkedinUrl}`,
  `  From: ${config.location}`,
  '',
  '/* SITE */',
  `  Last update: ${today}`,
  '  Language: English',
  '  Standards: HTML5, CSS3, schema.org JSON-LD',
  '  Components: React 18, Vite, static pre-rendering',
  '  Fonts: Inter, Inter Tight, Geist Mono (self-hosted)',
  '  Hosting: Cloudflare Pages',
].join('\n'));

// ---------- .well-known/security.txt ----------
const expires = new Date(Date.now() + 365 * 864e5).toISOString().replace(/\.\d+Z$/, 'Z');
write('.well-known/security.txt', [
  `Contact: ${SITE}/#contact`,
  `Contact: ${config.linkedinUrl}`,
  `Expires: ${expires}`,
  'Preferred-Languages: en',
  `Canonical: ${SITE}/.well-known/security.txt`,
].join('\n'));

console.log(`seo files: robots.txt, sitemap.xml (${pages.length} urls), llms.txt, llms-full.txt, humans.txt, .well-known/security.txt`);
