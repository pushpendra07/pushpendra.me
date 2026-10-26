import { renderToString } from 'react-dom/server';
import App from './App';
import { certs, config, education, experience, projects, skills } from './data/profile';
import { caseStudyPath, clientName, publicSlug } from './lib/projects';

const SITE = 'https://pushpendra.me';

export function render(path) {
  return renderToString(<App path={path} />);
}

// schema.org data so search engines can show the profile and case studies properly.
const person = {
  '@type': 'Person',
  '@id': `${SITE}/#person`,
  name: 'Pushpendra Singh',
  alternateName: 'Pushpendra Singh Sodha',
  jobTitle: 'Full-Stack Developer & Adobe Commerce Solution Architect',
  url: `${SITE}/`,
  image: `${SITE}/images/portrait-760.jpg`,
  email: `mailto:${config.email}`,
  sameAs: [config.linkedinUrl, config.githubUrl].filter(Boolean),
  address: { '@type': 'PostalAddress', addressLocality: 'Bikaner', addressRegion: 'Rajasthan', addressCountry: 'IN' },
  worksFor: { '@type': 'Organization', name: experience[0].employer.split(' · ')[0] },
  alumniOf: education.map((ed) => ({ '@type': 'CollegeOrUniversity', name: ed.school.split(',')[0] })),
  hasCredential: certs.filter((c) => c.meta === 'Adobe').map((c) => ({
    '@type': 'EducationalOccupationalCredential',
    name: `${c.title} — ${c.issuer}`,
    credentialCategory: 'certification',
    recognizedBy: { '@type': 'Organization', name: 'Adobe' },
  })),
  knowsAbout: skills.filter((sk) => !sk.learning).flatMap((sk) => sk.items).slice(0, 30),
};

export const homeJsonLd = { '@context': 'https://schema.org', ...person };

// Case-study pages to pre-render alongside the home page, with their <head> details.
export const caseStudies = projects.map((pj) => ({
  path: caseStudyPath(pj),
  title: `${clientName(pj)} case study — Pushpendra Singh`,
  description: pj.desc,
  image: `${SITE}/og/${publicSlug(pj)}.jpg`,
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${clientName(pj)}: ${pj.category} on ${pj.platform}`,
    description: pj.desc,
    url: `${SITE}${caseStudyPath(pj)}`,
    image: `${SITE}/og/${publicSlug(pj)}.jpg`,
    keywords: pj.tags.join(', '),
    author: { '@id': `${SITE}/#person`, '@type': 'Person', name: person.name, url: person.url },
  },
}));
