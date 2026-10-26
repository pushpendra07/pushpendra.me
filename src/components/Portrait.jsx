import { useEffect, useRef, useState } from 'react';
import { config } from '../data/profile';

// The frame is at most 400px wide.
const SIZES = '(max-width: 440px) calc(100vw - 48px), 400px';

export default function Portrait() {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  return (
    <div className="portrait" data-reveal="">
      <div className="portrait-glow" aria-hidden="true" />
      <div className="portrait-outline" aria-hidden="true" />
      <div className="portrait-frame">
        <div className="portrait-ring" aria-hidden="true" />
        <div className="portrait-inner">
          {failed ? (
            <div className="portrait-empty">Add the portrait at public{config.portrait}-760.jpg</div>
          ) : (
            <picture>
              <source
                type="image/webp"
                srcSet={`${config.portrait}-480.webp 480w, ${config.portrait}-760.webp 760w`}
                sizes={SIZES}
              />
              <img
                ref={imgRef}
                className="portrait-img"
                src={`${config.portrait}-760.jpg`}
                srcSet={`${config.portrait}-480.jpg 480w, ${config.portrait}-760.jpg 760w`}
                sizes={SIZES}
                width="760"
                height="912"
                loading="lazy"
                decoding="async"
                alt="Pushpendra Singh in a navy blazer, standing on a lit garden path"
                onError={() => setFailed(true)}
              />
            </picture>
          )}
        </div>
      </div>
      <div className="portrait-badge">Magento 1 · Magento 2 · Adobe Commerce</div>
    </div>
  );
}
