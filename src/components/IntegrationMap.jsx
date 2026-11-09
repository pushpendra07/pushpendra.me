import BrandIcon from './BrandIcon';

// A case study's stack as a picture: the platform as a hub, every system it works with around
// it, with data pulses running along the connections. Six layouts, so each case study can have
// its own (see data/caseLooks.js). Built from the study's own stack table, so it is always true
// to the write-up. Text is HTML over an SVG of lines, so it stays sharp; on phones every layout
// becomes the same simple grid.
const W = 1000;
const H = 440;

// Long notes in brackets stay in the stack table; the map shows just the name.
const short = (name) => name.replace(/\s*\([^)]{20,}\)$/, '');

const spread = (n, a, b) => Array.from({ length: n }, (_, i) => (n === 1 ? (a + b) / 2 : a + ((b - a) * i) / (n - 1)));

function layout(variant, n) {
  switch (variant) {
    case 'split': {
      const left = Math.ceil(n / 2);
      const ly = spread(left, 50, 390);
      const ry = spread(n - left, 50, 390);
      return {
        hub: [500, 220],
        pts: Array.from({ length: n }, (_, i) => (i < left ? [140, ly[i]] : [860, ry[i - left]])),
        line: (h, p) => `M${h[0]} ${h[1]} C${(h[0] + p[0]) / 2} ${h[1]}, ${(h[0] + p[0]) / 2} ${p[1]}, ${p[0]} ${p[1]}`,
        guide: <><path d="M140 20 V420" /><path d="M860 20 V420" /></>,
      };
    }
    case 'arc': {
      const hub = [500, 385];
      return {
        hub,
        pts: Array.from({ length: n }, (_, i) => {
          const a = Math.PI + (Math.PI * (i + 0.5)) / n;
          // Alternate between an outer and an inner arc so neighbours never collide.
          const [rx, ry] = n > 6 && i % 2 ? [255, 175] : [420, 330];
          return [hub[0] + Math.cos(a) * rx, hub[1] + Math.sin(a) * ry];
        }),
        line: (h, p) => `M${h[0]} ${h[1]} L${p[0]} ${p[1]}`,
        guide: <><path d="M80 385 A420 330 0 0 1 920 385" /><path d="M245 385 A255 175 0 0 1 755 385" /></>,
      };
    }
    case 'tree': {
      const per = n > 8 ? 4 : 3;
      const rows = Math.ceil(n / per);
      const ys = spread(rows, rows > 2 ? 200 : 230, 400);
      return {
        hub: [500, 60],
        pts: Array.from({ length: n }, (_, i) => {
          const r = Math.floor(i / per);
          const inRow = Math.min(per, n - r * per);
          return [spread(inRow, inRow === 1 ? 500 : 140, inRow === 1 ? 500 : 860)[i % per], ys[r]];
        }),
        // One trunk down to a bus, then a drop to each system, like an org chart.
        line: (h, p) => `M${h[0]} ${h[1]} V135 H${p[0]} V${p[1]}`,
        guide: <path d="M140 135 H860" />,
      };
    }
    case 'rings':
      return {
        hub: [500, 220],
        pts: Array.from({ length: n }, (_, i) => {
          const inner = i % 2 === 0;
          const a = -Math.PI / 2 + (i * 2 * Math.PI) / n + (inner ? 0 : Math.PI / n);
          return inner ? [500 + Math.cos(a) * 250, 220 + Math.sin(a) * 115] : [500 + Math.cos(a) * 430, 220 + Math.sin(a) * 190];
        }),
        line: (h, p) => `M${h[0]} ${h[1]} L${p[0]} ${p[1]}`,
        guide: <><ellipse cx="500" cy="220" rx="250" ry="115" /><ellipse cx="500" cy="220" rx="430" ry="190" /></>,
      };
    case 'fan': {
      const rows = Math.ceil(n / 2);
      const ys = spread(rows, 45, 395);
      const step = rows > 1 ? (ys[1] - ys[0]) / 2 : 0;
      return {
        hub: [140, 220],
        pts: Array.from({ length: n }, (_, i) => [i % 2 ? 860 : 580, ys[Math.floor(i / 2)] + (i % 2 ? step : 0)].map((v, k) => (k === 1 ? Math.min(v, 410) : v))),
        line: (h, p) => `M${h[0]} ${h[1]} C${h[0] + 220} ${h[1]}, ${p[0] - 240} ${p[1]}, ${p[0]} ${p[1]}`,
        guide: <path d="M140 20 V420" />,
      };
    }
    default:
      return {
        hub: [500, 220],
        pts: Array.from({ length: n }, (_, i) => {
          const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
          return [500 + Math.cos(a) * 400, 220 + Math.sin(a) * 165];
        }),
        line: (h, p) => `M${h[0]} ${h[1]} L${p[0]} ${p[1]}`,
        guide: <ellipse cx="500" cy="220" rx="400" ry="165" />,
      };
  }
}

export default function IntegrationMap({ center, sub, nodes, brandFor, variant = 'orbit' }) {
  const { hub, pts, line, guide } = layout(variant, nodes.length);
  const pct = ([x, y]) => ({ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` });
  return (
    <div className={`imap imap--${variant}`} role="img" aria-label={`${center} connected to ${nodes.map((x) => x.name).join(', ')}`}>
      <svg className="imap-lines" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="imap-g" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1000" y2="440">
            <stop offset="0" className="imap-stop-a" />
            <stop offset="1" className="imap-stop-b" />
          </linearGradient>
        </defs>
        {guide && <g className="imap-orbit">{guide}</g>}
        {pts.map((p, i) => {
          const d = line(hub, p);
          return (
            <g key={nodes[i].name} style={{ '--i': i }}>
              <path d={d} className="imap-line" />
              <path d={d} pathLength="100" className="imap-pulse" />
            </g>
          );
        })}
      </svg>
      <div className="imap-hub" style={{ '--hx-n': hub[0] / W, '--hy-n': hub[1] / H }}>
        <span className="imap-hub-ring" aria-hidden="true" />
        <strong>{center}</strong>
        {sub && <small>{sub}</small>}
      </div>
      <ul className="imap-nodes">
        {pts.map((p, i) => {
          const node = nodes[i];
          const b = brandFor(node.name);
          return (
            <li key={node.name} style={{ ...pct(p), '--d': `${i * 60}ms` }}>
              <span className="imap-icon">{b ? <BrandIcon name={b} size={18} /> : <i>{node.name.slice(0, 1)}</i>}</span>
              <span><b>{short(node.name)}</b>{node.group && <small>{node.group}</small>}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
