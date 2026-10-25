import { config } from '../data/profile';

const RESUME_FILE = 'Pushpendra-Singh-Resume.pdf';

// Derives every contact/resume link from config, falling back to #contact when unset.
export function getLinks() {
  const { email, linkedinUrl, githubUrl, resumeReady, showPlaceholderNotes } = config;
  const emailHref = email ? `mailto:${email}` : '#contact';
  const missing = [
    !email && 'email',
    !linkedinUrl && 'LinkedIn URL',
    !resumeReady && 'resume PDF',
  ].filter(Boolean);

  return {
    email,
    emailHref,
    emailLabel: email ? `Email ${email}` : 'Email me',
    linkedin: { href: linkedinUrl || '#contact', external: !!linkedinUrl },
    github: { href: githubUrl || '#contact', external: !!githubUrl },
    resume: {
      href: resumeReady ? `/${RESUME_FILE}` : email ? `mailto:${email}?subject=CV%20request` : '#contact',
      download: resumeReady ? RESUME_FILE : undefined,
      label: resumeReady ? 'Resume ↓' : 'Request CV',
      heroLabel: resumeReady ? 'Download CV ↓' : 'Request CV',
    },
    showNotes: showPlaceholderNotes,
    missingNote: showPlaceholderNotes && missing.length
      ? `Placeholder · add ${missing.join(', ')} in src/data/profile.js`
      : '',
  };
}

export const externalProps = (external) => (external ? { target: '_blank', rel: 'noopener noreferrer' } : {});
