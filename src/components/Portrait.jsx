import { config, heroChips } from '../data/profile';
import BrandIcon from './BrandIcon';

// Hero portrait in a gradient ring. It is the largest image above the fold, so it loads eagerly
// with high priority, in WebP with a JPEG fallback, at a fixed size so nothing shifts.
const SIZES = '(max-width: 900px) 220px, 340px';

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
        {heroChips.map(([icon, name, note], i) => (
          <span key={icon} className={`float-chip chip-${i + 1}`} aria-hidden="true">
            <BrandIcon name={icon} size={20} />
            <span><b>{name}</b><small>{note}</small></span>
          </span>
        ))}
      </div>
      <figcaption>
        <strong>Pushpendra Singh Sodha</strong>
        <span><b>12</b> client platforms in <b>7</b> countries</span>
      </figcaption>
    </figure>
  );
}
