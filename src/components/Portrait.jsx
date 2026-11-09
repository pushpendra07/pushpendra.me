import { config, heroChips, projects } from '../data/profile';
import { scrollToHash } from '../lib/scroll';
import { FLAGS } from './Place';
import BrandIcon from './BrandIcon';

// Hero portrait in a gradient ring. It is the largest image above the fold, so it loads eagerly
// with high priority, in WebP with a JPEG fallback, at a fixed size so nothing shifts.
const SIZES = '(max-width: 900px) 220px, 340px';

// Countries the client work was for, in the order they first appear in the project list.
const countries = Object.keys(FLAGS)
  .map((c) => [c, projects.findIndex((pj) => (pj.place || '').includes(c))])
  .filter(([, i]) => i >= 0).sort((a, b) => a[1] - b[1]).map(([c]) => c);

export default function Portrait() {
  const p = config.portrait;
  return (
    <figure className="me">
      <div className="ring">
        <span className="ring-spin" aria-hidden="true" />
        <picture>
          <source type="image/webp" srcSet={`${p}-400.webp 400w, ${p}-480.webp 480w, ${p}-600.webp 600w, ${p}-760.webp 760w`} sizes={SIZES} />
          <img
            src={`${p}-480.jpg`}
            srcSet={`${p}-400.jpg 400w, ${p}-480.jpg 480w, ${p}-600.jpg 600w, ${p}-760.jpg 760w`}
            sizes={SIZES}
            width="480"
            height="576"
            alt="Pushpendra Singh Sodha, smiling, in a navy blazer"
            fetchpriority="high"
            decoding="async"
          />
        </picture>
        <span className="ring-badge"><BrandIcon name="adobe" size={18} />Certified Expert</span>
        {/* The main tools orbit the photo, outside the ring so they never cover it. */}
        <span className="orbit" aria-hidden="true">
          {heroChips.map(([icon, name, note], i) => (
            <span key={icon} className="orbit-item" style={{ '--a': `${-90 + (i * 360) / heroChips.length}deg` }} data-name={`${name} · ${note}`}>
              <span className="orbit-bubble"><BrandIcon name={icon} size={22} /></span>
            </span>
          ))}
        </span>
      </div>
      <figcaption>
        <strong>Pushpendra Singh Sodha</strong>
        <a href="#projects" onClick={scrollToHash} className="reach" aria-label={`Built for retailers in ${countries.join(', ')}. See the projects.`}>
          <span className="reach-flags" aria-hidden="true">
            {countries.map((c, i) => <span key={c} title={c} style={{ '--i': i }}>{FLAGS[c]}</span>)}
          </span>
          <span className="reach-text" aria-hidden="true">
            <b>Retailers worldwide</b>
            <small>Middle East to the US</small>
          </span>
          <span className="reach-go" aria-hidden="true">→</span>
        </a>
      </figcaption>
    </figure>
  );
}
