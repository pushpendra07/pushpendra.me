import { config, products, projects } from '../data/profile.js';

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const isProduct = (pj) => pj.kind === 'product';

// With config.anonymizeClients on, client names and case-study URLs use each
// project's neutral `alias` instead of the client's name. Products are my own, so never anonymised.
export const clientName = (pj) => (config.anonymizeClients && !isProduct(pj) ? pj.alias : pj.title);
export const publicSlug = (pj) => (config.anonymizeClients && !isProduct(pj) ? slugify(pj.alias) : pj.slug);
export const caseStudyPath = (pj) => `/${isProduct(pj) ? 'products' : 'projects'}/${publicSlug(pj)}/`;

// The list a case study belongs to (for previous/next links).
export const siblingsOf = (pj) => (isProduct(pj) ? products : projects);

export function findProject(path) {
  const [, type, slug] = path.match(/^\/(projects|products)\/([^/]+)\/?$/) ?? [];
  const list = type === 'products' ? products : type === 'projects' ? projects : [];
  return list.find((pj) => publicSlug(pj) === slug);
}
