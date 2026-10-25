import { useRef } from 'react';
import BackToTop from './components/BackToTop';
import Navbar from './components/Navbar';
import { nav } from './data/profile';
import useActiveSection from './hooks/useActiveSection';
import useReveal from './hooks/useReveal';
import About from './sections/About';
import Certifications from './sections/Certifications';
import Contact from './sections/Contact';
import Experience from './sections/Experience';
import Footer from './sections/Footer';
import Hero from './sections/Hero';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import Stats from './sections/Stats';

const SECTION_IDS = nav.map(([id]) => id);

export default function App() {
  const rootRef = useRef(null);
  const active = useActiveSection(SECTION_IDS);
  useReveal(rootRef);

  return (
    <div ref={rootRef} className="root">
      <Navbar active={active} />
      <main>
        <Hero />
        <Stats />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Certifications />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
