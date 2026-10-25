import { useEffect, useState } from 'react';
import { nav } from '../data/profile';
import { getLinks } from '../lib/links';
import { scrollToHash } from '../lib/scroll';

const NARROW = 980;

export default function Navbar({ active }) {
  const [narrow, setNarrow] = useState(() => window.innerWidth < NARROW);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { resume } = getLinks();

  useEffect(() => {
    const onResize = () => {
      const n = window.innerWidth < NARROW;
      setNarrow(n);
      if (!n) setMenuOpen(false);
    };
    const onScroll = () => setScrolled(window.scrollY > 30);
    onResize();
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

        {narrow ? (
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
        ) : (
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
        )}
      </nav>

      {narrow && menuOpen && (
        <div id="mobile-menu" className="mobile-menu">
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
      )}
    </header>
  );
}
