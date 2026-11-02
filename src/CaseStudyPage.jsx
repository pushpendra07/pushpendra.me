import Navbar from './components/Navbar';
import Root from './components/Root';
import CaseStudy from './pages/CaseStudy';
import Footer from './sections/Footer';

export default function CaseStudyPage({ project }) {
  return (
    <Root>
      <Navbar active={project.kind === 'product' ? 'ai-builds' : 'projects'} base="/" />
      <CaseStudy project={project} />
      <Footer base="/" />
    </Root>
  );
}
