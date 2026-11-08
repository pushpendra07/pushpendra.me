// Site configuration.
export const config = {
  // Email, reversed and base64-encoded so scrapers cannot read it (decoded in src/lib/email.js).
  emailEncoded: 'bW9jLm9vaGF5QDcwYXJkbmVwaHN1cA==',
  linkedinUrl: 'https://www.linkedin.com/in/pushpendra07/',
  // Optional — the GitHub links stay hidden until this is set.
  githubUrl: 'https://github.com/pushpendra07',
  // public/Pushpendra-Singh-Resume.pdf
  resumeReady: true,
  // Shows the amber "placeholder · to confirm" notes while content is unverified.
  showPlaceholderNotes: false,
  // public/images/portrait-{480,760}.{webp,jpg}
  portrait: '/images/portrait',
  location: 'Bikaner, Rajasthan, India',
  timeZone: 'Asia/Kolkata',
  // true: show each project's neutral `alias` instead of the client's name (titles and URLs).
  anonymizeClients: false,
  availableFor: ['Immediate joiner', 'Full-time roles', 'Contract / freelance', 'Adobe Commerce consulting'],
};

export const nav = [
  ['projects', 'Work'],
  ['experience', 'Experience'],
  ['skills', 'Skills'],
  ['ai-builds', 'AI builds'],
  ['how', 'How I work'],
  ['contact', 'Contact'],
];

// `count` animates up to the number, then `suffix` is appended. Each tile links to the
// section that backs it up; `icon` names a glyph in src/components/TechIcon.jsx.
export const stats = [
  { count: 12, suffix: '+', label: 'Years in software development', note: 'Since 2014 · Magento 1 to Adobe Commerce', icon: 'calendar', href: '#experience' },
  { count: 8, suffix: '', label: 'Countries of international clients', note: 'Middle East · Asia-Pacific · Europe · USA', icon: 'globe', href: '#projects' },
  { count: 12, suffix: '', label: 'Client platforms delivered', note: 'Each with a full case study', icon: 'layers', href: '#projects' },
  { count: 2, suffix: '', label: 'Adobe Commerce Developer certifications', note: 'Adobe Certified Expert & Professional', icon: 'award', href: '#certifications' },
];

export const strengths = [
  { n: '/01', icon: 'bag', title: 'Adobe Commerce engineering', text: 'Cloud, on-premise and Open Source: custom modules, MSI, promotion engines, checkout and payments.' },
  { n: '/02', icon: 'sync', title: 'ERP & integrations', text: 'SAP, Microsoft Dynamics AX, Talon.One, payment gateways and delivery partners over REST, GraphQL and RabbitMQ.' },
  { n: '/03', icon: 'gauge', title: 'Performance & security', text: 'Redis, Varnish, Fastly and New Relic profiling, plus code audits, CSP and PCI hardening.' },
  { n: '/04', icon: 'users', title: 'Technical leadership', text: 'Code reviews, mentoring, estimation and UAT ownership from requirements to production.' },
];

export const experience = [
  {
    title: 'Senior Software Developer (Tech Lead responsibilities)',
    employer: 'Krish TechnoLabs · Remote',
    dates: 'Sep 2021 to present',
    points: [
      'Own end-to-end delivery of Adobe Commerce platforms for international clients: solution design, custom modules, ERP and data migration, integrations, deployment and production support.',
      'Primary technical point of contact, turning complex business requirements into scalable architecture, technical designs and delivery plans.',
      'Lead performance work with New Relic, PageSpeed Insights and GTmetrix across page rendering, database queries, checkout and GraphQL response times.',
      'Run codebase and custom-module audits for duplicated logic, conflicting overrides and security gaps, and set coding, PSR, security-review and UAT standards.',
      'Standardise reusable module patterns across client projects: service contracts, repository and API interfaces, and UI DataProvider modifiers.',
    ],
    stack: ['Adobe Commerce Cloud', 'Magento 2', 'GraphQL', 'RabbitMQ', 'SAP', 'New Relic'],
  },
  {
    title: 'Senior Software Developer',
    employer: 'Sunarc Technologies · Bikaner',
    dates: 'Mar 2014 to Sep 2021',
    points: [
      'Designed RESTful APIs and backend integrations for third-party services on Magento 2 stores.',
      'Resolved architectural, database and application-performance bottlenecks to improve scalability and stability.',
      'Built reusable Magento 1/2 extensions: Volumetric Shipping, Split Cart, Free Shipping Goal Sticky Bar, and Category Image & Description Block.',
      'Led client requirement analysis and mentored junior developers through code reviews, Git workflows and debugging sessions.',
    ],
    stack: ['Magento 1', 'Magento 2', 'PHP', 'MySQL', 'REST'],
  },
];

// Filter chips for the projects grid; each project lists the keys it belongs to in `focus`.
export const projectFilters = [
  ['headless', 'Headless & GraphQL'],
  ['erp', 'ERP & integrations'],
  ['fulfilment', 'Fulfilment & payments'],
  ['b2b', 'Marketplace & B2B'],
  ['migration', 'Migrations'],
  ['catalog', 'Catalog & storefront'],
];

// Each project also gets a case-study page at /projects/<slug>/.
// `points`: three short lines shown on the home page card; `desc` is the full summary.
export const projects = [
  {
    n: '01', category: 'Omnichannel grocery', slug: 'grandiose-supermarket', focus: ['headless', 'erp', 'fulfilment'], title: 'Grandiose Supermarket', alias: 'Omnichannel grocery platform', place: 'Dubai, UAE', platform: 'Magento Open Source',
    points: ['Talon.One and Magento discounts, switchable per store', 'In-store picker and dispatch app on GraphQL', 'SAP ERP fed by every order event through queues'],
    desc: 'Dual discount-engine architecture (Talon.One + Zinrelo), a from-scratch in-store Picker/Dispatch app, SAP ERP wired into every order event, and multiple GraphQL modules powering a headless storefront.',
    problem: 'Store picking, substitutions, promotions, loyalty and SAP all had to agree on the same cart and stock, across many physical stores selling the same SKUs.',
    solution: 'A per-store switch handing cart discounts to Talon.One, multiple GraphQL modules behind a Picker & Dispatcher app, rewritten MSI reservations, and SAP plus a separate queue feeding a live operations dashboard.',
    tags: ['Talon.One', 'SAP', 'Headless GraphQL', 'Zinrelo', 'RabbitMQ'],
    metrics: [
      { value: '20K', label: 'SKUs per ERP import batch' },
      { value: '3–5 s', label: 'to export 50,000 products' },
    ],
    details: [
      'Config-driven switch letting Talon.One take over cart discount calculation per store in place of the native/Zinrelo engine, with plugin hooks across payments, order placement, store credit and gift cards keeping both systems in sync.',
      'Backend for an in-store Picker and Dispatcher app (multiple GraphQL modules): aisle-by-aisle picking, fresh-prep flagging, bag tracking, and dispatch to third-party logistics or self-delivery with OTP-verified handoff.',
      'Substitution-confirmation flow that starts in-app and escalates to an automated IVR phone call if the customer doesn’t respond, so an unreachable customer never stalls an order.',
      'Rewrote MSI reservation and stock-deduction logic so counts stayed accurate while many stores sold the same SKU and pickers pulled items off shelves in real time.',
      'SAP ERP wired into every order-lifecycle stage (returns, RMA fees, inventory shifts, shipments), with an independent message-queue layer feeding a real-time operations dashboard.',
      'Zinrelo loyalty built into the sales-rule engine as first-class cart rules, including receipt-scan point claims, refer-a-friend rewards and reward history.',
      'Multiple GraphQL modules (payments, gift cards, wishlist, inventory, store credit) for the headless storefront, plus a drag-and-drop homepage builder.',
      'ERP import pipeline processing 10,000–20,000 SKUs per batch, and a timing-out CSV export rewritten to output 50,000 products in 3–5 seconds.',
      'Zone-based inventory and geofencing with admin-drawn Google Maps delivery polygons, tied to Express, Home, Click & Collect and Curbside modes with per-mode cutoffs.',
      'Message-queue order workflow integrating Grubtech (kitchen display) and FarEye (last-mile logistics) with a shared webhook-plus-retry pattern.',
      'Rule-based customer segments, age-restricted product controls, Adjust attribution and MoEngage engagement campaigns.',
    ],
  },
  {
    n: '02', category: 'Fulfilment', slug: 'fantasy-world-toys', focus: ['erp', 'fulfilment'], title: 'Fantasy World Toys', alias: 'Toy retail fulfilment platform', place: 'Kuwait City, Kuwait', platform: 'Adobe Commerce On-Premise',
    points: ['Led a team of 2–3 developers', 'Four delivery modes, each with its own payment rules', 'Dynamics AX bridge plus Knet, UPay and Tabby payments'],
    desc: 'Led a 2–3 developer team building a multi-mode delivery engine, a Microsoft Dynamics AX ERP bridge and Kuwait-specific payments across multiple custom modules.',
    problem: 'A new fulfilment model needed Express, Home Delivery, Click & Collect and Curbside options, each with its own payment rules and customer notifications.',
    solution: 'A multi-mode delivery engine with SMS milestones, Knet, UPay, CyberSource and Tabby payments, and a Dynamics AX bridge for categories, customers and orders.',
    tags: ['Team lead', 'Dynamics AX', 'Algolia', 'Knet + UPay', 'Tabby'],
    metrics: [
      { value: '4', label: 'delivery modes' },
      { value: '62', label: 'third-party override touch-points' },
      { value: '2–3', label: 'developers led' },
    ],
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
    n: '03', category: 'ERP integration', slug: 'antoine-online', focus: ['erp', 'catalog'], title: 'Antoine Online', alias: 'ERP-integrated retail platform', place: 'Beirut, Lebanon', platform: 'Adobe Commerce Cloud',
    points: ['Two-way ERP sync for products, prices, stock and orders', 'Custom router for Arabic product URLs', 'Back-order bug fixed at the root in the CSV import'],
    desc: 'Two-way ERP sync, Arabic-language product URLs, and a multi-website switcher with country-based shipping restrictions, across multiple custom modules.',
    problem: 'Arabic product URLs were stripped by Magento’s default URL sanitiser, and a recurring back-order bug kept surfacing through imports.',
    solution: 'A custom front-controller router for Arabic URLs, a root-cause CSV import patch, and a two-way ErpBridge sync with an admin monitoring grid.',
    tags: ['ERP', 'REST APIs', 'Arabic URLs', 'Multi-website'],
    metrics: [
      { value: '6', label: 'data types in the two-way ERP sync' },
    ],
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
    n: '04', category: 'Migration', slug: 'toolmart', focus: ['migration', 'catalog'], title: 'ToolMart', alias: 'Tools retailer migration', place: 'Perth, Australia', platform: 'Adobe Commerce On-Premise',
    points: ['Led the Magento 1 to Adobe Commerce migration', 'Rebuilt the product page end to end', 'Request-a-Quote and Request-a-Catalogue features'],
    desc: 'Led migration architecture from Magento 1 to Adobe Commerce On-Premise, rebuilt the PDP end-to-end, and delivered Request-a-Quote and Request-a-Catalogue across multiple custom modules.',
    problem: 'An ageing Magento 1 store with a fragmented mix of third-party extensions and business logic that had to survive the move.',
    solution: 'Full data migration, rebuilt themes and extensions, a new product page, and five purchased extensions extended to match site behaviour.',
    tags: ['M1 → M2', 'Data migration', 'PDP rebuild', 'Request-a-Quote'],
    metrics: [
      { value: '5', label: 'purchased extensions extended' },
    ],
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
    n: '05', category: 'Headless PWA', slug: 'switch', focus: ['headless'], title: 'Switch', alias: 'Headless PWA commerce backend', place: 'Saudi Arabia', platform: 'Adobe Commerce (GraphQL)',
    points: ['GraphQL-only backend for a headless PWA', 'Schema extended across 8 storefront domains', 'Cart bug traced to the mutation resolver and fixed'],
    desc: 'GraphQL-only backend for a fully headless PWA storefront, centred on a drag-and-drop dashboard builder.',
    problem: 'Customisable product options were silently dropped on add-to-cart, but only through GraphQL.',
    solution: 'Traced the bug to the cart-mutation resolver rather than the cart logic and fixed it with a narrowly scoped override, alongside a schema extended across every storefront domain.',
    tags: ['GraphQL', 'Headless / PWA', 'Dashboard builder', 'Store locator'],
    metrics: [
      { value: '8', label: 'GraphQL schema domains extended' },
    ],
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
    n: '06', category: 'B2B catalog', slug: 'sterling-machinery', focus: ['migration', 'b2b', 'catalog'], title: 'Sterling Machinery', alias: 'Heavy-equipment dealer platform', place: 'USA', platform: 'Magento Open Source',
    points: ['Nine custom product data entities', 'Migrated custom PHP to Magento 1, then Magento 2', 'Five buy, sell and wanted lead pipelines'],
    desc: 'A master/child machinery data architecture with nine custom product entities, a full buy/sell/wanted lead-capture pipeline, and a custom-skinned admin theme.',
    problem: 'Complex machinery data (specs, job costing, capacity ratings and repair history) on a platform that started as custom PHP.',
    solution: 'Migration from custom PHP to Magento 1 and then Magento 2, nine product data entities on the product form, and Cart2Quote-based RFQs.',
    tags: ['Architecture', 'Migration', 'Cart2Quote', 'Lead capture'],
    metrics: [
      { value: '9', label: 'custom product data entities' },
      { value: '5', label: 'lead-capture pipelines' },
      { value: '3', label: 'platforms: custom PHP → M1 → M2' },
    ],
    details: [
      'Designed the machinery product architecture, including the master/child data model.',
      'Migrated the platform from custom PHP to Magento 1, then to Magento 2 Open Source.',
      'Buy/sell/wanted lead-capture pipeline: five parallel form-to-admin-grid-to-email systems, plus liquidation and shipping-info requests.',
      'Nine custom product data entities (job-cost accounting, accessories, specifications, capacity ratings, repair history) on the product form.',
      'Brand CMS entity with brochure uploads and multiple directory/landing-page modules.',
      'RFQ/quoting on top of Cart2Quote, plus four admin reporting screens.',
      'A custom adminhtml theme alongside the storefront theme.',
      'Video/data integration API and a separate Web API for auction feeds.',
    ],
  },
  {
    n: '07', category: 'Fashion & beauty', slug: 'minamin', focus: ['erp', 'catalog'], title: 'Minamin', alias: 'Fashion & beauty storefronts', place: 'Kuwait', platform: 'Adobe Commerce (Magento 2)',
    points: ['Two fashion and beauty storefronts', 'ERP sync split into cron and a RabbitMQ queue', 'Banner and product-label admin built from scratch'],
    desc: 'Two fashion and beauty storefronts with heavy LESS/SCSS theming, split ERP sync, and from-scratch banner and product-label admin systems.',
    problem: 'Immediate order operations were tangled with slow background ERP exports.',
    solution: 'ERP sync split into a scheduled cron push for inventory, prices, products and orders, and a separate async RabbitMQ order-export queue.',
    tags: ['ERP sync', 'RabbitMQ', 'Admin CRUD', 'GDPR'],
    metrics: [
      { value: '2', label: 'storefronts' },
      { value: '203', label: 'style files over the base themes' },
      { value: '2', label: 'admin CRUD systems built from scratch' },
    ],
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
    n: '08', category: 'Marketplace', slug: 'aquanexus', focus: ['b2b', 'fulfilment'], title: 'Aquanexus', alias: 'Multi-vendor marketplace', place: 'USA', platform: 'Magento Open Source',
    points: ['Eight vendor storefronts on one Magento instance', 'Custom admin ACL re-scoping about 40 grids', 'Payment links and automated payment reminders'],
    desc: 'A multi-vendor marketplace with a from-scratch admin ACL and a shared theme framework powering 8 related storefronts.',
    problem: 'Running many vendor sites from one Magento instance without leaking orders, customers or reports between them.',
    solution: 'AdvPermission, a from-scratch ACL scoping admin data by website and a custom split attribute, rewriting about 40 admin grid collections and blocks.',
    tags: ['Multi-vendor', 'Admin ACL', 'Domain mapping', 'Webkul'],
    metrics: [
      { value: '8', label: 'storefronts on one theme framework' },
      { value: '~40', label: 'admin grids and blocks re-scoped' },
      { value: '471', label: 'templates in the shared theme' },
    ],
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
    n: '09', category: 'Localisation', slug: 'kalombo', focus: ['catalog'], title: 'Kalombo', alias: 'Russian e-commerce storefront', place: 'Moscow, Russia', platform: 'Magento Open Source',
    points: ['Performance-first Magento architecture', 'Russian payments and local address entry', 'Russian and English SEO with JSON-LD schema'],
    desc: 'Performance-first architecture with Russia-specific payments, localised address entry and full homepage SEO and schema tooling.',
    problem: 'Russian address entry, local payment methods and bilingual SEO, without giving up page speed.',
    solution: 'Auto Address API integration, Russia-specific payments, RU/EN Open Graph and JSON-LD tagging, and unused modules stripped out.',
    tags: ['Performance', 'i18n', 'SEO / schema', 'GTM'],
    metrics: [
      { value: '2', label: 'store languages: Russian and English' },
    ],
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
    n: '10', category: 'Grocery & retail', slug: 'punjabstore', focus: ['catalog'], title: 'Punjabstore', alias: 'Grocery storefront & app backend', place: '', platform: 'Magento Open Source',
    points: ['Configurable products priced from their cheapest option', 'Delivery and discount messages in the mini-cart', 'Mobile-app version-check API'],
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
    n: '11', category: 'B2B quoting', slug: 'siemens', focus: ['b2b'], title: 'Siemens', alias: 'B2B request-a-quote storefront', place: '', platform: 'Magento Open Source',
    points: ['Request-a-Quote flow replacing cart and checkout', 'Prices hidden for quote-only products', 'Admin category import and export tools'],
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
    n: '12', category: 'Print & signage', slug: '2d-layer', focus: ['b2b', 'catalog'], title: '2D Layer', alias: 'Print product configurator', place: '', platform: 'Magento Open Source',
    points: ['Build-and-price flow for custom-cut print products', 'Request-a-Quote mini-cart with size rules', 'Custom theme on top of Luma'],
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

// Products I built with AI coding agents (my own work, not client projects). Each gets a
// case-study page at /products/<slug>/; its content lives in caseStudies.js under the same slug.
// repoUrl: a public showcase repo (README + screenshots, no source). null = "private repo" note.
// demoUrl: a live demo build. null hides the button.
export const products = [
  {
    kind: 'product', n: 'P1', slug: 'artha360', title: 'Artha360', category: 'Personal finance · India',
    platform: 'FastAPI · React · MongoDB', place: 'Web app · native iOS and Android in progress',
    repoUrl: null, demoUrl: null,
    desc: 'A wealth-management platform for Indian households: net worth, 22 investment types (PPF, EPF, NPS, SGB…), cash flow, goals and budgets, eight reports, plus a full SaaS operator console.',
    tags: ['FastAPI', 'React 19', 'MongoDB', 'TypeScript', 'SwiftUI'],
    metrics: [
      { value: '184', label: 'API routes across 28 routers' },
      { value: '165/165', label: 'backend tests passing' },
      { value: '22', label: 'investment types supported' },
    ],
    details: [
      'Customer auth with signup, OTP verification, password reset, refresh tokens and logout, plus device and session management with forced logout.',
      'Permanent human-readable customer IDs (AR100001), per-platform device capture and a filterable login history.',
      'Investments ledger with a 22-item instrument catalog and FD/RD maturity maths; dedicated mutual-fund (XIRR, 1Y return) and stock (P&L, LTP) modules.',
      'Assets and liabilities with EMI, tenure, rate and repayment progress.',
      'Cashbook for categorised income and expenses, and recurring payments (SIPs, EMIs, premiums, bills) with a paid/upcoming log for every month.',
      'Cash flow with actuals and a forward projection; goals and budgets whose spend is computed live from real expenses.',
      'Dashboard with 8 KPIs, a net-worth time series, allocation, movers, upcoming payments and recent transactions.',
      'Eight report types: net worth, allocation, income vs expense, capital gains, insurance, loans, goal progress and tax.',
      'Multi-family-member tracking under one login, ⌘K federated search, and import/export.',
      'Super Admin console backend: customers, advisors, plans, subscriptions, invoices, coupons, support tickets, staff roles and a platform dashboard.',
      'Separate admin auth track with 2FA by default, rate-limited login, and audited, short-lived customer impersonation.',
      'Every admin change written to an audit log with who, what, old value, new value and IP.',
      'Tests run against a real ephemeral MongoDB instance rather than a mocked database.',
    ],
  },
  {
    kind: 'product', n: 'P2', slug: 'career-intelligence', title: 'Career Intelligence', category: 'Career tools · Job search',
    platform: 'FastAPI · React · PostgreSQL', place: 'Self-hosted web app + Chrome extension',
    repoUrl: null, demoUrl: null,
    desc: 'A self-hosted job-search command center: CVs, companies and jobs from every source, an explainable 0–100 match score, applications, interviews, offers and an assistant chat.',
    tags: ['FastAPI', 'PostgreSQL', 'React 19', 'Tailwind CSS', 'Chrome extension'],
    metrics: [
      { value: '0–100', label: 'explainable match score, 9 parts' },
      { value: '414', label: 'automated tests (264 backend, 150 frontend)' },
      { value: '10+', label: 'job portals and ATSs recognised' },
    ],
    details: [
      'CV upload (PDF, DOCX, TXT, Markdown) with deterministic parsing of experience, roles, skills, projects, certifications and education; CV versions with diffs.',
      'Professional and Target profiles: titles, skills, domains, locations, work model, salary, notice period and exclusions.',
      'Company database with tiers, aliases and field-level provenance: every value keeps its source, URL and a verification status derived from evidence.',
      'SSRF-safe verification of official websites and careers pages; fake or mismatched links are stored as invalid and never shown.',
      'Built-in scanner that searches Greenhouse, Lever, Ashby and Workday boards of tracked companies on a schedule.',
      'JD parsing for required vs preferred skills, years per skill, experience range, salary formats (LPA, lakhs, k), work model and locations.',
      'Deterministic 0–100 match score from nine weighted components, with a skills taxonomy, blocker detection and an off-stack cap.',
      'Deduplication across every source: same link, same posting ID, same company and title in any city, or a repost with a 60%+ similar JD.',
      'Review queue with one-key actions, an admin-grid job list, status tabs and bulk actions.',
      'Pipeline for applications, recruiter CRM, interview rounds, a question bank, prep packs and offer comparison with a negotiation log.',
      'Dashboard, charts, skill-gap analytics and ten date-range reports with CSV and PDF export.',
      'Assistant chat that answers questions and proposes changes as cards you confirm; works without AI, or with an LLM using read-only tools.',
      'Chrome extension that adds the job you are viewing on LinkedIn, Naukri, Indeed or a careers page in one click.',
      'Read-only inbox reader that suggests status changes from rejections, invites and offers; daily backups, audit log, CI and a Playwright smoke test.',
    ],
  },
  {
    kind: 'product', n: 'P3', slug: 'gym-management-platform', title: 'Gym Management Platform', category: 'SaaS · Fitness business',
    platform: 'FastAPI · React · MongoDB · Celery', place: '11 business modules',
    repoUrl: null, demoUrl: null,
    desc: 'An end-to-end system for running a gym: members, memberships with GST invoicing, QR check-in, payments and refunds, trainers and payroll, expenses, equipment, leads, notifications and P&L reports.',
    tags: ['FastAPI', 'MongoDB', 'Redis', 'Celery', 'React', 'TypeScript'],
    metrics: [
      { value: '11', label: 'modules, one consistent architecture' },
      { value: '12', label: 'dashboard KPIs in one API call' },
      { value: '3', label: 'notification channels: email, SMS, WhatsApp' },
    ],
    details: [
      'Layered backend (routes → services → repositories behind interfaces) so business logic is unit-tested against in-memory fakes.',
      'Dashboard KPIs, revenue and attendance charts built on MongoDB $facet/$group aggregation pipelines: one round trip per screen.',
      'Member management with soft delete and restore, search/filter/sort, photo and document uploads, a timeline and a field-level audit log.',
      'Memberships with plan freeze/activate, renewals as linked records, coupons, GST pricing snapshotted at purchase, invoices and payment links.',
      'Attendance with manual and HMAC-signed QR check-in by camera, duplicate guards, late-entry flags, reports and a missed-members list.',
      'Payments as an invoice with an embedded transaction ledger: partial payments, refunds, receipts and a derived status.',
      'Trainer HR: schedules, member assignment, attendance, leave approval, salary plus commission payroll and performance snapshots.',
      'Expenses by category with monthly and yearly reports, and CSV, Excel and PDF export from one column definition.',
      'Equipment inventory with warranty, maintenance and repair ledgers, service schedules, barcodes and QR codes.',
      'Lead pipeline with sources, follow-ups, staff assignment and conversion-rate reporting.',
      'Notifications over SMTP email and Twilio SMS/WhatsApp, with templates and a Celery-beat scheduler for expiry, payment and follow-up reminders.',
      'Cross-module reports including a real profit & loss, plus gym settings, branches, staff roles, global audit log and JSON backup/restore.',
      'Production Docker setup: static frontend behind nginx and a hardened, non-root API image.',
    ],
  },
  {
    kind: 'product', n: 'P4', slug: 'magento-2-developer-toolkit', title: 'Magento 2 Developer Toolkit', category: 'Developer tools · Magento',
    platform: 'FastAPI · React · MongoDB', place: 'Self-hosted developer toolkit',
    repoUrl: null, demoUrl: null,
    desc: 'A toolkit for day-to-day Magento 2 work: a module generator, README and table-rate generators, a config diff for core_config_data, and searchable CLI, event and cron references.',
    tags: ['Magento 2', 'FastAPI', 'React', 'TypeScript', 'MongoDB'],
    metrics: [
      { value: '7', label: 'working tools' },
      { value: '5', label: 'optional scaffolds per generated module' },
    ],
    details: [
      'Module generator producing registration.php, module.xml and composer.json, with optional observer, cron, admin grid, console command and frontend block.',
      'README generator for custom modules.',
      'Table-rate generator that outputs a ready-to-import tablerates.csv.',
      'Config diff: paste two core_config_data exports (SQL dump or CSV) and see what was added, removed or changed.',
      'Searchable CLI command reference, core event catalog and core cron-job catalog.',
      'One router and one page per tool, so new tools slot in without touching the others.',
      'Generation and diff history saved in MongoDB.',
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
  { n: '01', icon: 'award', title: 'Adobe Certified Expert', issuer: 'Adobe Commerce Developer', meta: 'Adobe', badge: '/images/certs/adobe-expert.webp', verifyUrl: 'https://certification.adobe.com/credential/verify/0337ceaf-c351-4151-a1b6-dd9e93b6ba6e' },
  { n: '02', icon: 'award', title: 'Adobe Certified Professional', issuer: 'Adobe Commerce Developer', meta: 'Adobe', badge: '/images/certs/adobe-professional.webp', verifyUrl: 'https://certification.adobe.com/credential/verify/a2be427f-cf35-4114-ab9c-5bdb4ca187a2' },
  { n: '03', icon: 'star', title: 'Mountain Movers', issuer: 'Outstanding project delivery', meta: 'Award · Krish TechnoLabs' },
  { n: '04', icon: 'star', title: 'Best Team Player', issuer: 'Teamwork & collaboration', meta: 'Award · Sunarc Technologies' },
];

// Recommendations, e.g. from LinkedIn — only real quotes, used with permission. The section
// stays hidden while this is empty. Shape: { quote, name, role, relation?, url? }.
export const testimonials = [];

export const education = [
  { degree: 'Master of Computer Applications (MCA)', short: 'MCA', school: 'Jaipur National University' },
  { degree: 'M.Sc. Information Technology', short: 'M.Sc. IT', school: 'Maharaja Ganga Singh University' },
];

// ---------- Home page copy and visuals ----------

export const heroChecks = [
  'Custom modules and service contracts',
  'SAP, Dynamics AX and RabbitMQ',
  'Headless GraphQL and PWA',
  'Performance, audits and code reviews',
];

// Placeholder lines the hero prompt box cycles through: real problems the work solves.
export const askPrompts = [
  'Our checkout is slow',
  'We need SAP connected to Magento',
  'Migrate us from Magento 1',
  'Build a headless GraphQL storefront',
  'Audit our custom modules',
];

// Featured project (the first project): one order through the systems built for it, and its numbers.
export const featuredFlow = [
  ['Order placed', 'Mobile app · GraphQL'],
  ['Discount applied', 'Talon.One · per-store switch'],
  ['Stock reserved', 'Multi-source inventory'],
  ['Picked in store', 'Picker app, aisle by aisle'],
  ['Sent to SAP', 'RabbitMQ · auto-retry'],
  ['Delivered', 'OTP-verified handoff'],
];
export const featuredStats = [
  { kicker: 'ERP import', value: '20,000', label: 'SKUs per import batch, at most' },
  { kicker: 'Delivery', value: '4', label: 'modes: Express, Home, Click & Collect, Curbside' },
];
export const featuredExport = { kicker: 'Catalog export', value: '3–5 s', label: 'to export 50,000 products', before: 'Timed out', after: '3–5 s' };

export const howIWork = [
  {
    title: 'Understand the business',
    text: 'I map how orders, stock and money really move before writing code.',
    example: 'Grandiose: pickers, substitutions and SAP had to agree on one cart across many stores',
  },
  {
    title: 'Design the architecture',
    text: 'I extend Magento the way it was built to be extended: service contracts, plugins and queues.',
    example: 'A per-store switch let Talon.One and Magento run side by side with no double discounts',
  },
  {
    title: 'Ship and support',
    text: 'I own code review, UAT, release and production support, so the store keeps working after launch.',
    example: 'Every call to SAP, kitchens and couriers is queued, logged and retried, so no order is lost',
  },
];

export const codeBenefits = [
  ['Orders never get lost.', 'Every call to SAP, kitchens and couriers is queued, logged and retried.'],
  ['Pages stay fast.', 'Redis, Varnish and Fastly tuning, profiled in New Relic.'],
  ['Upgrades stay cheap.', 'Plugins and service contracts instead of core rewrites.'],
];

// Keys into src/data/brands.js: the technology strip under the hero and the chips around the portrait.
export const techStrip = ['adobe', 'magento', 'php', 'graphql', 'rabbitmq', 'sap', 'redis', 'mysql', 'newrelic', 'fastly', 'react', 'docker'];
export const heroChips = [
  ['magento', 'Magento 2', 'Adobe Commerce'],
  ['graphql', 'GraphQL', 'Headless storefronts'],
  ['rabbitmq', 'RabbitMQ', 'Queued order export'],
  ['sap', 'SAP ERP', 'Orders, stock, refunds'],
];

// Skills told as a scroll story (src/sections/Skills.jsx). Every chip comes from `skills` above.
export const skillStory = [
  {
    key: 'platform', label: 'The platform', title: 'It starts with', accent: 'Adobe Commerce.',
    text: 'Cloud or on-premise, Magento 2 or Open Source. Twelve years on the same platform, from Magento 1 to today.',
    chips: ['Adobe Commerce Cloud', 'On-Premise', 'Magento 2', 'Magento Open Source'],
  },
  {
    key: 'code', label: 'The code', title: 'Custom modules,', accent: 'built the Magento way.',
    text: 'Plugins and observers instead of core rewrites, service contracts, EAV, indexers and MSI. PHP with OOP and design patterns.',
    chips: ['PHP', 'OOP', 'Design patterns', 'Plugins & observers', 'EAV', 'Indexers', 'MSI'],
  },
  {
    key: 'systems', label: 'The systems', title: 'Then it talks to', accent: 'everything else.',
    text: 'ERPs, payments and loyalty, over REST, SOAP and message queues, so orders and stock stay in step.',
    chips: ['SAP', 'Dynamics AX', 'Payment gateways', 'Loyalty & promotions', 'REST', 'SOAP', 'RabbitMQ'],
  },
  {
    key: 'front', label: 'The storefront', title: 'Headless when', accent: 'it needs to be.',
    text: 'GraphQL resolvers behind a PWA or React front end, or the classic theme stack with KnockoutJS and layout XML.',
    chips: ['GraphQL resolvers', 'PWA', 'React.js', 'KnockoutJS', 'RequireJS', 'LESS / SCSS', 'Layout XML'],
  },
  {
    key: 'speed', label: 'The speed', title: 'Then it', accent: 'gets fast.',
    text: 'Caching at every layer, then New Relic and slow-query analysis to find what is left. N+1 queries go first.',
    chips: ['Fastly CDN', 'Varnish', 'Redis', 'MySQL', 'New Relic', 'Slow-query analysis', 'N+1 fixes'],
  },
  {
    key: 'secure', label: 'The safety', title: 'And it', accent: 'stays secure.',
    text: 'Code audits and hardening, a strict CSP, PCI in mind, and XSS and injection fixes before they ship.',
    chips: ['Code audits', 'Security hardening', 'CSP', 'PCI', 'XSS & injection fixes'],
  },
  {
    key: 'team', label: 'The delivery', title: 'Shipped with a team,', accent: 'not just code.',
    text: 'Estimates, code reviews, UAT and production support, with PSR standards in Git, Bitbucket, JIRA and Composer.',
    chips: ['Estimation', 'Code reviews', 'UAT', 'Production support', 'Mentoring', 'PSR standards'],
  },
];
