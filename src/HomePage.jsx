import Navbar from './components/Navbar';
import Root from './components/Root';
import { nav } from './data/profile';
import useActiveSection from './hooks/useActiveSection';
import About from './sections/About';
import Certifications from './sections/Certifications';
import Contact from './sections/Contact';
import Experience from './sections/Experience';
import Footer from './sections/Footer';
import Hero from './sections/Hero';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import Stats from './sections/Stats';
import Testimonials from './sections/Testimonials';

const SECTION_IDS = nav.map(([id]) => id);

export default function HomePage() {
  const active = useActiveSection(SECTION_IDS);
  return (
    <Root>
      <Navbar active={active} />
      <main>
        <Hero />
        <Stats />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Certifications />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </Root>
  );
}
