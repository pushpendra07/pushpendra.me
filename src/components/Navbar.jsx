import { useEffect, useState } from 'react';
import { nav } from '../data/profile';
import { getLinks } from '../lib/links';
import { scrollToHash } from '../lib/scroll';

// Below this width the CSS swaps the link list for the menu button.
const NARROW = 980;

export default function Navbar({ active }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { resume } = getLinks();

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= NARROW) setMenuOpen(false); };
    const onScroll = () => setScrolled(window.scrollY > 30);
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
      <nav className="nav" aria-label="Primary">
        <a href="#home" onClick={go} className="brand" aria-label="Pushpendra Singh — home">
          <span className="brand-mark">&lt;ps/&gt;</span>
          <span className="brand-name">Pushpendra Singh</span>
        </a>

        <div className="nav-right">
          <ul className="nav-links">
            {nav.map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
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
      </nav>

      <div id="mobile-menu" className={`mobile-menu${menuOpen ? ' is-open' : ''}`}>
        <ul>
          {nav.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} onClick={go} className={`mobile-link${active === id ? ' is-active' : ''}`}>
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
