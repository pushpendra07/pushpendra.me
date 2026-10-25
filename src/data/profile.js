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
    desc: 'Backend architecture for an omnichannel grocery and quick-commerce platform: online ordering, store picking, delivery, click-and-collect and prepared food.',
    problem: 'Catalog, price and stock updates for thousands of SKUs had to reach the storefront and search without full reindexes or re-syncs.',
    solution: 'A bulk catalog API handling up to 20,000 SKUs per request, with targeted cache-tag invalidation, partial reindexing and delta search sync.',
    tags: ['MSI', 'Talon.One', 'SAP', 'RabbitMQ'],
  },
  {
    n: '02', category: 'Headless & ERP', title: 'Antoine Online', place: 'Beirut, Lebanon', platform: 'Adobe Commerce Cloud',
    desc: 'Two-way ERP sync for catalog, customers and orders, plus a GraphQL layer for a headless storefront.',
    problem: 'Arabic product URLs were broken by Magento’s default URL-key sanitisation.',
    solution: 'A custom front-controller router for clean, SEO-friendly Arabic URLs, alongside GraphQL extensions across catalog, customer and checkout.',
    tags: ['GraphQL', 'ERP', 'Routing'],
  },
  {
    n: '03', category: 'Fulfilment', title: 'Fantasy World Toys', place: 'Kuwait City, Kuwait', platform: 'Adobe Commerce On-Premise',
    desc: 'Primary technical owner for the engagement, covering backend delivery, integrations and production support.',
    problem: 'A new fulfilment model needed Express, Home Delivery, Click & Collect and Curbside options with store-level stock.',
    solution: 'Delivery workflows with cutoff times and SMS milestones, a store locator with pickup availability, and Dynamics AX tied to Knet, UPay and Tabby.',
    tags: ['Dynamics AX', 'Algolia', 'Tabby'],
  },
  {
    n: '04', category: 'Migration', title: 'ToolMart', place: 'Perth, Australia', platform: 'Adobe Commerce On-Premise',
    desc: 'Designed and led the move from Magento 1 to Adobe Commerce, through to post-launch stabilisation.',
    problem: 'An ageing Magento 1 store with a fragmented mix of third-party extensions.',
    solution: 'Data migration, theme rebuild and extension modernisation, with Amasty, Mirasvit, WeltPixel and Trustpilot unified into one storefront.',
    tags: ['M1 → M2', 'Theme', 'Git'],
  },
  {
    n: '05', category: 'Headless PWA', title: 'Switch', place: 'Saudi Arabia', platform: 'Adobe Commerce Cloud',
    desc: 'GraphQL API layer for a headless PWA storefront with ERP-synchronised catalog, inventory and orders.',
    problem: 'Merchandisers needed to change the homepage without developers or a deployment.',
    solution: 'GraphQL APIs behind a drag-and-drop homepage builder, plus Tabby BNPL and a store-availability API in the headless checkout.',
    tags: ['GraphQL', 'PWA', 'Tabby'],
  },
  {
    n: '06', category: 'Marketplace', title: 'Aquanexus', place: 'USA', platform: 'Magento Open Source',
    desc: 'A custom multi-vendor marketplace running independent vendor sites from one Magento instance.',
    problem: 'Opening the store to third-party sellers without losing control of data access.',
    solution: 'A from-scratch admin ACL and seller onboarding, plus an order-splitting engine with per-seller shipping rates.',
    tags: ['ACL', 'Split orders', 'Webkul'],
  },
  {
    n: '07', category: 'B2B catalog', title: 'Sterling Machinery', place: 'USA', platform: 'Magento 2',
    desc: 'Led the migration from custom PHP to Magento 1 and then Magento 2 for an industrial machinery dealer.',
    problem: 'Complex machinery data — master-child products, specs and job costing — and access split by business unit.',
    solution: 'Custom catalog data models, a multi-business-unit admin ACL, and Web APIs for brand, category and search data.',
    tags: ['Cart2Quote', 'Web API', 'ACL'],
  },
  {
    n: '08', category: 'Integration', title: 'Minamin', place: 'Kuwait', platform: 'Adobe Commerce Cloud',
    desc: 'ERP integration and custom merchandising tools for homepage banners and product labels.',
    problem: 'Immediate business operations were tangled with slow background exports.',
    solution: 'Separate synchronous and asynchronous ERP integration paths using RabbitMQ.',
    tags: ['RabbitMQ', 'ERP', 'Admin UI'],
  },
  {
    n: '09', category: 'Localisation', title: 'Kalombo', place: 'Moscow, Russia', platform: 'Magento Open Source',
    desc: 'Built the multilingual store natively on Magento and owned the roadmap, Git setup and production timeline.',
    problem: 'Russian address entry, payment methods and language-aware SEO.',
    solution: 'Auto Address API integration, Russia-specific payments, language-aware meta tags and a leaner theme for speed.',
    tags: ['i18n', 'Payments', 'Performance'],
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
];

export const certs = [
  { n: '01', title: 'Adobe Certified Expert', issuer: 'Adobe Commerce Developer', meta: 'Adobe' },
  { n: '02', title: 'Adobe Certified Professional', issuer: 'Adobe Commerce Developer', meta: 'Adobe' },
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
