// Animated SVG diagrams for the case studies. Moving "packets" use SMIL
// <animateMotion> and are drawn before the boxes, so they pass behind them like
// data flowing through. `.flow-anim` elements are hidden for reduced motion.

function Packet({ path, dur, begin = '0s', className = 'flow-dot', r = 4 }) {
  return (
    <circle r={r} className={`flow-anim ${className}`}>
      <animateMotion path={path} dur={dur} begin={begin} repeatCount="indefinite" />
    </circle>
  );
}

function Arrow({ id, className = 'dg-arrow' }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10z" className={className} />
    </marker>
  );
}

function GlowFilter({ id }) {
  return (
    <filter id={id} x="-200%" y="-200%" width="500%" height="500%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
  );
}

// Multi-line SVG label: "\n" in the text starts a new line, centred on y.
function Label({ x, y, text, className, lineHeight = 15, anchor = 'middle' }) {
  const lines = text.split('\n');
  const top = y - ((lines.length - 1) * lineHeight) / 2;
  return (
    <text x={x} y={top} className={className} textAnchor={anchor}>
      {lines.map((line, i) => <tspan key={line} x={x} dy={i ? lineHeight : 0}>{line}</tspan>)}
    </text>
  );
}

// Evenly spaced centres for n boxes between top and bottom.
const spread = (n, top, bottom, h) => (n === 1
  ? [(top + bottom) / 2]
  : Array.from({ length: n }, (_, i) => top + h / 2 + (i * (bottom - top - h)) / (n - 1)));

// Channels → [inbound bar] → core + modules → [outbound bar] → systems.
export function ArchitectureDiagram({ data, id }) {
  const [colA, colB, colC] = data.columns ?? ['Channels', 'Platform', 'Business systems'];
  const top = 60;
  const bottom = 336;
  const mid = (top + bottom) / 2;
  const chY = spread(data.channels.length, top, bottom, 56);
  const sysH = Math.min(56, (bottom - top - (data.systems.length - 1) * 10) / data.systems.length);
  const sysY = spread(data.systems.length, top, bottom, sysH);
  const inX = data.inbound ? 256 : 215;
  const outX = data.outbound ? 644 : 643;
  const label = `Architecture: ${data.channels.join(', ')} reach ${data.core.join(' ')}`
    + `${data.inbound ? ` through ${data.inbound}` : ''}; it connects to ${data.systems.map(([t]) => t).join(', ')}`
    + `${data.outbound ? ` through ${data.outbound}` : ''}.`;

  return (
    <svg className="dg dg--wide" viewBox="0 0 1000 400" role="img" aria-label={label}>
      <defs>
        <Arrow id={`${id}-arrow`} />
        <GlowFilter id={`${id}-glow`} />
        <linearGradient id={`${id}-core`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#5b21b6" />
        </linearGradient>
      </defs>

      <text x="10" y="34" className="dg-col">{colA}</text>
      <text x="330" y="34" className="dg-col">{colB}</text>
      <text x="716" y="34" className="dg-col">{colC}</text>

      <g className="dg-wire" markerEnd={`url(#${id}-arrow)`}>
        {data.inbound
          ? <>{chY.map((y) => <path key={y} d={`M180 ${y} H226`} />)}<path d={`M282 ${mid} H326`} /></>
          : chY.map((y) => <path key={y} d={`M180 ${y} H${inX} V${mid} H326`} />)}
        {data.outbound
          ? <><path d={`M570 ${mid} H614`} />{sysY.map((y) => <path key={y} d={`M670 ${y} H712`} />)}</>
          : sysY.map((y) => <path key={y} d={`M570 ${mid} H${outX} V${y} H712`} />)}
      </g>

      <g filter={`url(#${id}-glow)`}>
        {chY.map((y, i) => (
          <Packet key={y} path={`M180 ${y} H${inX} V${mid} H330`} dur="2.4s" begin={`${i * 0.8}s`} />
        ))}
        {sysY.map((y, i) => (
          <Packet key={y} path={`M570 ${mid} H${outX} V${y} H716`} dur="2.4s" begin={`${1.2 + i * 0.6}s`} className="flow-dot flow-dot--violet" />
        ))}
      </g>

      {data.channels.map((ch, i) => (
        <g key={ch}>
          <rect x="10" y={chY[i] - 28} width="170" height="56" rx="12" className="dg-box" />
          <text x="95" y={chY[i] + 5} className="dg-title" textAnchor="middle">{ch}</text>
        </g>
      ))}

      {data.inbound && (
        <>
          <rect x="230" y={top} width="52" height={bottom - top} rx="12" className="dg-bar dg-bar--cyan" />
          <text className="dg-bar-label dg-bar-label--cyan" transform={`translate(261 ${mid}) rotate(-90)`} textAnchor="middle">{data.inbound}</text>
        </>
      )}

      <rect x="330" y={top} width="240" height={bottom - top} rx="18" fill={`url(#${id}-core)`} className="dg-core" />
      <text x="450" y="100" className="dg-core-title" textAnchor="middle">{data.core[0]}</text>
      <text x="450" y="124" className="dg-core-sub" textAnchor="middle">{data.core[1]}</text>
      {data.modules.map((m, i) => (
        <g key={m}>
          <rect x="350" y={148 + i * 44} width="200" height="36" rx="9" className="dg-pill" />
          <text x="450" y={171 + i * 44} className="dg-pill-text" textAnchor="middle">{m}</text>
        </g>
      ))}

      {data.outbound && (
        <>
          <rect x="618" y={top} width="52" height={bottom - top} rx="12" className="dg-bar" />
          <text className="dg-bar-label" transform={`translate(649 ${mid}) rotate(-90)`} textAnchor="middle">{data.outbound}</text>
        </>
      )}

      {data.systems.map(([title, sub], i) => (
        <g key={title}>
          <rect x="716" y={sysY[i] - sysH / 2} width="274" height={sysH} rx="12" className="dg-box" />
          <text x="736" y={sysY[i] - 3} className="dg-title">{title}</text>
          <text x="736" y={sysY[i] + 14} className="dg-sub">{sub}</text>
        </g>
      ))}

      {[[10, 272], [330, 240], [618, 372]].map(([x, w], i) => (
        <g key={x}>
          <rect x={x} y="356" width={w} height="34" rx="17" className={`dg-note dg-note--${i}`} />
          <text x={x + w / 2} y="378" className={`dg-note-text dg-note-text--${i}`} textAnchor="middle">{data.notes[i]}</text>
        </g>
      ))}
    </svg>
  );
}

// Customer address → polygon → zone → the store (source) that fulfils it.
export function ZoneDiagram() {
  return (
    <svg className="dg" viewBox="0 0 520 330" role="img"
      aria-label="A source store contains a zone, which contains two map-drawn polygons; a customer inside one polygon is matched to the store.">
      <rect x="10" y="10" width="500" height="310" rx="16" className="zone-source" />
      <text x="30" y="40" className="zone-label zone-label--source">SOURCE · store that fulfils</text>
      <rect x="36" y="62" width="448" height="236" rx="14" className="zone-zone" />
      <text x="56" y="90" className="zone-label zone-label--zone">ZONE · delivery modes &amp; cutoffs</text>

      <polygon points="86,140 196,122 246,196 178,262 96,244" className="zone-poly" />
      <text x="164" y="200" className="zone-label zone-label--poly" textAnchor="middle">Polygon</text>
      <polygon points="282,130 378,120 434,196 346,268 290,236" className="zone-poly" />
      <text x="392" y="196" className="zone-label zone-label--poly" textAnchor="middle">Polygon</text>

      <path d="M336 168 C 380 120, 430 80, 462 46" className="zone-route" />
      <Packet path="M336 168 C 380 120, 430 80, 462 46" dur="2.2s" className="zone-dot" r={4} />

      <rect x="440" y="22" width="56" height="28" rx="8" className="zone-store" />
      <text x="468" y="41" className="zone-store-text" textAnchor="middle">Store</text>

      <circle cx="336" cy="168" r="6" className="zone-pin-ring flow-anim">
        <animate attributeName="r" values="6;22" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values=".6;0" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="336" cy="168" r="6" className="zone-pin" />
      <path d="M342 174 L398 252" className="zone-leader" />
      <text x="402" y="266" className="zone-small">customer</text>
    </svg>
  );
}

// A decision between two paths; packets alternate between yes and no.
// With `result`, both paths meet in one outcome box.
export function BranchDiagram({ d, id }) {
  const end = d.result ? 'H471' : '';
  const yes = `M112 110 H155 L205 72 V44 H400 ${d.result ? `${end} V88` : ''}`;
  const no = `M112 110 H155 L205 148 V176 H400 ${d.result ? `${end} V132` : ''}`;
  const boxX = d.result ? 290 : 330;
  const boxW = d.result ? 110 : 150;
  const yesPath = d.result ? yes : `M112 110 H155 L205 72 V44 H${boxX + boxW / 2}`;
  const noPath = d.result ? no : `M112 110 H155 L205 148 V176 H${boxX + boxW / 2}`;
  return (
    <svg className="dg" viewBox="0 0 520 220" role="img"
      aria-label={`${d.input}, then: ${d.question.join(' ')} Yes leads to ${d.yes}; no leads to ${d.no}${d.result ? `; both give ${d.result.join(' ')}` : ''}.`}>
      <defs>
        <Arrow id={`${id}-arrow`} />
        <GlowFilter id={`${id}-glow`} />
      </defs>
      <g className="dg-wire" markerEnd={`url(#${id}-arrow)`}>
        <path d="M112 110 H150" />
        <path d={`M205 72 V44 H${boxX - 4}`} />
        <path d={`M205 148 V176 H${boxX - 4}`} />
        {d.result && <><path d="M400 44 H471 V84" /><path d="M400 176 H471 V136" /></>}
      </g>
      <text x="216" y="36" className="dg-sub">yes</text>
      <text x="216" y="196" className="dg-sub">no</text>

      <g filter={`url(#${id}-glow)`}>
        <circle r="4.5" className="flow-anim flow-dot flow-dot--violet">
          <animateMotion path={yesPath} dur="5s" repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;.5;1" calcMode="linear" />
          <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;.5;.51;1" dur="5s" repeatCount="indefinite" />
        </circle>
        <circle r="4.5" className="flow-anim flow-dot">
          <animateMotion path={noPath} dur="5s" repeatCount="indefinite" keyPoints="0;0;1" keyTimes="0;.5;1" calcMode="linear" />
          <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;.5;.51;1" dur="5s" repeatCount="indefinite" />
        </circle>
      </g>

      <rect x="8" y="90" width="104" height="40" rx="10" className="dg-box" />
      <text x="60" y="115" className="dg-title dg-title--sm" textAnchor="middle">{d.input}</text>
      <polygon points="205,72 255,110 205,148 155,110" className="sw-decision" />
      <Label x={205} y={113} text={d.question.join('\n')} className="sw-decision-text" lineHeight={14} />
      <rect x={boxX} y="24" width={boxW} height="40" rx="10" className="sw-box sw-box--violet" />
      <text x={boxX + boxW / 2} y="49" className="dg-title dg-title--sm" textAnchor="middle">{d.yes}</text>
      <rect x={boxX} y="156" width={boxW} height="40" rx="10" className="sw-box sw-box--cyan" />
      <text x={boxX + boxW / 2} y="181" className="dg-title dg-title--sm" textAnchor="middle">{d.no}</text>
      {d.result && (
        <>
          <rect x="426" y="88" width="90" height="44" rx="10" className="sw-box sw-box--green" />
          <Label x={471} y={114} text={d.result.join('\n')} className="sw-result" lineHeight={16} />
        </>
      )}
    </svg>
  );
}

// Nodes in a row with packets moving left to right; `both` adds a return
// packet, `loop` sends the packet round a retry loop under one node.
export function PipelineDiagram({ d, id }) {
  const n = d.nodes.length;
  const gap = n > 3 ? 30 : 46;
  const w = (500 - gap * (n - 1)) / n;
  const xs = d.nodes.map((_, i) => 10 + i * (w + gap));
  const cy = 70;
  const h = 58;
  const height = d.loop ? 210 : 140;
  const cx = (i) => xs[i] + w / 2;
  const kind = (i) => {
    if (d.loop && i === d.loop.at) return 'loop';
    if (i === 0) return 'start';
    return i === n - 1 ? 'end' : 'mid';
  };

  let path = `M${cx(0)} ${cy}`;
  if (d.loop) {
    const lx = cx(d.loop.at);
    path += ` H${lx} C ${lx - 52} ${cy + 118}, ${lx + 52} ${cy + 118}, ${lx} ${cy}`;
  }
  path += ` H${cx(n - 1)}`;
  const back = `M${cx(n - 1)} ${cy + 12} H${cx(0)}`;
  const dur = `${1 + n * 0.9}s`;

  return (
    <svg className="dg" viewBox={`0 0 520 ${height}`} role="img"
      aria-label={`${d.nodes.map((s) => s.replace('\n', ' ')).join(' → ')}${d.both ? ', in both directions' : ''}${d.loop ? `; ${d.loop.label}` : ''}.`}>
      <defs>
        <Arrow id={`${id}-arrow`} className="dg-arrow dg-arrow--cyan" />
        <GlowFilter id={`${id}-glow`} />
      </defs>
      <g className="dg-wire dg-wire--cyan" markerEnd={`url(#${id}-arrow)`} markerStart={d.both ? `url(#${id}-arrow)` : undefined}>
        {xs.slice(1).map((x, i) => <path key={x} d={`M${xs[i] + w + (d.both ? 4 : 0)} ${cy} H${x - 4}`} />)}
      </g>
      {d.loop && (
        <g className="dg-wire dg-wire--cyan" markerEnd={`url(#${id}-arrow)`}>
          <path d={`M${cx(d.loop.at) - 16} ${cy + h / 2 + 2} C ${cx(d.loop.at) - 42} ${cy + 96}, ${cx(d.loop.at) + 42} ${cy + 96}, ${cx(d.loop.at) + 16} ${cy + h / 2 + 4}`} />
        </g>
      )}
      <g filter={`url(#${id}-glow)`}>
        <Packet path={path} dur={dur} className="flow-dot" r={4.5} />
        {d.both && <Packet path={back} dur={dur} begin={`${(1 + n * 0.9) / 2}s`} className="flow-dot flow-dot--violet" r={4} />}
      </g>
      {d.nodes.map((label, i) => (
        <g key={label}>
          <rect x={xs[i]} y={cy - h / 2} width={w} height={h} rx="14" className={`pl-node pl-node--${kind(i)}`} />
          <Label x={cx(i)} y={cy + 4} text={label} className="pl-text" lineHeight={15} />
        </g>
      ))}
      {d.loop && <text x={cx(d.loop.at)} y={height - 12} className="pl-caption" textAnchor="middle">{d.loop.label}</text>}
    </svg>
  );
}
