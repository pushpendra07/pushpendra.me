import { useState } from 'react';
import { config } from '../data/profile';

export default function Portrait() {
  const [failed, setFailed] = useState(false);

  return (
    <div className="portrait" data-reveal="">
      <div className="portrait-glow" aria-hidden="true" />
      <div className="portrait-outline" aria-hidden="true" />
      <div className="portrait-frame">
        <div className="portrait-ring" aria-hidden="true" />
        <div className="portrait-inner">
          {failed ? (
            <div className="portrait-empty">Add the portrait at public{config.portrait}</div>
          ) : (
            <img
              className="portrait-img"
              src={config.portrait}
              alt="Portrait of Pushpendra Singh"
              onError={() => setFailed(true)}
            />
          )}
        </div>
      </div>
      <div className="portrait-badge">Magento 1 · Magento 2 · Adobe Commerce</div>
    </div>
  );
}
