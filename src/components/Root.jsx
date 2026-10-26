import { useRef } from 'react';
import useReveal from '../hooks/useReveal';
import BackToTop from './BackToTop';
import ConsentBanner from './ConsentBanner';

// Page wrapper shared by every page: scroll-reveal, back-to-top and the analytics consent banner.
export default function Root({ children }) {
  const rootRef = useRef(null);
  useReveal(rootRef);
  return (
    <div ref={rootRef} className="root">
      {children}
      <BackToTop />
      <ConsentBanner />
    </div>
  );
}
