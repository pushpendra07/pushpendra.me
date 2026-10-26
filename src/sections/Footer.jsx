import { nav } from '../data/profile';
import { scrollToHash } from '../lib/scroll';

export default function Footer({ base = '' }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-id">
          <span className="footer-name">Pushpendra Singh</span>
          <span className="footer-role">Full-Stack Developer &amp; Adobe Commerce Solution Architect</span>
        </div>
        <ul className="footer-links">
          {nav.map(([id, label]) => (
            <li key={id}><a href={`${base}#${id}`} onClick={scrollToHash}>{label}</a></li>
          ))}
        </ul>
        <span className="footer-copy">© {new Date().getFullYear()} Pushpendra Singh · pushpendra.me</span>
      </div>
    </footer>
  );
}
