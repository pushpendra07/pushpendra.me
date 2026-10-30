// Light/dark theme. The inline script in index.html sets data-theme on <html> before first
// paint (saved choice, else the system setting); this module reads and changes it.
const KEY = 'theme';
const LIGHT_QUERY = '(prefers-color-scheme: light)';
// Browser UI colour per theme; matches --bg in styles.css.
const THEME_COLOR = { dark: '#06070d', light: '#fbfaff' };

export const getTheme = () =>
  typeof document !== 'undefined' && document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';

function apply(theme) {
  const root = document.documentElement;
  // Drop transitions for a frame so the whole page swaps at once.
  root.classList.add('theme-switching');
  root.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('theme-switching')));
}

const saved = () => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
};

// Saves an explicit choice; from then on the system setting is ignored.
export function setTheme(theme) {
  apply(theme);
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // Private mode: the choice lasts for this page only.
  }
}

// Calls `onChange` whenever data-theme changes, from any source.
export function subscribe(onChange) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

// Follows system light/dark changes until the visitor picks a theme.
export function followSystem() {
  const mq = window.matchMedia(LIGHT_QUERY);
  const onChange = () => { if (!saved()) apply(mq.matches ? 'light' : 'dark'); };
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}
