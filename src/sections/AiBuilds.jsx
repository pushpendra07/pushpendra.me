import { MiniScene, sceneTitle } from '../components/ProjectScene';
import { products } from '../data/profile';
import { caseStudyPath } from '../lib/projects';

// My own products, shown like results: the scene, the biggest number, then the product.
export default function AiBuilds() {
  return (
    <section id="ai-builds" className="section">
      <div className="wrap">
        <span className="tag">AI builds · my own products</span>
        <h2 className="h2" data-reveal="">Full products I built <span className="accent">with AI coding agents</span></h2>
        <p className="sub" data-reveal="">
          Not client work. I set the product and the architecture, then reviewed and tested every module the
          agents wrote. Each one opens a full case study.
        </p>

        <div className="rgrid">
          {products.map((pj, i) => {
            const [lead, ...more] = pj.metrics ?? [];
            return (
              <article key={pj.slug} className="rcard" data-reveal="" data-delay={(i % 2) * 80}>
                <div className="rcard-art">
                  <MiniScene slug={pj.slug} />
                  <span className="rcard-badge">Built with AI</span>
                </div>
                <div className="rcard-body">
                  {lead && (
                    <p className="rcard-claim"><strong data-count="">{lead.value}</strong> {lead.label}</p>
                  )}
                  <p className="rcard-quote">{sceneTitle(pj.slug)}. {pj.desc}</p>
                  {more.length > 0 && (
                    <dl className="rcard-more">
                      {more.map((m) => <div key={m.label}><dd data-count="">{m.value}</dd><dt>{m.label}</dt></div>)}
                    </dl>
                  )}
                  <footer className="rcard-foot">
                    <span className={`rcard-mark scene--${pj.slug}`} aria-hidden="true">{pj.title.slice(0, 1)}</span>
                    <span className="rcard-who">
                      <b><a href={caseStudyPath(pj)} className="card-link">{pj.title}</a></b>
                      {pj.category}
                    </span>
                    <span className="go" aria-hidden="true">{pj.demoUrl ? 'Case study and demo' : 'Case study'} <em>→</em></span>
                  </footer>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
