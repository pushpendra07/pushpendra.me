import Portrait from '../components/Portrait';
import TechIcon from '../components/TechIcon';
import { strengths } from '../data/profile';

export default function About() {
  return (
    <section id="about" className="about">
      <div className="about-grid">
        <Portrait />

        <div className="about-copy">
          <div className="heading" data-reveal="">
            <span className="eyebrow">ABOUT ME</span>
            <h2 className="h2">A commerce engineer who cares about what happens after launch.</h2>
          </div>
          <p className="about-p" data-reveal="">
            I&apos;m a Senior Software Developer with tech-lead responsibilities at Krish TechnoLabs, and an
            Adobe Certified Expert in Adobe Commerce development, available to join immediately. Over 12+ years I&apos;ve designed and optimised
            enterprise stores on Adobe Commerce Cloud, on-premise and Open Source — integrating SAP, Microsoft
            Dynamics AX, RabbitMQ, Talon.One, loyalty platforms, payment gateways, delivery partners and mobile
            apps, and leading large Magento 1 to Magento 2 migrations.
          </p>
          <p className="about-p" data-reveal="">
            <strong>How I work:</strong> extend the platform the way it was designed to be extended — service
            contracts, plugins and reusable module patterns over rewrites. I review code, mentor developers and
            own delivery from requirements through UAT to production release.
          </p>
          <div className="strengths">
            {strengths.map((sg) => (
              <div key={sg.n} className="strength" data-reveal="">
                <span className="strength-icon"><TechIcon name={sg.icon} color="currentColor" /></span>
                <span className="strength-title">{sg.title}</span>
                <span className="strength-text">{sg.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
