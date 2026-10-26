import { useEffect, useState } from 'react';

const KEY = 'analytics-consent';

// Asks once whether Google Analytics may use cookies; index.html applies the stored choice.
export default function ConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      setOpen(!localStorage.getItem(KEY));
    } catch {
      setOpen(false);
    }
  }, []);

  const choose = (value) => {
    try { localStorage.setItem(KEY, value); } catch { /* the choice still applies to this visit */ }
    window.gtag?.('consent', 'update', { analytics_storage: value });
    setOpen(false);
  };

  if (!open) return null;
  return (
    <div className="consent" role="dialog" aria-live="polite" aria-label="Analytics cookies">
      <p>
        This site uses Google Analytics cookies to count visits. No ads, and nothing is shared for advertising.
      </p>
      <div className="consent-actions">
        <button type="button" className="consent-btn" onClick={() => choose('denied')}>Decline</button>
        <button type="button" className="consent-btn consent-btn--primary" onClick={() => choose('granted')}>Accept</button>
      </div>
    </div>
  );
}
