import { useEffect, useRef, useState } from 'react';
import { config } from '../data/profile';
import { externalProps, getLinks } from '../lib/links';
import { scrollToHash } from '../lib/scroll';
import { track } from '../lib/analytics';
import { decodeEmail, openEmail } from '../lib/email';
import SitAvatar from '../components/SitAvatar';
import { prefersReducedMotion } from '../hooks/useReducedMotion';

export default function Contact() {
  const { linkedin, github, resume, missingNote } = getLinks();
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  // A soft light that follows the pointer across the card (--mx / --my in px).
  useEffect(() => {
    const card = cardRef.current;
    if (!card || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return undefined;
    const onMove = (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    card.addEventListener('pointermove', onMove, { passive: true });
    return () => card.removeEventListener('pointermove', onMove);
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(decodeEmail());
      setCopied(true);
      track('generate_lead', { method: 'copy_email', location: 'contact' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      openEmail('Adobe Commerce role or project')({ preventDefault() {} });
    }
  };

  return (
    <section id="contact" className="section contact">
      <div className="wrap">
        <div className="cta-wrap" data-reveal="">
        <SitAvatar />
        <div className="cta-card" ref={cardRef}>
          <div className="cta-fx" aria-hidden="true"><i /><i /><i /></div>
          <span className="tag tag-dark">Available immediately</span>
          <h2 className="h2">Hiring for Adobe Commerce? <span className="soft cta-shimmer">Let&apos;s talk.</span></h2>
          <p>
            Senior Magento and Adobe Commerce roles, contract work, or a custom module, integration or performance
            problem. Email is the fastest way to reach me.
          </p>
          <ul className="available" aria-label="Available for">
            {config.availableFor.map((a, i) => <li key={a} style={{ '--i': i }}>{a}</li>)}
          </ul>
          <div className="ctas">
            <span className="email-group">
              <a href="#contact" data-lead="email" onClick={openEmail('Adobe Commerce role or project')} className="pill pill-light">Email me <span className="arr" aria-hidden="true">→</span></a>
              {config.emailEncoded && (
                <button type="button" className="copy" onClick={copyEmail} aria-label="Copy email address">
                  {copied ? 'Copied' : 'Copy'}
                </button>
              )}
            </span>
            <a href={linkedin.href} onClick={scrollToHash} className="pill pill-glass" {...externalProps(linkedin.external)}>LinkedIn</a>
            <a href={resume.href} download={resume.download} onClick={scrollToHash} className="pill pill-glass">{resume.heroLabel}</a>
          </div>
          <p className="sr-only" aria-live="polite">{copied ? 'Email address copied' : ''}</p>
          <p className="contact-meta">
            {github.external && <a href={github.href} {...externalProps(true)}>GitHub</a>}
            <span>{config.location}</span>
          </p>
          {missingNote && <p className="contact-meta">{missingNote}</p>}
        </div>
        </div>
      </div>
    </section>
  );
}
