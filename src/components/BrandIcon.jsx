import { brands } from '../data/brands';

// A brand mark in its own colour (Simple Icons, CC0). Decorative: the visible label names it.
export default function BrandIcon({ name, size = 20 }) {
  const b = brands[name];
  if (!b) return null;
  return (
    <svg className="brand-icon" viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <path fill={`#${b.hex}`} d={b.path} />
    </svg>
  );
}
