import { renderToString } from 'react-dom/server';
import App from './App';
import { certs, config, education, experience, products, projects, skills } from './data/profile';
import { caseStudyPath, clientName, publicSlug } from './lib/projects';

const SITE = 'https://pushpendra.me';

export function render(path) {
  return renderToString(<App path={path} />);
}

// schema.org data so search engines can show the profile and case studies properly.
const person = {
  '@type': 'Person',
  '@id': `${SITE}/#person`,
  name: 'Pushpendra Singh Sodha',
  alternateName: ['Pushpendra Singh', 'Pushpendra'],
  givenName: 'Pushpendra',
  additionalName: 'Singh',
  familyName: 'Sodha',
  jobTitle: 'Magento 2 & PHP Developer, Adobe Commerce Solution Architect',
  url: `${SITE}/`,
  image: `${SITE}/images/portrait-760.jpg`,
  email: `mailto:${config.email}`,
  sameAs: [config.linkedinUrl, config.githubUrl].filter(Boolean),
  address: { '@type': 'PostalAddress', addressLocality: 'Bikaner', addressRegion: 'Rajasthan', addressCountry: 'IN' },
  worksFor: { '@type': 'Organization', name: experience[0].employer.split(' · ')[0] },
  alumniOf: education.map((ed) => ({ '@type': 'CollegeOrUniversity', name: ed.school })),
  hasCredential: certs.filter((c) => c.meta === 'Adobe').map((c) => ({
    '@type': 'EducationalOccupationalCredential',
    name: `${c.title} — ${c.issuer}`,
    credentialCategory: 'certification',
    recognizedBy: { '@type': 'Organization', name: 'Adobe' },
    ...(c.verifyUrl && { url: c.verifyUrl }),
  })),
  knowsAbout: [...new Set(['Magento', 'Adobe Commerce', 'PHP', ...skills.filter((sk) => !sk.learning).flatMap((sk) => sk.items)])].slice(0, 30),
};

// ProfilePage marks the home page as this person's own profile (Google's profile-page rich result).
export const homeJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': `${SITE}/#profile`,
  url: `${SITE}/`,
  name: 'Pushpendra Singh Sodha — Magento 2 & Adobe Commerce Developer, PHP',
  mainEntity: person,
};

// Case-study pages to pre-render alongside the home page, with their <head> details.
const productPages = products.map((pj) => ({
  path: caseStudyPath(pj),
  title: `${pj.title}: product case study — Pushpendra Singh`,
  description: pj.desc,
  image: `${SITE}/og/${pj.slug}.jpg`,
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: pj.title,
    applicationCategory: pj.category,
    description: pj.desc,
    url: `${SITE}${caseStudyPath(pj)}`,
    image: `${SITE}/og/${pj.slug}.jpg`,
    keywords: pj.tags.join(', '),
    author: { '@id': `${SITE}/#person`, '@type': 'Person', name: person.name, url: person.url },
  },
}));

export const caseStudies = [...projects.map((pj) => ({
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
})), ...productPages];
