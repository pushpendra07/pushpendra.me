import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { config, nav } from '../data/profile';
import { scrollToHash } from '../lib/scroll';
import ThemeSelect from './ThemeSelect';

// Below this width the CSS swaps the link list for the menu button.
const NARROW = 1080;

// `base` prefixes the section links on pages other than home, e.g. '/' → '/#projects'.
export default function Navbar({ active, base = '' }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= NARROW) setMenuOpen(false); };
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const go = (e) => scrollToHash(e, menuOpen ? () => flushSync(() => setMenuOpen(false)) : undefined);

  const onMenuKeyDown = (e) => {
    if (!menuOpen) return;
    const toggle = toggleRef.current;
    if (e.key === 'Escape') {
      e.preventDefault();
      setMenuOpen(false);
      toggle.focus();
    }
    if (e.key !== 'Tab') return;
    const last = menuRef.current.querySelector('.mobile-cta');
    if ((!e.shiftKey && e.target === last) || (e.shiftKey && e.target === toggle)) {
      e.preventDefault();
      (e.shiftKey ? last : toggle).focus();
    }
  };
  const headerClass = ['nav-header', (scrolled || menuOpen) && 'is-scrolled'].filter(Boolean).join(' ');

  return (
    <header className={headerClass} onKeyDown={onMenuKeyDown}>
      <a className="skip-link" href="#main">Skip to content</a>
      <nav className="nav" aria-label="Primary">
        <a href={`${base}#home`} onClick={go} className="brand">
          <img src="/favicon.svg" alt="" width="32" height="32" />
          <span className="brand-name">Pushpendra Singh Sodha</span>
          <span className="sr-only"> home</span>
        </a>

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

        <div className="nav-end">
          <span className="nav-status">
            <span className="live-dot" aria-hidden="true" />
            <b>Available now</b>
            <span className="nav-status-more"> · {config.location.split(',')[0]}</span>
          </span>
          <ThemeSelect />
          <a href={`${base}#contact`} onClick={go} className="pill pill-primary nav-cta">Hire me</a>
          <button
            type="button"
            ref={toggleRef}
            className="menu-toggle"
            onClick={() => {
              toggleRef.current.focus();
              setMenuOpen((o) => !o);
            }}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className={`burger${menuOpen ? ' is-open' : ''}`} aria-hidden="true"><i /><i /></span>
          </button>
        </div>
      </nav>

      <div ref={menuRef} id="mobile-menu" className="mobile-menu" hidden={!menuOpen}>
        <ul>
          {nav.map(([id, label], i) => (
            <li key={id} style={{ '--i': i }}>
              <a href={`${base}#${id}`} onClick={go} className={`mobile-link${active === id ? ' is-active' : ''}`}>
                {label}
              </a>
            </li>
          ))}
        </ul>
        <ThemeSelect labels />
        <a href={`${base}#contact`} onClick={go} className="pill pill-primary mobile-cta">Hire me</a>
      </div>
    </header>
  );
}
