import { useSyncExternalStore } from 'react';
import { getChoice, setChoice, subscribeChoice } from '../lib/theme';
import TechIcon from './TechIcon';
import { track } from '../lib/analytics';

const OPTIONS = [
  ['light', 'Light', 'sun'],
  ['dark', 'Dark', 'moon'],
];

// Pre-rendered HTML marks "Light" (the default); the client corrects it after hydration.
const serverChoice = () => 'light';

// Two-way theme selector: light (default) or dark.
export default function ThemeSelect({ labels = false }) {
  const choice = useSyncExternalStore(subscribeChoice, getChoice, serverChoice);

  return (
    <div className={`theme-select${labels ? ' theme-select--labels' : ''}`} role="radiogroup" aria-label="Colour theme">
      {OPTIONS.map(([value, label, icon]) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={choice === value}
          title={`${label} theme`}
          className={choice === value ? 'is-on' : ''}
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setChoice(value, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
            track('theme_change', { theme: value });
          }}
        >
          <TechIcon name={icon} color="currentColor" />
          <span className={labels ? '' : 'sr-only'}>{label}</span>
        </button>
      ))}
    </div>
  );
}
