import { useEffect, useRef, useState } from 'react';
import { nav } from '../data/profile';
import { getLinks } from '../lib/links';
import { scrollToHash } from '../lib/scroll';
import ThemeToggle from './ThemeToggle';

// Below this width the CSS swaps the link list for the menu button.
const NARROW = 980;

// `base` prefixes the section links on pages other than home, e.g. '/' → '/#about'.
export default function Navbar({ active, base = '' }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const barRef = useRef(null);
  const { resume } = getLinks();

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= NARROW) setMenuOpen(false); };
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    onScroll();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const go = (e) => scrollToHash(e, () => setMenuOpen(false));
  const headerClass = ['nav-header', (scrolled || menuOpen) && 'is-solid', scrolled && 'is-scrolled']
    .filter(Boolean).join(' ');

  return (
    <header className={headerClass}>
      <span ref={barRef} className="nav-progress" aria-hidden="true" />
      <nav className="nav" aria-label="Primary">
        <a href={`${base}#home`} onClick={go} className="brand">
          <span className="brand-mark" aria-hidden="true">&lt;ps/&gt;</span>
          <span className="brand-name">Pushpendra Singh</span>
          <span className="sr-only"> — home</span>
        </a>

        <div className="nav-end">
          <div className="nav-right">
            <ul className="nav-links">
              {nav.map(([id, label]) => (
                <li key={id}>
                  <a
                    href={`${base}#${id}`}
                    onClick={go}
                    className={`nav-link${active === id ? ' is-active' : ''}`}
                    aria-current={active === id ? 'true' : undefined}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <a href={resume.href} download={resume.download} onClick={go} className="btn-resume">
              {resume.label}
            </a>
          </div>

          <ThemeToggle />

          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '≡'}
          </button>
        </div>
      </nav>

      <div id="mobile-menu" className={`mobile-menu${menuOpen ? ' is-open' : ''}`}>
        <ul>
          {nav.map(([id, label]) => (
            <li key={id}>
              <a href={`${base}#${id}`} onClick={go} className={`mobile-link${active === id ? ' is-active' : ''}`}>
                {label}
              </a>
            </li>
          ))}
        </ul>
        <a href={resume.href} download={resume.download} onClick={go} className="mobile-resume">
          {resume.label}
        </a>
      </div>
    </header>
  );
}
