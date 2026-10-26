import Counter from '../components/Counter';
import TechIcon from '../components/TechIcon';
import { stats } from '../data/profile';
import { scrollToHash } from '../lib/scroll';

export default function Stats() {
  return (
    <section className="stats-section" aria-label="At a glance">
      <ul className="stats" data-reveal="">
        {stats.map((st) => (
          <li key={st.label}>
            <a href={st.href} onClick={scrollToHash} className="stat">
              <span className="stat-icon"><TechIcon name={st.icon} color="currentColor" /></span>
              <Counter to={st.count} suffix={st.suffix} className="stat-value" />
              <span className="stat-label">{st.label}</span>
              <span className="stat-note">{st.note}</span>
              <span className="stat-arrow" aria-hidden="true">→</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
