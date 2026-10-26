// Site configuration.
export const config = {
  email: 'pushpendra07@yahoo.com',
  linkedinUrl: 'https://www.linkedin.com/in/pushpendra07/',
  // Optional — the GitHub links stay hidden until this is set.
  githubUrl: '',
  // public/Pushpendra-Singh-Resume.pdf
  resumeReady: true,
  // Shows the amber "placeholder · to confirm" notes while content is unverified.
  showPlaceholderNotes: false,
  portrait: '/pushpendra-profile.png',
  location: 'Bikaner, Rajasthan, India',
};

export const nav = [
  ['home', 'Home'],
  ['about', 'About'],
  ['experience', 'Experience'],
  ['projects', 'Projects'],
  ['skills', 'Skills'],
  ['certifications', 'Certifications'],
  ['contact', 'Contact'],
];

export const techCards = [
  { label: 'Adobe Commerce', x: '2%', y: '6%', depth: 26, dur: '6s', delay: '0s', dot: '#a78bfa' },
  { label: 'Magento 2', x: '64%', y: '2%', depth: 34, dur: '7.5s', delay: '-2s', dot: '#f97316' },
  { label: 'PHP', x: '84%', y: '30%', depth: 20, dur: '5.5s', delay: '-1s', dot: '#818cf8' },
  { label: 'GraphQL', x: '-4%', y: '40%', depth: 30, dur: '8s', delay: '-3s', dot: '#f0abfc' },
  { label: 'RabbitMQ', x: '80%', y: '70%', depth: 24, dur: '6.5s', delay: '-4s', dot: '#67e8f9' },
  { label: 'Redis', x: '4%', y: '80%', depth: 36, dur: '7s', delay: '-1.5s', dot: '#f87171' },
  { label: 'Varnish', x: '40%', y: '90%', depth: 18, dur: '9s', delay: '-2.5s', dot: '#60a5fa' },
  { label: 'SAP & ERP', x: '58%', y: '82%', depth: 28, dur: '6.8s', delay: '-5s', dot: '#34d399' },
];

// `count` animates up to the number, then `suffix` is appended.
export const stats = [
  { count: 12, suffix: '+', label: 'Years in software development' },
  { count: 8, suffix: '', label: 'Countries of international clients' },
  { count: 20, suffix: 'K', label: 'SKUs per bulk catalog API request' },
  { count: 2, suffix: '', label: 'Adobe Commerce Developer certifications' },
];

export const strengths = [
  { n: '/01', title: 'Adobe Commerce engineering', text: 'Cloud, on-premise and Open Source: custom modules, MSI, promotion engines, checkout and payments.' },
  { n: '/02', title: 'ERP & integrations', text: 'SAP, Microsoft Dynamics AX, Talon.One, payment gateways and delivery partners over REST, GraphQL and RabbitMQ.' },
  { n: '/03', title: 'Performance & security', text: 'Redis, Varnish, Fastly and New Relic profiling, plus code audits, CSP and PCI hardening.' },
  { n: '/04', title: 'Technical leadership', text: 'Code reviews, mentoring, estimation and UAT ownership from requirements to production.' },
];

export const experience = [
  {
    title: 'Senior Software Developer (Tech Lead responsibilities)',
    employer: 'Krish TechnoLabs · Remote',
    dates: 'Sep 2021 — Present',
    points: [
      'Own end-to-end delivery of Adobe Commerce platforms for international clients: solution design, custom modules, ERP and data migration, integrations, deployment and production support.',
      'Primary technical point of contact, turning complex business requirements into scalable architecture, technical designs and delivery plans.',
      'Lead performance work with New Relic, PageSpeed Insights and GTmetrix across page rendering, database queries, checkout and GraphQL response times.',
      'Run codebase and custom-module audits for duplicated logic, conflicting overrides and security gaps, and set coding, PSR, security-review and UAT standards.',
      'Standardise reusable module patterns — service contracts, repository and API interfaces, UI DataProvider modifiers — across client projects.',
    ],
    stack: ['Adobe Commerce Cloud', 'Magento 2', 'GraphQL', 'RabbitMQ', 'SAP', 'New Relic'],
  },
  {
    title: 'Senior Software Developer',
    employer: 'Sunarc Technologies · Bikaner',
    dates: 'Mar 2014 — Sep 2021',
    points: [
      'Designed RESTful APIs and backend integrations for third-party services on Magento 2 stores.',
      'Resolved architectural, database and application-performance bottlenecks to improve scalability and stability.',
      'Built reusable Magento 1/2 extensions: Volumetric Shipping, Split Cart, Free Shipping Goal Sticky Bar, and Category Image & Description Block.',
      'Led client requirement analysis and mentored junior developers through code reviews, Git workflows and debugging sessions.',
    ],
    stack: ['Magento 1', 'Magento 2', 'PHP', 'MySQL', 'REST'],
  },
];

export const projects = [
  {
    n: '01', category: 'Omnichannel grocery', title: 'Grandiose Supermarket', place: 'Dubai, UAE', platform: 'Magento Open Source',
    desc: 'Dual discount-engine architecture (Talon.One + Zinrelo), a from-scratch in-store Picker/Dispatch app, SAP ERP wired into every order event, and ~40 GraphQL modules powering a headless storefront.',
    problem: 'Store picking, substitutions, promotions, loyalty and SAP all had to agree on the same cart and stock, across many physical stores selling the same SKUs.',
    solution: 'A per-store switch handing cart discounts to Talon.One, 21 GraphQL modules behind a Picker & Dispatcher app, rewritten MSI reservations, and SAP plus a separate queue feeding a live operations dashboard.',
    tags: ['Talon.One', 'SAP', 'Headless GraphQL', 'Zinrelo', 'RabbitMQ'],
    details: [
      'Config-driven switch letting Talon.One take over cart discount calculation per store in place of the native/Zinrelo engine, with plugin hooks across payments, order placement, store credit and gift cards keeping both systems in sync.',
      'Backend for an in-store Picker and Dispatcher app (21 GraphQL modules): aisle-by-aisle picking, fresh-prep flagging, bag tracking, and dispatch to third-party logistics or self-delivery with OTP-verified handoff.',
      'Substitution-confirmation flow that starts in-app and escalates to an automated IVR phone call if the customer doesn’t respond, so an unreachable customer never stalls an order.',
      'Rewrote MSI reservation and stock-deduction logic so counts stayed accurate while many stores sold the same SKU and pickers pulled items off shelves in real time.',
      'SAP ERP wired into every order-lifecycle stage (returns, RMA fees, inventory shifts, shipments), with an independent message-queue layer feeding a real-time operations dashboard.',
      'Zinrelo loyalty built into the sales-rule engine as first-class cart rules, including receipt-scan point claims, refer-a-friend rewards and reward history.',
      'Around 40 GraphQL modules (payments, gift cards, wishlist, inventory, store credit) for the headless storefront, plus a drag-and-drop homepage builder.',
      'ERP import pipeline processing 10,000–20,000 SKUs per batch, and a timing-out CSV export rewritten to output 50,000 products in 3–5 seconds.',
      'Zone-based inventory and geofencing with admin-drawn Google Maps delivery polygons, tied to Express, Home, Click & Collect and Curbside modes with per-mode cutoffs.',
      'Message-queue order workflow integrating Grubtech (kitchen display) and FarEye (last-mile logistics) with a shared webhook-plus-retry pattern.',
      'Rule-based customer segments, age-restricted product controls, Adjust attribution and MoEngage engagement campaigns.',
    ],
  },
  {
    n: '02', category: 'Fulfilment', title: 'Fantasy World Toys', place: 'Kuwait City, Kuwait', platform: 'Adobe Commerce On-Premise',
    desc: 'Led a 2–3 developer team building a multi-mode delivery engine, a Microsoft Dynamics AX ERP bridge and Kuwait-specific payments across 47 custom modules.',
    problem: 'A new fulfilment model needed Express, Home Delivery, Click & Collect and Curbside options, each with its own payment rules and customer notifications.',
    solution: 'A multi-mode delivery engine with SMS milestones, Knet, UPay, CyberSource and Tabby payments, and a Dynamics AX bridge for categories, customers and orders.',
    tags: ['Team lead', 'Dynamics AX', 'Algolia', 'Knet + UPay', 'Tabby'],
    details: [
      'Dedicated client-side developer handling day-to-day backend operations and prioritisation.',
      'Led a team of 2–3 developers on task assignment and code review, sharing delivery accountability with the PM.',
      'Multi-mode delivery engine (Express, Home Delivery, Click & Collect, Curbside) with mode-specific payment restrictions and SMS milestone notifications.',
      'Integrated Knet and UPay alongside CyberSource Secure Acceptance and Tabby buy-now-pay-later.',
      'Microsoft Dynamics AX ERP bridge syncing categories, customers and orders.',
      'Gift-wrap options and a coupon auto-apply engine built on Mageplaza GiftWrap and Abandoned Cart.',
      'Patched and extended over a dozen third-party extensions (Amasty, Magedelight, Mageplaza, CyberSource, Eltrino) across 62 touch-points.',
      'SMS OTP login, Facebook/Google social login and an in-store kiosk mode.',
      'Shop-by-age filtering, daily-deal and star-product merchandising, and shop-by-brand navigation.',
      'Optimised REST and GraphQL APIs; integrated Algolia search and Tabby checkout.',
    ],
  },
  {
    n: '03', category: 'ERP integration', title: 'Antoine Online', place: 'Beirut, Lebanon', platform: 'Adobe Commerce Cloud',
    desc: 'Two-way ERP sync, Arabic-language product URLs, and a multi-website switcher with country-based shipping restrictions, across 25 custom modules.',
    problem: 'Arabic product URLs were stripped by Magento’s default URL sanitiser, and a recurring back-order bug kept surfacing through imports.',
    solution: 'A custom front-controller router for Arabic URLs, a root-cause CSV import patch, and a two-way ErpBridge sync with an admin monitoring grid.',
    tags: ['ERP', 'REST APIs', 'Arabic URLs', 'Multi-website'],
    details: [
      'Product Add/Update/Delete APIs that streamlined data processing and import/export.',
      'Two-way ERP sync (ErpBridge) for products, prices, inventory, categories, customers and orders via cron, with an admin monitoring grid.',
      'Diagnosed a recurring back-order/out-of-stock issue and fixed it at the root with a custom CSV import patch.',
      'Custom front-controller router enabling Arabic product URLs (spaces, special characters) that the default sanitiser would strip.',
      'Multi-website frontend switcher and country-based shipping restrictions on top of Webkul Shipping Restrictions.',
      'Reusable SFTP helper module with an admin “Test Connection” button, reused across integrations.',
      'CLI tools for bulk gift-card and newsletter-subscriber migration, plus category and attribute migration patches.',
    ],
  },
  {
    n: '04', category: 'Migration', title: 'ToolMart', place: 'Perth, Australia', platform: 'Adobe Commerce On-Premise',
    desc: 'Led migration architecture from Magento 1 to Adobe Commerce On-Premise, rebuilt the PDP end-to-end, and delivered Request-a-Quote and Request-a-Catalogue across 20 custom modules.',
    problem: 'An ageing Magento 1 store with a fragmented mix of third-party extensions and business logic that had to survive the move.',
    solution: 'Full data migration, rebuilt themes and extensions, a new product page, and five purchased extensions extended to match site behaviour.',
    tags: ['M1 → M2', 'Data migration', 'PDP rebuild', 'Request-a-Quote'],
    details: [
      'Designed and led the migration architecture from Magento 1 to Adobe Commerce On-Premise, including full data migration.',
      'Rebuilt custom themes and redeveloped extensions on the new architecture, preserving existing business logic.',
      'Rebuilt the product page end-to-end: brand display, extra info, custom labels, shipping data, stock ETA and warranty.',
      'Request-a-Quote and Request-a-Catalogue features, each with its own entity, admin grid and e-mail notifications.',
      'Extended Amasty Banner Slider, Mirasvit Search Ultimate, WeltPixel Owl Carousel, Trustpilot Reviews and Xtento PDF for site-specific behaviour.',
      'Admin IP-logging page and extra order-view tooling for support staff.',
      'Managed Git workflow, code reviews and deployments through migration and post-launch stabilisation.',
      'Post-migration performance work, including removing a sitewide auth-popup block for faster page loads.',
    ],
  },
  {
    n: '05', category: 'Headless PWA', title: 'Switch', place: 'Saudi Arabia', platform: 'Adobe Commerce (GraphQL)',
    desc: 'GraphQL-only backend for a fully headless PWA storefront, centred on a drag-and-drop dashboard builder.',
    problem: 'Customisable product options were silently dropped on add-to-cart, but only through GraphQL.',
    solution: 'Traced the bug to the cart-mutation resolver rather than the cart logic and fixed it with a narrowly scoped override, alongside a schema extended across every storefront domain.',
    tags: ['GraphQL', 'Headless / PWA', 'Dashboard builder', 'Store locator'],
    details: [
      'GraphQL-only backend with no classic Luma theme; the customer-facing frontend is a separate PWA.',
      'Drag-and-drop homepage/dashboard builder exposed through a composite GraphQL resolver.',
      'Extended the GraphQL schema across catalog, customer, checkout, store config, compare list, wishlist, reviews and product alerts.',
      'GraphQL store locator (store CRUD plus per-product availability) and warranty products attached to the items they cover.',
      'Fixed customisable options being dropped on add-to-cart, traced to the cart-mutation resolver.',
      'Brand-logo slider, back-in-stock “notify me” mutation, and Tabby merchant config exposed via StoreConfig.',
    ],
  },
  {
    n: '06', category: 'B2B catalog', title: 'Sterling Machinery', place: 'USA', platform: 'Magento Open Source',
    desc: 'A master/child machinery data architecture with nine custom product entities, a full buy/sell/wanted lead-capture pipeline, and a custom-skinned admin theme.',
    problem: 'Complex machinery data — specs, job costing, capacity ratings and repair history — on a platform that started as custom PHP.',
    solution: 'Migration from custom PHP to Magento 1 and then Magento 2, nine product data entities on the product form, and Cart2Quote-based RFQs.',
    tags: ['Architecture', 'Migration', 'Cart2Quote', 'Lead capture'],
    details: [
      'Designed the machinery product architecture, including the master/child data model.',
      'Migrated the platform from custom PHP to Magento 1, then to Magento 2 Open Source.',
      'Buy/sell/wanted lead-capture pipeline: five parallel form-to-admin-grid-to-email systems, plus liquidation and shipping-info requests.',
      'Nine custom product data entities (job-cost accounting, accessories, specifications, capacity ratings, repair history) on the product form.',
      'Brand CMS entity with brochure uploads and nine directory/landing-page modules.',
      'RFQ/quoting on top of Cart2Quote, plus four admin reporting screens.',
      'A custom adminhtml theme alongside the storefront theme.',
      'Video/data integration API and a separate Web API for auction feeds.',
    ],
  },
  {
    n: '07', category: 'Fashion & beauty', title: 'Minamin', place: 'Kuwait', platform: 'Adobe Commerce (Magento 2)',
    desc: 'Two fashion and beauty storefronts with heavy LESS/SCSS theming, split ERP sync, and from-scratch banner and product-label admin systems.',
    problem: 'Immediate order operations were tangled with slow background ERP exports.',
    solution: 'ERP sync split into a scheduled cron push for inventory, prices, products and orders, and a separate async RabbitMQ order-export queue.',
    tags: ['ERP sync', 'RabbitMQ', 'Admin CRUD', 'GDPR'],
    details: [
      'Customised two Magedelight themes (BeautyGo, FashionGo) with 203 style files layered on the base themes.',
      'Split ERP sync into a scheduled cron module and an async RabbitMQ order-export queue.',
      'Two from-scratch admin CRUD systems: a banner slider (desktop/mobile images, page targeting) and store-scoped product labels.',
      'GDPR consent capture at login and registration, with full consent logging.',
      '“Buy Now” checkout bypass with bundle support, and AJAX add-to-wishlist across listing, product and search pages.',
      'Customised OTP mobile login and Facebook/Google social login.',
    ],
  },
  {
    n: '08', category: 'Marketplace', title: 'Aquanexus', place: 'USA', platform: 'Magento Open Source',
    desc: 'A multi-vendor marketplace with a from-scratch admin ACL and a shared theme framework powering 8 related storefronts.',
    problem: 'Running many vendor sites from one Magento instance without leaking orders, customers or reports between them.',
    solution: 'AdvPermission, a from-scratch ACL scoping admin data by website and a custom split attribute, rewriting about 40 admin grid collections and blocks.',
    tags: ['Multi-vendor', 'Admin ACL', 'Domain mapping', 'Webkul'],
    details: [
      'Multiple independent vendor websites from a single Magento instance via domain mapping.',
      'AdvPermission: admin ACL scoping orders, customers, products, reports and CMS by website/store and a split attribute (~40 grid collections and blocks rewritten).',
      'Draft-Order/QuickPay flow for admin-generated payment links with status tracking.',
      'Payment Reminder module with automated COD/bank-transfer reminders escalating to a final notice with a PDF attached.',
      'Customised Webkul modules for vendor registration, purchase orders and split orders.',
      'Shared base theme for 8 storefronts: 471 templates and 427 LESS/SCSS files.',
    ],
  },
  {
    n: '09', category: 'Localisation', title: 'Kalombo', place: 'Moscow, Russia', platform: 'Magento Open Source',
    desc: 'Performance-first architecture with Russia-specific payments, localised address entry and full homepage SEO and schema tooling.',
    problem: 'Russian address entry, local payment methods and bilingual SEO, without giving up page speed.',
    solution: 'Auto Address API integration, Russia-specific payments, RU/EN Open Graph and JSON-LD tagging, and unused modules stripped out.',
    tags: ['Performance', 'i18n', 'SEO / schema', 'GTM'],
    details: [
      'Platform architecture designed with performance as the primary constraint.',
      'Built natively on Magento Open Source with Auto Address API integration for localised address entry.',
      'Russia-specific payment methods for local market requirements.',
      'CSV product/attribute imports, and performance gains from removing unused modules.',
      'Homepage SEO tooling: Open Graph, Twitter Card and JSON-LD Organization schema, GTM and AdSense, with RU/EN variants per store.',
      'AJAX featured-products widget with 6 sort modes and a configurable count.',
    ],
  },
  {
    n: '10', category: 'Grocery & retail', title: 'Punjabstore', place: '', platform: 'Magento Open Source',
    desc: 'Configurable-product pricing, mini-cart messaging and PDF invoice localisation for a Codazon-themed storefront.',
    problem: 'Configurable products showed misleading prices, and invoices didn’t match local business terms.',
    solution: 'Lowest-child configurable pricing, delivery and discount messaging in the mini-cart, and relabelled PDF invoice fields.',
    tags: ['Catalog pricing', 'Mini-cart', 'PDF invoices', 'Mobile API'],
    details: [
      'Lowest-child configurable-product pricing and mini-cart delivery/discount messaging.',
      'Mobile-app version-check API and a lightweight customer-detail AJAX endpoint.',
      'Breadcrumbs reflecting category context passed via URL parameters.',
      'PDF invoice fields relabelled for local requirements (e.g. “SKU” to “Packing Size”).',
    ],
  },
  {
    n: '11', category: 'B2B quoting', title: 'Siemens', place: '', platform: 'Magento Open Source',
    desc: 'A parallel Request-a-Quote system replacing cart and checkout for quote-eligible products, with sitewide price hiding and admin category tooling.',
    problem: 'Quote-eligible products needed a buying path with no public prices and no standard checkout.',
    solution: 'A quote flow that replaces cart, mini-cart and checkout for flagged products, built on Magecomp Emailquotepro.',
    tags: ['Request-a-Quote', 'B2B', 'Admin tools'],
    details: [
      'Parallel “Request a Quote” flow replacing cart, mini-cart and checkout UI for quote-eligible products, on top of Magecomp Emailquotepro.',
      'Pricing hidden sitewide for products flagged “Is Quoteable”, with a dedicated thank-you page.',
      'Admin category import/export tooling and a configurable sitewide sticky notification bar.',
    ],
  },
  {
    n: '12', category: 'Print & signage', title: '2D Layer', place: '', platform: 'Magento Open Source',
    desc: 'A build-and-price flow for custom-cut printed film and vinyl products, with a Request-a-Quote mini-cart and a from-scratch theme.',
    problem: 'Layered, custom-cut print products can’t be priced as fixed SKUs.',
    solution: 'A configurable build-and-price flow with its own AJAX add-to-cart endpoint, and zero-price quote-only items with per-item size and quantity rules.',
    tags: ['Product configurator', 'AJAX cart', 'Request-a-Quote', 'Custom theme'],
    details: [
      'Build-and-price flow for custom-cut printed film/vinyl/substrate products via a dedicated AJAX add-to-cart endpoint.',
      '“Request a Quote” mini-cart with zero-price handling and per-item max quantity/size rules.',
      'Custom theme extending core Luma/Blank.',
    ],
  },
];

export const skills = [
  { group: 'Adobe Commerce & Magento', items: ['Adobe Commerce Cloud', 'On-Premise', 'Magento 2', 'Magento Open Source', 'Custom modules', 'EAV', 'Plugins & observers', 'Indexers', 'MSI'] },
  { group: 'Backend', items: ['PHP', 'OOP', 'MySQL', 'Design patterns', 'Event-driven architecture', 'RabbitMQ', 'MessageQueue'] },
  { group: 'APIs & Integration', items: ['REST', 'SOAP', 'GraphQL resolvers', 'SAP', 'Dynamics AX', 'Payment gateways', 'Loyalty & promotions'] },
  { group: 'Headless & Frontend', items: ['Headless commerce', 'PWA', 'React.js', 'KnockoutJS', 'RequireJS', 'LESS / SCSS', 'Layout XML'] },
  { group: 'Performance & Caching', items: ['Redis', 'Varnish', 'Fastly CDN', 'New Relic', 'Slow-query analysis', 'N+1 fixes'] },
  { group: 'Security', items: ['Code audits', 'Security hardening', 'CSP', 'PCI', 'XSS & injection fixes'] },
  { group: 'Tools', items: ['Git', 'Bitbucket', 'JIRA', 'Composer'] },
  { group: 'Leadership & Delivery', items: ['Code reviews', 'Mentoring', 'Estimation', 'UAT', 'Production support', 'PSR standards'] },
  {
    group: 'Currently learning', learning: true,
    note: 'Actively learning, not yet shipped to production.',
    items: ['Python', 'MongoDB', 'React.js full-stack', 'AI-driven search & personalisation', 'AI in Adobe Commerce'],
  },
];

export const certs = [
  { n: '01', title: 'Adobe Certified Expert', issuer: 'Adobe Commerce Developer', meta: 'Adobe' },
  { n: '02', title: 'Adobe Certified Professional', issuer: 'Adobe Commerce Developer', meta: 'Adobe' },
  { n: '03', title: 'Mountain Movers', issuer: 'Outstanding project delivery', meta: 'Award · Krish TechnoLabs' },
  { n: '04', title: 'Best Team Player', issuer: 'Teamwork & collaboration', meta: 'Award · Sunarc Technologies' },
];

export const education = [
  { degree: 'Master of Computer Applications (MCA)', school: 'Jaipur National University, Jaipur', dates: '2013 — 2014' },
  { degree: 'M.Sc. Information Technology', school: 'Maharaja Ganga Singh University, Bikaner', dates: '2011 — 2013' },
];

// Hero editor snippets. Token kinds: k keyword, t type, f function, v variable, p punctuation.
export const snippets = [
  { file: 'CommerceSolution.php', code: [
    [['class ', 'k'], ['CommerceSolution', 't']],
    [['{', 'p']],
    [['    public function ', 'k'], ['build', 'f'], ['(): ', 'p'], ['Solution', 't']],
    [['    {', 'p']],
    [['        return ', 'k'], ['$this', 'v'], ['->', 'p'], ['createScalableExperience', 'f'], ['();', 'p']],
    [['    }', 'p']],
    [['}', 'p']],
  ] },
  { file: 'DeliveryFeePlugin.php', code: [
    [['class ', 'k'], ['DeliveryFeePlugin', 't']],
    [['{', 'p']],
    [['    public function ', 'k'], ['afterCollect', 'f'], ['(', 'p']],
    [['        Total ', 't'], ['$subject', 'v'], [', ', 'p'], ['Total ', 't'], ['$result', 'v']],
    [['    ): ', 'p'], ['Total', 't'], [' {', 'p']],
    [['        return ', 'k'], ['$this', 'v'], ['->fees->', 'p'], ['apply', 'f'], ['($result);', 'p']],
    [['    }', 'p']],
    [['}', 'p']],
  ] },
  { file: 'cart.graphql', code: [
    [['query ', 'k'], ['CartTotals', 'f'], ['(', 'p'], ['$id', 'v'], [': ', 'p'], ['String!', 't'], [') {', 'p']],
    [['  cart', 'f'], ['(cart_id: ', 'p'], ['$id', 'v'], [') {', 'p']],
    [['    prices ', 'f'], ['{', 'p']],
    [['      grand_total ', 'f'], ['{ value currency }', 'p']],
    [['    }', 'p']],
    [['  }', 'p']],
    [['}', 'p']],
  ] },
];
