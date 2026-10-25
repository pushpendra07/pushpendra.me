import Counter from '../components/Counter';
import { stats } from '../data/profile';

export default function Stats() {
  return (
    <section className="stats-section" aria-label="At a glance">
      <div className="stats" data-reveal="">
        {stats.map((st) => (
          <div key={st.label} className="stat">
            <Counter to={st.count} suffix={st.suffix} className="stat-value" />
            <span className="stat-label">{st.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
