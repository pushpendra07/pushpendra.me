import { useRef } from 'react';
import useReveal from '../hooks/useReveal';
import BackToTop from './BackToTop';

// Page wrapper shared by every page: scroll-reveal and the back-to-top button.
export default function Root({ children }) {
  const rootRef = useRef(null);
  useReveal(rootRef);
  return (
    <div ref={rootRef} className="root">
      {children}
      <BackToTop />
    </div>
  );
}
