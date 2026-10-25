import { useEffect, useState } from 'react';
import { snippets } from '../data/profile';
import useReducedMotion from '../hooks/useReducedMotion';

const COLORS = { k: '#c4b5fd', t: '#67e8f9', f: '#f0abfc', v: '#fcd34d', p: '#d8d5ea' };
const lineLengths = (s) => s.code.map((l) => l.reduce((a, [t]) => a + t.length, 0));
const totalChars = (s) => lineLengths(s).reduce((a, b) => a + b + 1, 0) - 1;

// Renders the first `n` characters of a snippet (newlines count as one character).
function renderCode(snip, n) {
  let left = n;
  const lines = [];
  for (let li = 0; li < snip.code.length; li += 1) {
    const parts = [];
    for (const [txt, c] of snip.code[li]) {
      if (left <= 0) break;
      const part = txt.slice(0, left);
      left -= part.length;
      parts.push(<span key={parts.length} style={{ color: COLORS[c] }}>{part}</span>);
    }
    lines.push(<span key={li}>{li > 0 && '\n'}{parts}</span>);
    if (left <= 0) break;
    left -= 1;
  }
  return lines;
}

export default function CodeTyper() {
  const reduce = useReducedMotion();
  const [si, setSi] = useState(0);
  const [n, setN] = useState(reduce ? Infinity : 0);

  useEffect(() => {
    if (reduce) { setSi(0); setN(Infinity); return undefined; }
    const s = snippets[si];
    const total = totalChars(s);
    let delay;
    if (n === 0 && si === 0) delay = 700;
    else if (n >= total) delay = 3200;
    else {
      // Pause briefly at the end of each line.
      let acc = 0;
      let endOfLine = false;
      for (const L of lineLengths(s)) {
        acc += L;
        if (n === acc) { endOfLine = true; break; }
        acc += 1;
      }
      delay = endOfLine ? 380 : 28 + Math.random() * 40;
    }
    const t = setTimeout(() => {
      if (n >= total) { setSi((i) => (i + 1) % snippets.length); setN(1); }
      else setN((x) => x + 1);
    }, delay);
    return () => clearTimeout(t);
  }, [n, si, reduce]);

  const snip = snippets[si];
  const gutter = Array.from({ length: 8 }, (_, i) => i + 1).join('\n');

  return (
    <div className="editor">
      <div className="editor-bar">
        <div className="traffic"><span /><span /><span /></div>
        <span className="editor-file">{snip.file}</span>
        <span className="editor-path">app/code/Vendor</span>
      </div>
      <div className="editor-body">
        <div className="gutter">{gutter}</div>
        <pre className="code">{renderCode(snip, n)}<span className="caret" /></pre>
      </div>
    </div>
  );
}
