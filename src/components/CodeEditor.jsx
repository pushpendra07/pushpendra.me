import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../hooks/useReducedMotion';

// Two real snippets, split into highlight tokens: k keyword, t type, f function, v variable, c comment.
const SNIPPETS = [
  ['OrderExportConsumer.php', [
    ['class ', 'k'], ['OrderExportConsumer', 't'], ['\n{\n    ', ''], ['public function ', 'k'], ['process', 'f'], ['(', ''],
    ['OrderInterface ', 't'], ['$order', 'v'], ['): ', ''], ['void', 't'], ['\n    {\n        ', ''],
    ['// queued, logged, retried\n        ', 'c'], ['$this', 'v'], ['->erp->', ''], ['export', 'f'], ['($order);\n    }\n}', ''],
  ]],
  ['cart.graphql', [
    ['query ', 'k'], ['CartTotals', 'f'], ['(', ''], ['$id', 'v'], [': ', ''], ['String!', 't'], [') {\n  ', ''],
    ['cart', 'f'], ['(cart_id: ', ''], ['$id', 'v'], [') {\n    ', ''], ['prices', 'f'], [' {\n      ', ''],
    ['grand_total', 'f'], [' { value currency }\n    }\n  }\n}', ''],
  ]],
];
const lengthOf = (tokens) => tokens.reduce((a, [t]) => a + t.length, 0);

function Code({ tokens, count }) {
  let left = count;
  const out = [];
  tokens.forEach(([t, k], i) => {
    if (left <= 0) return;
    const part = t.slice(0, left);
    left -= part.length;
    out.push(k ? <span key={i} className={`tk-${k}`}>{part}</span> : part);
  });
  return out;
}

// A dark editor that types the snippets in turn. The pre-rendered HTML shows the first snippet
// in full, so the box never changes size and readers without JavaScript still see code.
export default function CodeEditor() {
  const [state, setState] = useState({ i: 0, n: lengthOf(SNIPPETS[0][1]) });
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    let visible = false;
    let timer = 0;
    let i = 0;
    let n = 0;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(ref.current);
    const step = () => {
      if (!visible) { timer = setTimeout(step, 400); return; }
      const total = lengthOf(SNIPPETS[i][1]);
      n = Math.min(total, n + 2);
      setState({ i, n });
      if (n < total) { timer = setTimeout(step, 30); return; }
      timer = setTimeout(() => { i = (i + 1) % SNIPPETS.length; n = 0; step(); }, 2600);
    };
    timer = setTimeout(step, 600);
    return () => { clearTimeout(timer); io.disconnect(); };
  }, []);

  const [file, tokens] = SNIPPETS[state.i];
  return (
    <div className="editor" ref={ref} aria-hidden="true">
      <div className="editor-bar"><i /><i /><i /><span>{file}</span></div>
      <pre className="editor-code"><Code tokens={tokens} count={state.n} /><span className="caret" /></pre>
    </div>
  );
}
