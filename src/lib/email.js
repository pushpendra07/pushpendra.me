import { config } from '../data/profile';

// Spam protection: the address never appears in the HTML, the JSON-LD or as plain text in the
// JavaScript. It is stored reversed and base64-encoded, and decoded only in the visitor's
// browser at the moment someone clicks or copies, which defeats the scrapers that harvest addresses.
export function decodeEmail() {
  if (typeof window === 'undefined' || !config.emailEncoded) return '';
  try {
    return window.atob(config.emailEncoded).split('').reverse().join('');
  } catch {
    return '';
  }
}

export const mailto = (email, subject) =>
  (email ? `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}` : '#contact');

// Click handler for "Email me" links: the link itself only points at #contact, and the address is
// assembled at the moment of the click, so it never sits in the page for a scraper to read.
export function openEmail(subject) {
  return (e) => {
    const email = decodeEmail();
    if (!email) return;
    e.preventDefault();
    window.location.href = mailto(email, subject);
  };
}
