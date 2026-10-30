import { useEffect, useSyncExternalStore } from 'react';
import { followSystem, getTheme, setTheme, subscribe } from '../lib/theme';
import TechIcon from './TechIcon';

// Pre-rendered HTML is always built with the dark label; the client corrects it after hydration.
const serverTheme = () => 'dark';

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, serverTheme);
  const next = theme === 'dark' ? 'light' : 'dark';

  useEffect(() => followSystem(), []);

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={(e) => {
        // The new theme grows from the button's centre.
        const r = e.currentTarget.getBoundingClientRect();
        setTheme(next, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      <TechIcon name={theme === 'dark' ? 'sun' : 'moon'} color="currentColor" />
    </button>
  );
}
