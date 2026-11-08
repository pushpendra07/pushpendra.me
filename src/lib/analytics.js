// GA4 events. gtag() is defined inline in index.html before anything else runs and queues into
// dataLayer, so events sent before gtag.js has loaded (it loads when the page is idle) still arrive.
// Event names follow GA4's recommended set where one fits (generate_lead, select_content,
// file_download); the rest are short snake_case custom events.

export function track(name, params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', name, params);
}

const pageType = () => (window.location.pathname === '/' ? 'home' : 'case_study');

// One delegated listener classifies every link click on the page.
function onClick(e) {
  const a = e.target.closest && e.target.closest('a[href]');
  if (!a) return;
  const href = a.getAttribute('href');
  const where = a.closest('section[id], header, footer, main');
  const location = where ? (where.id || where.tagName.toLowerCase()) : 'page';

  if (a.dataset.lead === 'email' || href.startsWith('mailto:')) {
    track('generate_lead', { method: 'email', location, page_type: pageType() });
  } else if (/linkedin\.com/i.test(href)) {
    track('generate_lead', { method: 'linkedin', location, page_type: pageType() });
  } else if (/github\.com/i.test(href)) {
    track('click_profile', { network: 'github', location });
  } else if (/\.pdf($|\?)/i.test(href)) {
    track('file_download', { file_name: href.split('/').pop(), file_extension: 'pdf', link_text: 'CV', location });
  } else if (a.classList.contains('card-link') || /^\/(projects|products)\//.test(href)) {
    track('select_content', { content_type: href.startsWith('/products/') ? 'ai_build' : 'case_study', item_id: href.split('/').filter(Boolean).pop(), location });
  } else if (/certification\.adobe\.com/i.test(href)) {
    track('verify_credential', { location });
  } else if (a.closest('.nav-header')) {
    track('nav_click', { target: href.replace(/^.*#/, ''), page_type: pageType() });
  } else if (href.includes('#contact')) {
    track('cta_click', { target: 'contact', location });
  }
}

// Each main section reports once, the first time it fills half the screen (or, for a short
// section, half of it is visible). Tall sections like Projects or the Skills story can never be
// half visible at once, so the viewport share is what counts for them.
function watchSections() {
  const seen = new Set();
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    const id = en.target.id;
    if (!en.isIntersecting || seen.has(id)) return;
    const need = Math.min(en.boundingClientRect.height, window.innerHeight) * 0.5;
    if (en.intersectionRect.height < need) return;
    seen.add(id);
    track('section_view', { section_id: id, page_type: pageType() });
    io.unobserve(en.target);
  }), { threshold: Array.from({ length: 21 }, (_, i) => i / 20) });
  document.querySelectorAll('main section[id]').forEach((s) => io.observe(s));
  return () => io.disconnect();
}

export function startAnalytics() {
  document.addEventListener('click', onClick, { capture: true });
  const stop = watchSections();
  return () => { document.removeEventListener('click', onClick, { capture: true }); stop(); };
}
