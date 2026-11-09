// A project's key points: what kind of work it was (Built, Integrated, Led…), the thing itself
// in bold, then the detail. Plain strings still render, as a simple line.
export default function Points({ items }) {
  if (!items?.length) return null;
  return (
    <ul className="kp">
      {items.map((it) => {
        if (typeof it === 'string') return <li key={it}><span>{it}</span></li>;
        const [kind, lead, rest] = it;
        return (
          <li key={lead}>
            <em className={`kp-kind kp-kind--${kind.toLowerCase()}`}>{kind}</em>
            <span><b>{lead}</b>{rest}</span>
          </li>
        );
      })}
    </ul>
  );
}
