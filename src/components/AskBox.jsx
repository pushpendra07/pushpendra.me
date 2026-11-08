import { useEffect, useRef, useState } from 'react';
import { askPrompts, config } from '../data/profile';
import { prefersReducedMotion } from '../hooks/useReducedMotion';
import { track } from '../lib/analytics';
import { decodeEmail } from '../lib/email';

// Hero prompt box. The placeholder types out real problems the work solves; sending opens an
// email with the question already written, or jumps to Contact when no email is configured.
export default function AskBox() {
  const [text, setText] = useState('');
  const [hint, setHint] = useState(askPrompts[0]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    let i = 0;
    let n = askPrompts[0].length;
    let deleting = true;
    let timer = 0;
    const tick = () => {
      const s = askPrompts[i];
      n += deleting ? -1 : 1;
      setHint(s.slice(0, Math.max(n, 0)));
      if (!deleting && n >= s.length) { deleting = true; timer = setTimeout(tick, 1800); return; }
      if (deleting && n <= 0) { deleting = false; i = (i + 1) % askPrompts.length; }
      timer = setTimeout(tick, deleting ? 28 : 55);
    };
    timer = setTimeout(tick, 2200);
    return () => clearTimeout(timer);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    const q = text.trim();
    // The question itself stays private: only that one was asked, and roughly how long it was.
    track('generate_lead', { method: 'ask_box', location: 'home', has_question: q ? 'yes' : 'no', question_length: q.length });
    const email = decodeEmail();
    if (q && email) {
      window.location.href = `mailto:${email}?subject=${encodeURIComponent('Magento question')}&body=${encodeURIComponent(q)}`;
      return;
    }
    document.getElementById('contact')?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  return (
    <form className="ask" onSubmit={submit} role="search" aria-label="Ask about your Magento project">
      <img src="/images/avatar-64.webp" alt="" width="32" height="32" loading="lazy" decoding="async" />
      <label htmlFor="ask-input" className="sr-only">Describe your Magento problem</label>
      <input
        id="ask-input"
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={hint || ' '}
        autoComplete="off"
        enterKeyHint="send"
      />
      <button type="submit" aria-label="Send">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
    </form>
  );
}
