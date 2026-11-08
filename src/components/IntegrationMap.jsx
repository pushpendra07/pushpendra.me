import BrandIcon from './BrandIcon';

// Hub-and-spoke picture of a case study's stack: the platform in the middle, every system it
// works with around it, with data pulses running along the lines. Built from the study's own
// stack table, so it is always true to the write-up. Text is HTML over an SVG of lines, so it
// stays sharp; on phones the ring becomes a simple grid.
const W = 1000;
const H = 440;
const CX = W / 2;
const CY = H / 2;

export default function IntegrationMap({ center, sub, nodes, brandFor }) {
  const n = nodes.length;
  const pts = nodes.map((node, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return { ...node, x: CX + Math.cos(a) * 400, y: CY + Math.sin(a) * 165 };
  });
  return (
    <div className="imap" role="img" aria-label={`${center} connected to ${nodes.map((x) => x.name).join(', ')}`}>
      <svg className="imap-lines" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="imap-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#6b4dff" />
            <stop offset="1" stopColor="#ff6a3d" />
          </linearGradient>
        </defs>
        {pts.map((p, i) => (
          <g key={p.name}>
            <line x1={CX} y1={CY} x2={p.x} y2={p.y} className="imap-line" />
            <line x1={CX} y1={CY} x2={p.x} y2={p.y} className="imap-pulse" style={{ animationDelay: `${(i * 0.37) % 2.4}s` }} />
          </g>
        ))}
        <ellipse cx={CX} cy={CY} rx="400" ry="165" className="imap-orbit" />
      </svg>
      <div className="imap-hub">
        <span className="imap-hub-ring" aria-hidden="true" />
        <strong>{center}</strong>
        {sub && <small>{sub}</small>}
      </div>
      <ul className="imap-nodes">
        {pts.map((p, i) => {
          const b = brandFor(p.name);
          return (
            <li key={p.name} style={{ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%`, '--d': `${i * 60}ms` }}>
              <span className="imap-icon">{b ? <BrandIcon name={b} size={18} /> : <i>{p.name.slice(0, 1)}</i>}</span>
              <span><b>{p.name}</b>{p.group && <small>{p.group}</small>}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
