export const FLAGS = { UAE: '🇦🇪', Kuwait: '🇰🇼', Lebanon: '🇱🇧', Australia: '🇦🇺', 'Saudi Arabia': '🇸🇦', USA: '🇺🇸', Russia: '🇷🇺' };

// "🇦🇪 Dubai, UAE" style location line. Unknown or missing places get a globe.
export default function Place({ place, fallback = 'Remote client' }) {
  const country = Object.keys(FLAGS).find((c) => (place || '').includes(c));
  return (
    <span className="loc">
      <span aria-hidden="true">{country ? FLAGS[country] : '🌐'}</span> {place || fallback}
    </span>
  );
}
