import AskBox from '../components/AskBox';
import Portrait from '../components/Portrait';
import { heroChecks } from '../data/profile';
import { scrollToHash } from '../lib/scroll';

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <span className="tag">Adobe Certified Expert · 12+ years · 7 countries</span>
          {/* One h1 that carries the name, the role and the platform for search. */}
          <h1 className="hero-title">
            <span className="sr-only">Pushpendra Singh Sodha, Magento 2 and PHP developer. </span>
            I build Adobe Commerce stores that <span className="accent">scale with your business.</span>
          </h1>
          <p className="hero-lead">
            Magento 2 and PHP developer. I design the modules, ERP integrations and headless storefronts behind
            retailers in the UAE, Kuwait, Saudi Arabia, Lebanon, Australia, Russia and the USA.
          </p>
          <AskBox />
          <div className="ctas">
            <a href="#contact" onClick={scrollToHash} className="pill pill-primary">Discuss a role <span className="arr" aria-hidden="true">→</span></a>
            <a href="#projects" onClick={scrollToHash} className="pill pill-ghost">See my work</a>
          </div>
          <ul className="checks">
            {heroChecks.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </div>
        <Portrait />
      </div>
    </section>
  );
}
