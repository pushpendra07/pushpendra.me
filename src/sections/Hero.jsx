import { useRef } from 'react';
import HeroCanvas from '../components/HeroCanvas';
import HeroVisual from '../components/HeroVisual';
import { externalProps, getLinks } from '../lib/links';
import { scrollToHash } from '../lib/scroll';

export default function Hero() {
  const heroRef = useRef(null);
  const { linkedin, github, emailHref, email, resume } = getLinks();
  const socials = [
    { label: 'in/LinkedIn', title: linkedin.external ? 'LinkedIn' : 'LinkedIn URL not set yet', ...linkedin },
    github.external && { label: 'gh/GitHub', title: 'GitHub', ...github },
    { label: '@/Email', title: email || 'Email not set yet', href: emailHref, external: false },
  ].filter(Boolean);

  return (
    <section id="home" ref={heroRef} className="hero">
      <div className="hero-bg" aria-hidden="true">
        <div className="blob blob--1" />
        <div className="blob blob--2" />
        <div className="blob blob--3" />
        <HeroCanvas heroRef={heroRef} />
        <div className="hero-fade" />
      </div>

      <div className="hero-grid">
        <div className="hero-copy">
          <div className="availability">
            <span className="availability-dot" />
            Available immediately · open to senior Adobe Commerce roles
          </div>
          <div className="heading">
            <p className="hero-hi">Hi, I&apos;m Pushpendra Singh.</p>
            <h1 className="hero-title">
              I build <span className="gradient-text">scalable commerce</span> experiences.
            </h1>
            <p className="hero-role">Adobe Certified Expert · Full-Stack Developer &amp; Adobe Commerce Solution Architect</p>
          </div>
          <p className="hero-lead">
            12+ years building enterprise Adobe Commerce platforms for retailers across the UAE, Kuwait, Saudi
            Arabia, Lebanon, Australia, Russia and the USA — custom modules, ERP integrations, headless
            commerce and performance work that holds up in production.
          </p>
          <div className="hero-ctas">
            <a href="#contact" onClick={scrollToHash} className="btn-primary">
              Let&apos;s Talk <span aria-hidden="true">→</span>
            </a>
            <a href={resume.href} download={resume.download} onClick={scrollToHash} className="btn-ghost">
              {resume.heroLabel}
            </a>
          </div>
          <ul className="socials">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  onClick={scrollToHash}
                  title={s.title}
                  className="social"
                  {...externalProps(s.external)}
                >
                  {/* The "in/" style prefix is decoration; screen readers just hear the name. */}
                  <span aria-hidden="true">{s.label.split('/')[0]}/</span>{s.label.split('/')[1]}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <HeroVisual heroRef={heroRef} />
      </div>
    </section>
  );
}
