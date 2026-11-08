import { howIWork } from '../data/profile';

export default function HowIWork() {
  return (
    <section id="how" className="section section-center">
      <div className="wrap">
        <span className="tag">How I work</span>
        <h2 className="h2" data-reveal="">Three steps, <span className="accent">from first call to production</span></h2>
        <ol className="steps">
          {howIWork.map((s, i) => (
            <li key={s.title} data-reveal="" data-delay={i * 120}>
              <span className="step-n" aria-hidden="true">{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <div className="step-ex"><span>Example</span>{s.example}</div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
