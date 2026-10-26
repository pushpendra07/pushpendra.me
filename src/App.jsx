import CaseStudyPage from './CaseStudyPage';
import HomePage from './HomePage';
import { findProject } from './lib/projects';

// Server-side router for pre-rendering; the browser loads only the page it needs (main.jsx).
export default function App({ path = '/' }) {
  const project = findProject(path);
  return project ? <CaseStudyPage project={project} /> : <HomePage />;
}
