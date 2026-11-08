import { useEffect, useRef, useState } from 'react';
import BrandIcon from './BrandIcon';

// One signature graphic per case study, drawn in code from that project's own facts.
// Every label comes from the case study; the motion is CSS (transform and opacity only) and
// stops for visitors who prefer reduced motion. Scenes are decorative: the same facts are in
// the page text, so each one is a figure with a caption for screen readers.

const Win = ({ title, children, className = '' }) => (
  <div className={`sc-win ${className}`}>
    <div className="sc-win-bar"><i /><i /><i /><span>{title}</span></div>
    <div className="sc-win-body">{children}</div>
  </div>
);

const Chip = ({ children, brand, className = '', style }) => (
  <span className={`sc-chip ${className}`} style={style}>{brand && <BrandIcon name={brand} size={14} />}{children}</span>
);

const Step = ({ i, title, note, className = '' }) => (
  <div className={`sc-step ${className}`} style={{ '--i': i }}>
    <b>{title}</b>{note && <small>{note}</small>}
  </div>
);

// ---------- Client projects ----------

function Grandiose() {
  const stops = [['App order', 'GraphQL'], ['Discount', 'Talon.One'], ['Stock reserved', 'MSI'], ['Picked', 'Picker app'], ['Exported', 'SAP via queue'], ['Delivered', 'OTP handoff']];
  return (
    <div className="sc-route">
      <div className="sc-track"><span className="sc-runner" /></div>
      <div className="sc-stops">
        {stops.map(([t, n], i) => <Step key={t} i={i} title={t} note={n} className="sc-stop" />)}
      </div>
      <div className="sc-foot">
        <Chip brand="rabbitmq">Every external call queued, logged, retried</Chip>
        <Chip>Missing item? Asked in app, then by automated call</Chip>
      </div>
    </div>
  );
}

function FantasyWorld() {
  const modes = ['Express', 'Home Delivery', 'Click & Collect', 'Curbside'];
  return (
    <div className="sc-switch">
      <div className="sc-col">
        <span className="sc-label">Delivery mode</span>
        {modes.map((m, i) => <div key={m} className="sc-mode" style={{ '--i': i }}>{m}</div>)}
      </div>
      <div className="sc-arrow" aria-hidden="true" />
      <div className="sc-col">
        <span className="sc-label">Payment rules for that mode</span>
        <div className="sc-pay">{['Knet', 'UPay', 'CyberSource', 'Tabby'].map((p, i) => <Chip key={p} style={{ '--i': i }} className="sc-pop">{p}</Chip>)}</div>
        <span className="sc-label">Then</span>
        <div className="sc-pay"><Chip>SMS milestones</Chip><Chip>Dynamics AX order sync</Chip></div>
      </div>
    </div>
  );
}

function Antoine() {
  const types = ['Products', 'Prices', 'Inventory', 'Categories', 'Customers', 'Orders'];
  return (
    <div className="sc-sync">
      <div className="sc-end"><BrandIcon name="adobe" size={22} /><b>Adobe Commerce</b><small>Cloud · multi-website</small></div>
      <div className="sc-lanes">
        <div className="sc-lane sc-lane-r">{types.map((t, i) => <Chip key={t} style={{ '--i': i }}>{t}</Chip>)}</div>
        <span className="sc-cron">Two-way sync on cron · monitored in admin</span>
        <div className="sc-lane sc-lane-l">{types.map((t, i) => <Chip key={t} style={{ '--i': i }}>{t}</Chip>)}</div>
      </div>
      <div className="sc-end"><b>ERP</b><small>ErpBridge</small></div>
      <div className="sc-url" dir="ltr"><span>/ar/</span><span dir="rtl" lang="ar">منتجات-جديدة</span><em>Arabic URLs kept intact</em></div>
    </div>
  );
}

function ToolMart() {
  const crates = ['Customers', 'Orders', 'Products', 'CMS', 'Theme', 'Extensions'];
  return (
    <div className="sc-migrate">
      <div className="sc-box sc-old"><b>Magento 1</b><small>Ageing store</small></div>
      <div className="sc-belt">
        {crates.map((c, i) => <span key={c} className="sc-crate" style={{ '--i': i }}>{c}</span>)}
        <div className="sc-progress"><span /></div>
        <small>Full data migration, business logic preserved</small>
      </div>
      <div className="sc-box sc-new"><BrandIcon name="adobe" size={20} /><b>Adobe Commerce</b><small>On-premise · rebuilt PDP</small></div>
    </div>
  );
}

function Switch() {
  const domains = ['Catalog', 'Customer', 'Checkout', 'Store config', 'Compare list', 'Wishlist', 'Reviews', 'Product alerts'];
  return (
    <div className="sc-headless">
      <Win title="query.graphql" className="sc-code">
        <pre><span className="tk-k">query</span> <span className="tk-f">Dashboard</span> {'{'}{'\n'}  <span className="tk-f">dashboardBuilder</span> {'{'}{'\n'}    <span className="tk-v">banners</span> <span className="tk-v">products</span>{'\n'}    <span className="tk-v">categories</span>{'\n'}  {'}'}{'\n'}{'}'}</pre>
      </Win>
      <div className="sc-schema">
        <span className="sc-label"><BrandIcon name="graphql" size={14} /> 8 schema domains extended</span>
        <div className="sc-grid4">{domains.map((d, i) => <span key={d} className="sc-dom" style={{ '--i': i }}>{d}</span>)}</div>
      </div>
      <div className="sc-phone">
        <span className="sc-notch" />
        <div className="sc-ph-block sc-ph-hero" /><div className="sc-ph-row"><i /><i /></div><div className="sc-ph-row"><i /><i /></div>
        <small>Separate PWA, no Luma theme</small>
      </div>
    </div>
  );
}

function Sterling() {
  const entities = ['Specifications', 'Capacity ratings', 'Accessories', 'Job-cost accounting', 'Repair history', '+4 more entities'];
  return (
    <div className="sc-blueprint">
      <div className="sc-master"><span className="sc-label">Master record</span><b>Machine</b><small>Child records on the product form</small></div>
      <div className="sc-orbit">{entities.map((e, i) => <span key={e} className="sc-ent" style={{ '--i': i, '--n': entities.length }}>{e}</span>)}</div>
      <div className="sc-timeline">{['Custom PHP', 'Magento 1', 'Magento 2'].map((t, i) => <span key={t} style={{ '--i': i }}>{t}</span>)}</div>
    </div>
  );
}

function Minamin() {
  return (
    <div className="sc-twin">
      <div className="sc-stores">
        <Win title="FashionGo theme" className="sc-store sc-store-a"><div className="sc-skel"><i /><i /><i /></div></Win>
        <Win title="BeautyGo theme" className="sc-store sc-store-b"><div className="sc-skel"><i /><i /><i /></div></Win>
      </div>
      <div className="sc-core"><BrandIcon name="magento" size={18} /> One Magento backend · 203 style files</div>
      <div className="sc-lanes2">
        <div className="sc-lane2"><span className="sc-label">Scheduled cron</span><small>Inventory · prices · products</small><i className="sc-dot sc-slow" /></div>
        <div className="sc-lane2"><span className="sc-label"><BrandIcon name="rabbitmq" size={13} /> RabbitMQ queue</span><small>Order export, async</small><i className="sc-dot sc-fast" /></div>
      </div>
    </div>
  );
}

function Aquanexus() {
  return (
    <div className="sc-fleet">
      <div className="sc-tiles">{Array.from({ length: 8 }, (_, i) => <span key={i} className="sc-tile" style={{ '--i': i }}><i />Store {i + 1}</span>)}</div>
      <div className="sc-core"><BrandIcon name="magento" size={18} /> One instance · domain mapping · shared theme</div>
      <div className="sc-lens"><b>Admin ACL</b><small>Each admin sees only their own store&apos;s orders, customers and reports</small></div>
    </div>
  );
}

function Kalombo() {
  const pairs = [['Каталог', 'Catalog'], ['Корзина', 'Cart'], ['Оформить заказ', 'Checkout']];
  return (
    <div className="sc-lang">
      <Win title="Store view · RU / EN" className="sc-langwin">
        {pairs.map(([ru, en], i) => (
          <div key={en} className="sc-swap" style={{ '--i': i }}><span lang="ru">{ru}</span><span>{en}</span></div>
        ))}
        <small>Auto Address API · Russia-specific payments</small>
      </Win>
      <Win title="head · SEO" className="sc-code">
        <pre>{'<'}<span className="tk-k">script</span> type=<span className="tk-v">&quot;application/ld+json&quot;</span>{'>'}{'\n'}  {'{'} <span className="tk-f">&quot;@type&quot;</span>: <span className="tk-v">&quot;Organization&quot;</span> {'}'}{'\n'}{'<'}/<span className="tk-k">script</span>{'>'}{'\n'}<span className="tk-c">{'<!-- Open Graph, Twitter Card, GTM -->'}</span>{'\n'}<span className="tk-c">{'<!-- RU and EN variants per store -->'}</span></pre>
      </Win>
    </div>
  );
}

function Punjabstore() {
  const kids = [['Option A', 72], ['Option B', 44], ['Option C', 90]];
  return (
    <div className="sc-price">
      <Win title="Configurable product" className="sc-pwin">
        {kids.map(([k, w], i) => (
          <div key={k} className={`sc-kid${i === 1 ? ' is-low' : ''}`}><span>{k}</span><i style={{ '--w': `${w}%` }} /></div>
        ))}
        <div className="sc-from">Shows the price of the cheapest child option</div>
      </Win>
      <div className="sc-side">
        <div className="sc-toast">Mini-cart: delivery and discount messages</div>
        <div className="sc-relabel"><span className="sc-old-l">SKU</span><span className="sc-new-l">Packing Size</span><small>PDF invoice label</small></div>
        <Chip>Mobile-app version-check API</Chip>
      </div>
    </div>
  );
}

function Siemens() {
  return (
    <div className="sc-quote">
      <Win title="Quote-eligible product" className="sc-qwin">
        <div className="sc-img" />
        <div className="sc-qprice"><span className="sc-q1">Price</span><span className="sc-q2">Price on request</span></div>
        <div className="sc-qbtn"><span className="sc-q1">Add to cart</span><span className="sc-q2">Request a quote</span></div>
      </Win>
      <div className="sc-side">
        <span className="sc-label">Replaces cart, mini-cart and checkout</span>
        {['Quote list', 'Customer details', 'Thank-you page'].map((t, i) => <div key={t} className="sc-qrow" style={{ '--i': i }}>{t}</div>)}
      </div>
    </div>
  );
}

function TwoDLayer() {
  return (
    <div className="sc-config">
      <div className="sc-sheet"><span className="sc-cut" /><em className="sc-w">Width</em><em className="sc-h">Height</em></div>
      <div className="sc-side">
        <span className="sc-label">Material</span>
        <div className="sc-pay">{['Film', 'Vinyl', 'Substrate'].map((m, i) => <Chip key={m} className="sc-cycle" style={{ '--i': i }}>{m}</Chip>)}</div>
        <span className="sc-label">Build and price</span>
        <div className="sc-qrow">Custom size → calculated price</div>
        <div className="sc-qrow sc-ajax">AJAX add to cart · quote mini-cart</div>
      </div>
    </div>
  );
}

// ---------- My own products ----------

function Artha() {
  const parts = ['PPF', 'EPF', 'NPS', 'SGB', 'Mutual funds', 'Stocks'];
  return (
    <div className="sc-wealth">
      <div className="sc-ring" aria-hidden="true">{parts.map((p, i) => <span key={p} style={{ '--i': i, '--n': parts.length }} />)}<b>Net worth</b></div>
      <div className="sc-legend">{parts.map((p, i) => <span key={p} style={{ '--i': i }}><i />{p}</span>)}<span><i />+16 more instrument types</span></div>
      <div className="sc-facts">
        <div><strong>184</strong><small>API routes</small></div>
        <div><strong>165/165</strong><small>tests passing</small></div>
        <div><strong>22</strong><small>investment types</small></div>
      </div>
    </div>
  );
}

function Career() {
  return (
    <div className="sc-pipe">
      <div className="sc-col">
        <span className="sc-label">Job boards scanned</span>
        {['Greenhouse', 'Lever', 'Ashby', 'Workday'].map((b, i) => <div key={b} className="sc-mode" style={{ '--i': i }}>{b}</div>)}
      </div>
      <div className="sc-arrow" aria-hidden="true" />
      <div className="sc-stage">De-duplicated<small>Same link, ID or a 60%+ similar JD</small></div>
      <div className="sc-arrow" aria-hidden="true" />
      <div className="sc-gauge"><span className="sc-arc" /><b>0–100</b><small>Explainable score, 9 weighted parts</small></div>
    </div>
  );
}

function Gym() {
  return (
    <div className="sc-gym">
      <div className="sc-qr" aria-hidden="true">
        {Array.from({ length: 49 }, (_, i) => <i key={i} className={(i * 7 + (i % 5) * 3) % 3 === 0 || [0, 1, 7, 8, 5, 6, 12, 13, 35, 36, 42, 43].includes(i) ? 'on' : ''} />)}
        <span className="sc-scan" />
      </div>
      <div className="sc-side">
        <div className="sc-toast sc-ok">Checked in · HMAC-signed QR</div>
        <span className="sc-label">Reminders sent by</span>
        <div className="sc-pay">{['Email', 'SMS', 'WhatsApp'].map((c, i) => <Chip key={c} className="sc-pop" style={{ '--i': i }}>{c}</Chip>)}</div>
        <span className="sc-label">11 modules, one architecture</span>
        <div className="sc-dots">{Array.from({ length: 11 }, (_, i) => <i key={i} style={{ '--i': i }} />)}</div>
      </div>
    </div>
  );
}

function Toolkit() {
  const files = ['registration.php', 'etc/module.xml', 'composer.json', 'Observer/', 'Cron/', 'Console/Command/', 'view/adminhtml/ui_component/', 'Block/'];
  return (
    <div className="sc-gen">
      <Win title="Module generator" className="sc-form">
        <div className="sc-field"><small>Vendor</small><span>Acme</span></div>
        <div className="sc-field"><small>Module</small><span>OrderNotes</span></div>
        <div className="sc-pay">{['Observer', 'Cron', 'Admin grid', 'Console', 'Block'].map((o) => <Chip key={o}>✓ {o}</Chip>)}</div>
      </Win>
      <div className="sc-arrow" aria-hidden="true" />
      <Win title="app/code/Acme/OrderNotes" className="sc-tree">
        {files.map((f, i) => <div key={f} className="sc-file" style={{ '--i': i }}>{f.endsWith('/') ? '📁' : '📄'} {f}</div>)}
      </Win>
    </div>
  );
}

const SCENES = {
  'grandiose-supermarket': [Grandiose, 'One order, from app to doorstep', 'The systems a single grocery order passes through.'],
  'fantasy-world-toys': [FantasyWorld, 'The delivery mode decides everything after it', 'Each of the four modes carries its own payment rules and SMS updates.'],
  'antoine-online': [Antoine, 'Six kinds of data, synced both ways', 'Products, prices, stock, categories, customers and orders between Magento and the ERP.'],
  toolmart: [ToolMart, 'From Magento 1 to Adobe Commerce', 'A full data migration with the business logic carried across.'],
  switch: [Switch, 'A storefront that only speaks GraphQL', 'Magento serves the PWA entirely through an extended schema.'],
  'sterling-machinery': [Sterling, 'One machine, many records', 'A master/child data model for heavy equipment, across three platform generations.'],
  minamin: [Minamin, 'Two storefronts, one backend', 'Fashion and beauty themes on one Magento, with ERP sync split by urgency.'],
  aquanexus: [Aquanexus, 'Eight stores, one instance', 'Every vendor store runs on the same Magento, each admin locked to their own data.'],
  kalombo: [Kalombo, 'One store, two languages', 'Russian and English store views with SEO tooling for both.'],
  punjabstore: [Punjabstore, 'Small fixes customers actually see', 'Honest prices, clearer mini-cart messages and invoices in local terms.'],
  siemens: [Siemens, 'Where the cart becomes a quote', 'Quote-only products hide their price and swap checkout for a request.'],
  '2d-layer': [TwoDLayer, 'Build it, size it, price it', 'Custom-cut print products priced from the customer’s own dimensions.'],
  artha360: [Artha, 'A household’s wealth in one view', 'Investments, assets, liabilities and cash flow in one product.'],
  'career-intelligence': [Career, 'From job boards to a score you can trust', 'Jobs are scanned, de-duplicated and scored with an explainable 0–100 match.'],
  'gym-management-platform': [Gym, 'Scan in, and the gym runs itself', 'QR check-in, automated reminders and eleven modules behind it.'],
  'magento-2-developer-toolkit': [Toolkit, 'A Magento module, generated in seconds', 'Pick the parts you need and get a ready module skeleton.'],
};

export const hasScene = (slug) => Boolean(SCENES[slug]);
export const sceneTitle = (slug) => SCENES[slug]?.[1];

// A card-sized copy of a scene: laid out at the full band width, then zoomed down to fit the
// card, so it looks exactly like the case-study band. It is built only when the card comes
// near the screen (keeping the home page HTML and DOM small) and its motion pauses off screen.
const DESIGN_WIDTH = 1000;
export function MiniScene({ slug }) {
  const ref = useRef(null);
  const [zoom, setZoom] = useState(0.52);
  const [near, setNear] = useState(false);
  const [off, setOff] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([e]) => setZoom(e.contentRect.width / DESIGN_WIDTH));
    const nearIo = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); nearIo.disconnect(); } }, { rootMargin: '600px 0px' });
    const io = new IntersectionObserver(([e]) => setOff(!e.isIntersecting), { rootMargin: '80px 0px' });
    ro.observe(el);
    nearIo.observe(el);
    io.observe(el);
    return () => { ro.disconnect(); nearIo.disconnect(); io.disconnect(); };
  }, []);
  const entry = SCENES[slug];
  if (!entry) return null;
  const Scene = entry[0];
  return (
    <div ref={ref} className={`mini scene scene--${slug}${off ? ' is-off' : ''}${near ? ' is-ready' : ''}`} aria-hidden="true">
      {near && (
        <div className="mini-inner" style={{ width: DESIGN_WIDTH, zoom }}>
          <div className="scene-stage"><Scene /></div>
        </div>
      )}
    </div>
  );
}

export default function ProjectScene({ slug }) {
  const entry = SCENES[slug];
  if (!entry) return null;
  const [Scene, title, sub] = entry;
  return (
    <figure className={`scene scene--${slug}`}>
      <figcaption className="scene-cap"><strong>{title}</strong><span>{sub}</span></figcaption>
      <div className="scene-stage" aria-hidden="true"><Scene /></div>
    </figure>
  );
}
