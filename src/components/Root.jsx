import { useEffect, useRef } from 'react';
import useAlive from '../hooks/useAlive';
import useReveal from '../hooks/useReveal';
import { startAnalytics } from '../lib/analytics';
import BackToTop from './BackToTop';

// Page wrapper shared by every page: scroll-reveal and the back-to-top button.
export default function Root({ children }) {
  const rootRef = useRef(null);
  useReveal(rootRef);
  useAlive(rootRef);
  useEffect(() => startAnalytics(), []);
  return (
    <div ref={rootRef} className="root">
      {children}
      <BackToTop />
    </div>
  );
}
