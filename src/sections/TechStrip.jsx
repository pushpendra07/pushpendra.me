import BrandIcon from '../components/BrandIcon';
import { brands } from '../data/brands';
import { techStrip } from '../data/profile';

// Endless strip of the main tools, right under the hero. Two copies make the loop seamless.
export default function TechStrip() {
  const items = techStrip.map((k) => <li key={k}><BrandIcon name={k} size={22} />{brands[k].title}</li>);
  return (
    <section className="tech-strip" aria-label="Technologies I ship with">
      <p className="tech-label">Shipping with</p>
      <div className="marquee">
        <ul className="marquee-track">{items}</ul>
        <ul className="marquee-track" aria-hidden="true">{items}</ul>
      </div>
    </section>
  );
}
