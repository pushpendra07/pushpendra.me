import { nav } from '../data/profile';
import { scrollToHash } from '../lib/scroll';

export default function Footer({ base = '' }) {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div className="footer-id">
          <img src="/favicon.svg" alt="" width="28" height="28" loading="lazy" />
          <div>
            <strong>Pushpendra Singh Sodha</strong>
            <span>Adobe Certified Expert · Magento 2 &amp; PHP developer</span>
          </div>
        </div>
        <ul className="footer-links">
          {nav.map(([id, label]) => (
            <li key={id}><a href={`${base}#${id}`} onClick={scrollToHash}>{label}</a></li>
          ))}
        </ul>
        <span className="footer-copy">© {new Date().getFullYear()} pushpendra.me</span>
      </div>
    </footer>
  );
}
