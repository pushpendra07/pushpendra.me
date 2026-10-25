import { config } from '../data/profile';
import { externalProps, getLinks } from '../lib/links';
import { scrollToHash } from '../lib/scroll';

export default function Contact() {
  const { emailHref, emailLabel, linkedin, github, resume, missingNote } = getLinks();

  return (
    <section id="contact" className="contact">
      <div className="contact-glow" aria-hidden="true" />
      <div className="contact-inner">
        <span className="eyebrow eyebrow--dark" data-reveal="">06 — CONTACT</span>
        <h2 className="contact-title" data-reveal="">
          Let&apos;s build something <span className="gradient-text">solid.</span>
        </h2>
        <p className="contact-lead" data-reveal="">
          Hiring for a senior Magento or Adobe Commerce role, or need a dependable engineer for a custom module,
          integration or performance problem? I&apos;d be glad to hear about it.
        </p>
        <div className="contact-actions" data-reveal="">
          <a href={emailHref} onClick={scrollToHash} className="btn-white">{emailLabel}</a>
          <a href={linkedin.href} onClick={scrollToHash} className="btn-outline" {...externalProps(linkedin.external)}>LinkedIn</a>
          {github.external && (
            <a href={github.href} className="btn-outline" {...externalProps(true)}>GitHub</a>
          )}
          <a href={resume.href} download={resume.download} onClick={scrollToHash} className="btn-outline">{resume.heroLabel}</a>
        </div>
        <p className="contact-location">Based in {config.location} · working remotely with teams worldwide</p>
        {missingNote && <p className="missing-note">{missingNote}</p>}
      </div>
    </section>
  );
}
