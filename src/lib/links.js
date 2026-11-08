import { config } from '../data/profile';

const RESUME_FILE = 'Pushpendra-Singh-Resume.pdf';

// Derives the contact and resume links from config, falling back to #contact when unset.
// The email link is not here: it is built in the browser only (src/lib/email.js).
export function getLinks() {
  const { emailEncoded, linkedinUrl, githubUrl, resumeReady, showPlaceholderNotes } = config;
  const missing = [
    !emailEncoded && 'email',
    !linkedinUrl && 'LinkedIn URL',
    !resumeReady && 'resume PDF',
  ].filter(Boolean);

  return {
    linkedin: { href: linkedinUrl || '#contact', external: !!linkedinUrl },
    github: { href: githubUrl || '#contact', external: !!githubUrl },
    resume: {
      href: resumeReady ? `/${RESUME_FILE}` : '#contact',
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
