// Small line glyphs for the hero tech chips. Generic symbols, not brand logos.
const GLYPHS = {
  bag: <><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18M16 10a4 4 0 0 1-8 0" /></>,
  card: <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20M6 15h4" /></>,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
  globe: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" /></>,
  award: <><circle cx="12" cy="8" r="6" /><path d="M8.2 13 7 22l5-3 5 3-1.2-9" /></>,
  users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  star: <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />,
  cube: <><path d="M21 16V8l-9-5-9 5v8l9 5 9-5z" /><path d="m3.3 7 8.7 5 8.7-5M12 22V12" /></>,
  code: <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />,
  graph: <><path d="M12 2 21 7v10l-9 5-9-5V7z" /><circle cx="12" cy="2.5" r="1.4" /><circle cx="21" cy="7" r="1.4" /><circle cx="21" cy="17" r="1.4" /><circle cx="12" cy="21.5" r="1.4" /><circle cx="3" cy="17" r="1.4" /><circle cx="3" cy="7" r="1.4" /><path d="M12 2.5 3 17h18z" /></>,
  plug: <><path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0z" /><path d="M12 18v4" /></>,
  zap: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />,
  layers: <><path d="M12 2 2 7l10 5 10-5-10-5z" /><path d="m2 17 10 5 10-5M2 12l10 5 10-5" /></>,
  db: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></>,
  pulse: <path d="M2 12h4l3-8 4 16 3-8h6" />,
  gauge: <><path d="M12 14 16 9" /><path d="M3.3 19a10 10 0 1 1 17.4 0" /><circle cx="12" cy="14" r="1.5" /></>,
  queue: <><rect x="3" y="4" width="18" height="4" rx="1" /><rect x="3" y="10" width="18" height="4" rx="1" /><rect x="3" y="16" width="18" height="4" rx="1" /></>,
  sync: <><path d="M21 12a9 9 0 0 1-15.5 6.2L3 16" /><path d="M3 12a9 9 0 0 1 15.5-6.2L21 8" /><path d="M21 3v5h-5M3 21v-5h5" /></>,
  truck: <><path d="M1 4h14v12H1z" /><path d="M15 8h4l3 3v5h-7z" /><circle cx="5.5" cy="18.5" r="2" /><circle cx="18.5" cy="18.5" r="2" /></>,
  cloud: <path d="M17.5 19H8a6 6 0 1 1 1.3-11.9A7 7 0 0 1 22 12.5 4.5 4.5 0 0 1 17.5 19z" />,
  branch: <><circle cx="6" cy="5" r="2.5" /><circle cx="6" cy="19" r="2.5" /><circle cx="18" cy="8" r="2.5" /><path d="M6 7.5v9M18 10.5c0 4-6 3-11 6.5" /></>,
  spark: <path d="M12 2v6M12 16v6M2 12h6M16 12h6M4.9 4.9l4.2 4.2M14.9 14.9l4.2 4.2M4.9 19.1l4.2-4.2M14.9 9.1l4.2-4.2" />,
  chat: <><path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z" /><path d="M8 11h.01M12 11h.01M16 11h.01" /></>,
  search: <><circle cx="11" cy="11" r="7.5" /><path d="m21 21-4.6-4.6" /></>,
  braces: <path d="M8 3H7a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1M16 3h1a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2 2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-1" />,
  atom: <><circle cx="12" cy="12" r="1.6" /><ellipse cx="12" cy="12" rx="10" ry="4" /><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" /></>,
};

export default function TechIcon({ name, color }) {
  if (name === 'js') {
    return (
      <svg className="tech-icon" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="4" fill={color} />
        <text x="12.5" y="17.5" textAnchor="middle" fontSize="10" fontWeight="700" fill="#14121f" fontFamily="var(--font-body)">JS</text>
      </svg>
    );
  }
  return (
    <svg className="tech-icon" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {GLYPHS[name]}
    </svg>
  );
}
