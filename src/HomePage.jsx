import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Root from './components/Root';
import { nav } from './data/profile';
import useActiveSection from './hooks/useActiveSection';
import { focusSection } from './lib/scroll';
import About from './sections/About';
import AiBuilds from './sections/AiBuilds';
import Contact from './sections/Contact';
import Experience from './sections/Experience';
import Footer from './sections/Footer';
import Hero from './sections/Hero';
import HowIWork from './sections/HowIWork';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import TechStrip from './sections/TechStrip';
import Testimonials from './sections/Testimonials';

const SECTION_IDS = nav.map(([id]) => id);

export default function HomePage() {
  const active = useActiveSection(SECTION_IDS);

  // A case-study link can load the home fragment before React renders its target.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (SECTION_IDS.includes(id)) focusSection(document.getElementById(id));
  }, []);

  return (
    <Root>
      <Navbar active={active} />
      <main id="main">
        <Hero />
        <TechStrip />
        <Projects />
        <Experience />
        <Skills />
        <AiBuilds />
        <HowIWork />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </Root>
  );
}
