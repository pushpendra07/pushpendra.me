import { useEffect, useState } from 'react';
import { config } from '../data/profile';
import { externalProps, getLinks } from '../lib/links';
import { scrollToHash } from '../lib/scroll';

// Live local time; rendered only after mount so the pre-rendered HTML stays stable.
function useLocalTime(timeZone) {
  const [time, setTime] = useState('');
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timeZone]);
  return time;
}

export default function Contact() {
  const { email, emailHref, emailLabel, linkedin, github, resume, missingNote } = getLinks();
  const [copied, setCopied] = useState(false);
  const time = useLocalTime(config.timeZone);

  // Builds the email in the visitor's own mail app; nothing is sent to or stored by this site.
  const sendMessage = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = f.get('name').trim();
    const company = f.get('company').trim();
    const from = company ? `${name}, ${company}` : name;
    const subject = `${f.get('topic')} — ${from}`;
    const body = `${f.get('message').trim()}\n\n— ${from}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = emailHref;
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="contact-glow" aria-hidden="true" />
      <div className="contact-inner">
        <span className="eyebrow eyebrow--dark" data-reveal="">CONTACT</span>
        <h2 className="contact-title" data-reveal="">
          Let&apos;s build something <span className="gradient-text">solid.</span>
        </h2>
        <p className="contact-lead" data-reveal="">
          Hiring for a senior Magento or Adobe Commerce role, or need a dependable engineer for a custom module,
          integration or performance problem? I&apos;d be glad to hear about it.
        </p>
        <ul className="available" aria-label="Available for" data-reveal="">
          {config.availableFor.map((a) => <li key={a}>{a}</li>)}
        </ul>
        {email && (
          <form className="contact-form" onSubmit={sendMessage} data-reveal="">
            <div className="field">
              <label htmlFor="cf-name">Your name</label>
              <input id="cf-name" name="name" required autoComplete="name" />
            </div>
            <div className="field">
              <label htmlFor="cf-company">Company <span>(optional)</span></label>
              <input id="cf-company" name="company" autoComplete="organization" />
            </div>
            <div className="field field--wide">
              <label htmlFor="cf-topic">What&apos;s it about?</label>
              <select id="cf-topic" name="topic" defaultValue="A full-time role">
                <option>A full-time role</option>
                <option>Contract / freelance work</option>
                <option>Adobe Commerce consulting</option>
                <option>Something else</option>
              </select>
            </div>
            <div className="field field--wide">
              <label htmlFor="cf-message">Message</label>
              <textarea id="cf-message" name="message" rows={4} required placeholder="A line or two about the role or project…" />
            </div>
            <div className="form-foot">
              <button type="submit" className="btn-primary">Write the email <span aria-hidden="true">→</span></button>
              <span className="form-note">Opens your email app with the message ready to send.</span>
            </div>
          </form>
        )}
        <p className="contact-or" data-reveal="">or reach me directly</p>
        <div className="contact-actions" data-reveal="">
          <span className="email-group">
            <a href={emailHref} onClick={scrollToHash} className="btn-white">{emailLabel}</a>
            {email && (
              <button type="button" className="btn-copy" onClick={copyEmail} aria-label="Copy email address">
                {copied ? 'Copied ✓' : 'Copy'}
              </button>
            )}
          </span>
          <a href={linkedin.href} onClick={scrollToHash} className="btn-outline" {...externalProps(linkedin.external)}>LinkedIn</a>
          {github.external && (
            <a href={github.href} className="btn-outline" {...externalProps(true)}>GitHub</a>
          )}
          <a href={resume.href} download={resume.download} onClick={scrollToHash} className="btn-outline">{resume.heroLabel}</a>
        </div>
        <p className="sr-only" aria-live="polite">{copied ? 'Email address copied' : ''}</p>
        <p className="contact-location">
          Based in {config.location} · working remotely with teams worldwide
          {time && <><br /><span className="local-time"><span className="local-dot" aria-hidden="true" />Local time <time className="local-clock">{time}</time> IST (UTC+5:30)</span></>}
        </p>
        {missingNote && <p className="missing-note">{missingNote}</p>}
      </div>
    </section>
  );
}
