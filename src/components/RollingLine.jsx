import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../hooks/useReducedMotion';

// The headline's last line, rolling through what the stores do. The page is served with the
// first line only, so search engines and screen readers get one plain sentence; the other lines
// are added after load (never with reduced motion) and roll by CSS alone. All lines share one
// grid cell, so the headline's size never changes while they roll.
const LINES = [
  'that scale with your business.',
  'that sync with your ERP.',
  'that sell in seven countries.',
  'that run headless on GraphQL.',
];

export default function RollingLine() {
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const t = setTimeout(() => setRolling(true), 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <span className={`roll${rolling ? ' is-rolling' : ''}`} style={{ '--n': LINES.length }}>
      <span className="roll-item accent" style={{ '--i': 0 }}>{LINES[0]}</span>
      {rolling && LINES.slice(1).map((line, i) => (
        <span key={line} className="roll-item accent" style={{ '--i': i + 1 }} aria-hidden="true">{line}</span>
      ))}
    </span>
  );
}
