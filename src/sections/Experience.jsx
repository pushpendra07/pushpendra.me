import { useEffect, useRef, useState } from 'react';
import { certs, config, education, experience } from '../data/profile';
import { externalProps } from '../lib/links';

// "Mar 2014" → months since year 0, for the duration labels.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const toMonths = (s) => { const [m, y] = s.trim().split(' '); return +y * 12 + MONTHS.indexOf(m); };
function duration(dates, now) {
  const [from, to] = dates.split(' to ');
  const end = /present/i.test(to) ? now : toMonths(to);
  const total = end - toMonths(from);
  const y = Math.floor(total / 12);
  const m = total % 12;
  return [y && `${y} yr${y > 1 ? 's' : ''}`, m && `${m} mo${m > 1 ? 's' : ''}`].filter(Boolean).join(' ');
}
const pad = (n) => String(n).padStart(2, '0');
const OPEN_TO = ['Full-time', 'Contract', 'Adobe Commerce consulting'];
const istTime = () => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }).format(new Date());

// Oldest first, so the timeline reads from the first job to today.
const roles = [...experience].sort((a, b) => toMonths(a.dates.split(' to ')[0]) - toMonths(b.dates.split(' to ')[0]));
const [firstMonth, firstYear] = roles[0].dates.split(' to ')[0].split(' ');
const startLabel = `${FULL[MONTHS.indexOf(firstMonth)]} ${firstYear}`;

export default function Experience() {
  const d = new Date();
  const now = d.getFullYear() * 12 + d.getMonth();
  const listRef = useRef(null);
  const [reached, setReached] = useState(0);
  const [time, setTime] = useState('');

  // Local time in Bikaner, set after hydration so the prerendered HTML stays stable.
  useEffect(() => {
    setTime(istTime());
    const id = setInterval(() => setTime(istTime()), 30000);
    return () => clearInterval(id);
  }, []);

  // The rail fills up to a line 60% down the viewport; a row lights up once its dot is passed.
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const ol = listRef.current;
      if (!ol) return;
      const r = ol.getBoundingClientRect();
      const fill = Math.min(Math.max(window.innerHeight * 0.6 - r.top, 0), r.height);
      ol.style.setProperty('--fill', `${fill}px`);
      const dots = [...ol.querySelectorAll('.tl-dot')];
      setReached(dots.filter((dot) => dot.getBoundingClientRect().top + 14 - r.top <= fill).length);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(measure); };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section id="experience" className="section">
      <div className="wrap">
        <span className="tag">Work experience · 12+ years</span>

        <div className="tl-card" data-reveal="">
          <header className="tl-head">
            <h2 className="tl-h2">{startLabel} to <span className="accent">today</span></h2>
            <p>
              Twelve years, two companies, one platform I know inside out. I started on Magento 1 in Bikaner
              and now lead Adobe Commerce builds for international clients, remotely.
            </p>
          </header>

          <div className="tl" ref={listRef}>
            <span className="tl-rail" aria-hidden="true"><i /></span>
            <ol className="tl-list">
            {roles.map((x, i) => {
              const current = /present/i.test(x.dates);
              const [where] = x.employer.split(' · ').slice(-1);
              const company = x.employer.split(' · ')[0];
              return (
                <li key={x.employer} className={`tl-row${i < reached ? ' is-on' : ''}`}>
                  <span className="tl-dot" aria-hidden="true" />
                  <span className="tl-n" aria-hidden="true">{pad(i + 1)}</span>
                  <div className="tl-body">
                    <span className="tl-when">{x.dates.replace(' to ', ' – ')} · {duration(x.dates, now)}</span>
                    <h3 className="tl-title">{x.title}</h3>
                    <span className="tl-company">{company}</span>
                    <ul className="tl-points">
                      {x.points.map((p) => <li key={p}>{p}</li>)}
                    </ul>
                    <ul className="chips" aria-label="Technologies">
                      {x.stack.map((t) => <li key={t}>{t}</li>)}
                    </ul>
                  </div>
                  <div className="tl-meta">
                    <span>{where}</span>
                    {current && <span className="xp-current">Current</span>}
                  </div>
                </li>
              );
            })}
            </ol>
          </div>

          <div className="tf" id="certifications" aria-label="Summary, certifications and education">
            <div className="tf-now">
              <span className="tf-label">Now</span>
              <p className="tf-role"><strong>Senior Software Developer</strong> with tech-lead duties</p>
              <p className="tf-where">
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" /><circle cx="12" cy="10" r="2.5" /></svg>
                <span>{config.location} · remote<br /><span className="tf-clock"><i aria-hidden="true" />{time ? `${time} ` : ''}IST (UTC+5:30)</span></span>
              </p>
              <span className="tf-label">Open to</span>
              <ul className="tf-open">
                {OPEN_TO.map((o) => <li key={o}>{o}</li>)}
              </ul>
            </div>

            <div className="tf-panel">
              <span className="tf-label">Certified by Adobe</span>
              <ul className="tf-badges">
                {certs.filter((c) => c.badge).map((c) => (
                  <li key={c.title}>
                    <img src={c.badge} alt="" width="64" height="64" loading="lazy" decoding="async" />
                    <b>{c.title.replace('Adobe Certified ', '')}</b>
                    <span>{c.issuer}</span>
                    {c.verifyUrl && (
                      <a href={c.verifyUrl} {...externalProps(true)} aria-label={`Verify ${c.title} credential`}>
                        Verify <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
              <span className="tf-label">Awards</span>
              <ul className="tf-awards">
                {certs.filter((c) => !c.badge).map((c) => (
                  <li key={c.title}>
                    <span className="tf-trophy" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="18" height="18"><path d="M8 4h8v5a4 4 0 0 1-8 0V4Zm0 2H5a3 3 0 0 0 3 4m8-4h3a3 3 0 0 1-3 4m-4 3v4m-3 3h6m-5-3h4" /></svg>
                    </span>
                    <span><b>{c.title}</b>{c.issuer} · {c.meta.replace('Award · ', '')}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="tf-panel">
              <span className="tf-label">Education</span>
              <ul className="tf-edu">
                {education.map((e) => (
                  <li key={e.degree}>
                    <span className="tf-mono" aria-hidden="true">{e.short.replace(' IT', '')}</span>
                    <span><b>{e.degree}</b>{e.school}</span>
                  </li>
                ))}
              </ul>
              <div className="tf-years"><strong>12+</strong><span>years building on Magento,<br />since {firstYear}</span></div>
            </div>

            <div className="tf-cta">
              <p><strong>Hiring for Adobe Commerce or Magento 2?</strong> Tell me about the role, the stack and the team.</p>
              <a className="pill pill-primary" href="#contact">Discuss a role <span className="arr">→</span></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
