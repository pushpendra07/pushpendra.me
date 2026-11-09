import BrandIcon from '../components/BrandIcon';
import { brands } from '../data/brands';
import { techStrip } from '../data/profile';

// What each tool does in the stores I build, shown under its name.
const ROLE = {
  adobe: 'Commerce cloud', magento: 'Platform', php: 'Language', graphql: 'Headless APIs',
  rabbitmq: 'Message queues', sap: 'ERP', redis: 'Cache & sessions', mysql: 'Database',
  newrelic: 'Monitoring', fastly: 'CDN & caching', react: 'Storefronts', docker: 'Environments',
};

// Endless strip of the stack, right under the hero, logos in their brand colours.
// Two copies make the loop seamless.
export default function TechStrip() {
  const items = techStrip.map((k) => (
    <li key={k} className="stack-item">
      <span className="stack-mark"><BrandIcon name={k} size={24} /></span>
      <span className="stack-text"><b>{brands[k].title}</b><small>{ROLE[k]}</small></span>
    </li>
  ));
  return (
    <section className="tech-strip" aria-label="The stack I ship with">
      <div className="wrap">
        <p className="stack-label"><span>The stack behind the stores</span></p>
      </div>
      <div className="marquee stack-marquee">
        <ul className="marquee-track">{items}</ul>
        <ul className="marquee-track" aria-hidden="true">{items}</ul>
      </div>
    </section>
  );
}
