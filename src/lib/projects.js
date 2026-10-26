import { config, projects } from '../data/profile.js';

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// With config.anonymizeClients on, client names and case-study URLs use each
// project's neutral `alias` instead of the client's name.
export const clientName = (pj) => (config.anonymizeClients ? pj.alias : pj.title);
export const publicSlug = (pj) => (config.anonymizeClients ? slugify(pj.alias) : pj.slug);
export const caseStudyPath = (pj) => `/projects/${publicSlug(pj)}/`;

export function findProject(path) {
  const slug = path.match(/^\/projects\/([^/]+)\/?$/)?.[1];
  return projects.find((pj) => publicSlug(pj) === slug);
}
