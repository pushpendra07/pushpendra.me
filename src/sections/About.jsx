import CodeEditor from '../components/CodeEditor';
import { codeBenefits } from '../data/profile';

export default function About() {
  return (
    <section id="about" className="section">
      <div className="wrap">
        <div className="split" data-reveal="">
          <CodeEditor />
          <div className="split-text">
            <span className="tag">About</span>
            <h2 className="h2">What my code <span className="accent">actually does</span> for a store</h2>
            <p>
              I&apos;m Pushpendra Singh Sodha, a Senior Software Developer with tech-lead responsibilities at Krish
              TechnoLabs and an Adobe Certified Expert in Adobe Commerce. I extend Magento the way it was designed
              to be extended, and I own delivery from requirements through UAT to production.
            </p>
            <ul className="benefits">
              {codeBenefits.map(([b, t]) => <li key={b}><b>{b}</b> {t}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
