import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { findProject } from './lib/projects';
import './styles.css';

// Each page type is its own chunk, so the home page never downloads case-study content.
const project = findProject(window.location.pathname);
const page = project
  ? import('./CaseStudyPage').then(({ default: CaseStudyPage }) => <CaseStudyPage project={project} />)
  : import('./HomePage').then(({ default: HomePage }) => <HomePage />);

page.then((element) => {
  const root = document.getElementById('root');
  const app = <StrictMode>{element}</StrictMode>;
  // Production HTML is pre-rendered (scripts/prerender.js); dev starts empty.
  if (root.hasChildNodes()) hydrateRoot(root, app);
  else createRoot(root).render(app);
});
