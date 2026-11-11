/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SITE CONTENT — the single source of truth for every word on the site.
 *
 *  Content supplied by Rahim Udin (Upwork profile + portfolio brief).
 *  Upwork stats are as of November 2026: keep them in sync with the profile.
 *  Amounts in `ledgerEntries` are purely decorative (they drive the
 *  "Living Ledger" balance indicator) and are expressed in cents.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const person = {
  name: "Rahim Udin",
  initials: "RU",
  title: "Bookkeeper & Accountant",
  city: "Gilgit-Baltistan",
  region: "",
  country: "Pakistan",
  email: "solutionssmartbooks98@gmail.com",
  phone: "+92 355 5850366",
  hours: "Mon – Fri, 9:00 AM – 1:00 PM Eastern Time, by appointment",
  yearsExperience: 5,
  siteUrl: "https://rahim-udin-bookkeeper.vercel.app",
  socials: [
    { label: "Upwork", href: "https://www.upwork.com/freelancers/rahim01" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/rahim-udin-ab751a24b/" },
    { label: "WhatsApp", href: "https://wa.me/923555850366" },
    { label: "Email", href: "mailto:solutionssmartbooks98@gmail.com" },
  ],
} as const;

export const seo = {
  title: `${person.name} | Freelance Bookkeeper & Accountant`,
  description:
    "Freelance bookkeeper and accountant with 5+ years of experience and a 100% Job Success Score on Upwork. Monthly bookkeeping, reconciliations, catch-up and cleanup, AP/AR and financial reporting in QuickBooks, Xero and Zoho Books.",
  keywords: [
    "freelance bookkeeper",
    "remote bookkeeper",
    "QuickBooks bookkeeper",
    "Xero bookkeeper",
    "Zoho Books",
    "bookkeeping cleanup",
    "bank reconciliation",
    "accounts payable",
    "accounts receivable",
    "Buildium",
    "AppFolio",
  ],
};

export const nav = [
  { label: "About", href: "#about" },
  { label: "Expertise", href: "#expertise" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Experience", href: "#experience" },
  { label: "FAQ", href: "#faq" },
] as const;

/* ── The Living Ledger ──────────────────────────────────────────────────────
 * One entry per section. When a section enters the viewport its entry is
 * "posted". The contact entry's credit is computed as the remainder so the
 * books ALWAYS balance once the visitor sends the invoice.               */
type EntryDraft = { id: string; ref: string; label: string; dr: number; cr: number };

const drafts: EntryDraft[] = [
  { id: "hero", ref: "JE-001", label: "Opening balance", dr: 1_248_000, cr: 0 },
  { id: "about", ref: "JE-002", label: "Story brought forward", dr: 0, cr: 186_000 },
  { id: "expertise", ref: "JE-003", label: "Expertise reconciled", dr: 38_000, cr: 142_000 },
  { id: "services", ref: "JE-004", label: "Services rendered", dr: 64_000, cr: 220_000 },
  { id: "process", ref: "JE-005", label: "Engagement process", dr: 0, cr: 196_000 },
  { id: "experience", ref: "JE-006", label: "Prior contracts", dr: 90_000, cr: 150_000 },
  { id: "results", ref: "JE-007", label: "Balance sheet", dr: 0, cr: 124_000 },
  { id: "tools", ref: "JE-008", label: "Records filed", dr: 0, cr: 48_000 },
  { id: "testimonials", ref: "JE-009", label: "Audit notes", dr: 0, cr: 62_000 },
  { id: "faq", ref: "JE-010", label: "Queries cleared", dr: 0, cr: 36_000 },
];

const totalDr = drafts.reduce((s, e) => s + e.dr, 0);
const totalCr = drafts.reduce((s, e) => s + e.cr, 0);

export const ledgerEntries: EntryDraft[] = [
  ...drafts,
  // The closing entry: posted only when the invoice (contact form) is sent.
  { id: "contact", ref: "JE-011", label: "Engagement received", dr: 0, cr: totalDr - totalCr },
];

/* ── Preloader ──────────────────────────────────────────────────────────── */
export const preloader = {
  label: "Opening balance",
  skip: "Skip",
};

/* ── Hero ───────────────────────────────────────────────────────────────── */
export const hero = {
  eyebrow: `${person.name}, Freelance ${person.title}`,
  // Split into lines so the headline can stagger across the DR / CR rule.
  headline: ["Reliable books.", "Clear", "decisions."],
  lede: `I'm ${person.name}, a freelance bookkeeper and accountant with ${person.yearsExperience}+ years of experience helping businesses keep accurate, organized and up-to-date financial records, so owners understand their numbers and stay focused on running the business.`,
  primaryCta: { label: "Let's discuss your books", href: "#contact" },
  secondaryCta: { label: "View my services", href: "#services" },
  meta: [
    { label: "Job Success", value: "100%" },
    { label: "Upwork earnings", value: "$10K+" },
    { label: "Upwork hours", value: "1,500+" },
    { label: "Completed jobs", value: "23" },
  ],
  hint: "Move your cursor to reconcile the figures",
};

/* ── Receipt tape marquee ───────────────────────────────────────────────── */
export const marquee = [
  "Monthly bookkeeping",
  "Bank reconciliation",
  "QuickBooks Online",
  "Catch-up & cleanup",
  "Xero",
  "Accounts payable",
  "Accounts receivable",
  "Zoho Books",
  "Financial reporting",
  "Chart of accounts setup",
  "Buildium",
  "AppFolio",
  "Software migration",
  "Amazon bookkeeping",
];

/* ── About: journal entries ─────────────────────────────────────────────── */
export const about = {
  kicker: "About",
  title: "The story, posted in order.",
  intro: `I'm ${person.name}, a freelance bookkeeper and accountant with ${person.yearsExperience}+ years of experience. Here's how the account was built, one entry at a time.`,
  portrait: {
    src: "/portrait-placeholder.svg", // TODO: replace with a real portrait (e.g. /portrait.jpg)
    alt: `Portrait of ${person.name}`,
    caption: `${person.name}, ${person.city}, ${person.country}`,
  },
  entries: [
    {
      date: "Step 1",
      ref: "JE-101",
      title: "Built a foundation in accounting",
      body: "Studied Accounting and Finance at Karakoram International University, building a foundation in financial accounting, reporting and business finance.",
      highlight: "Karakoram Int'l University",
    },
    {
      date: "Step 2",
      ref: "JE-102",
      title: "Developed practical bookkeeping experience",
      body: "Over five-plus years, built hands-on experience supporting bookkeeping and accounting work for a wide range of business needs.",
      highlight: "5+ years",
    },
    {
      date: "Step 3",
      ref: "JE-103",
      title: "Expanded across accounting platforms",
      body: "Gained working experience with QuickBooks, Xero, Zoho Books, Wave, Buildium, AppFolio and Excel, and earned certifications in six of them.",
      highlight: "6 certifications",
    },
    {
      date: "Step 4",
      ref: "JE-104",
      title: "Supporting clients remotely",
      body: "Through freelance engagements, supporting clients with bookkeeping, cleanup, reconciliations, software setup and reporting across the USA, UK, Canada and other international markets.",
      highlight: "100% Job Success",
    },
  ],
};

/* ── Expertise: T-accounts ──────────────────────────────────────────────── */
export const expertise = {
  kicker: "Expertise",
  title: "Every skill, both sides of the account.",
  intro:
    "Each card is a T-account: what I cover on the left, what you get on the right. The bars reconcile my book against the bank. When they match, the skill is proven.",
  accounts: [
    {
      code: "1010",
      title: "Bookkeeping & reconciliation",
      covers: ["Transaction categorization", "Bank & credit-card reconciliations", "Month-end organization"],
      delivers: ["Accounts that tie out", "Accurate, current records", "A clean month-end"],
      proficiency: 100,
      details:
        "Every transaction categorized and every bank and credit-card account reconciled, so your records stay accurate month after month.",
      tools: ["QuickBooks Online", "Xero", "Zoho Books"],
    },
    {
      code: "1500",
      title: "QuickBooks & accounting software",
      covers: ["QuickBooks Online & Desktop", "Xero & Zoho Books", "Setup, integrations & migrations"],
      delivers: ["A file set up properly", "A tidy chart of accounts", "No lost history in a move"],
      proficiency: 100,
      details:
        "QuickBooks Level II certified, with hands-on work setting up new files, connecting integrations and migrating businesses between platforms.",
      tools: ["QuickBooks", "Xero", "Zoho Books", "Wave"],
    },
    {
      code: "2000",
      title: "Accounts payable & receivable",
      covers: ["Supplier bill tracking", "Customer invoicing", "Payment records"],
      delivers: ["Bills paid on time", "Invoices that get chased", "Clear outstanding balances"],
      proficiency: 100,
      details:
        "Supplier bills and customer invoices tracked in one place, with outstanding balances monitored so nothing slips through.",
      tools: ["QuickBooks Online", "Xero", "Buildium", "AppFolio"],
    },
    {
      code: "3200",
      title: "Cleanup & financial reporting",
      covers: ["Catch-up bookkeeping", "Correcting miscategorizations", "P&L, balance sheet & cash flow"],
      delivers: ["Books brought current", "Reports you can read", "Numbers you can decide with"],
      proficiency: 100,
      details:
        "Historical transactions reviewed and corrected, then Profit & Loss, Balance Sheet and cash-flow reports prepared from books you can trust.",
      tools: ["QuickBooks Online", "Xero", "Excel"],
    },
  ],
};

/* ── Services: receipts ─────────────────────────────────────────────────── */
export const services = {
  kicker: "Services",
  title: "Itemised, so there are no surprises.",
  intro:
    "Starting prices for each package. The final quote depends on your transaction volume, number of accounts and complexity, and is agreed before work starts. Hourly work from $20/hour.",
  items: [
    {
      id: "monthly",
      name: "Monthly Bookkeeping",
      description: "Your books, kept current every month.",
      lines: ["Transaction categorization", "Bank reconciliation", "Monthly financial reports"],
      price: "from $250",
      cadence: "/ month",
      amount: 25_000,
    },
    {
      id: "cleanup",
      name: "Catch-Up & Cleanup",
      description: "Behind on your books? I'll bring them current.",
      lines: [
        "Historical transaction review",
        "Account reconciliations",
        "Corrected inconsistencies",
        "Organized records",
      ],
      price: "from $350",
      cadence: "/ project",
      amount: 35_000,
    },
    {
      id: "apar",
      name: "Accounts Payable & Receivable",
      description: "Bills and invoices, tracked and organized.",
      lines: ["Supplier bill tracking", "Customer invoicing", "Outstanding balance monitoring", "Payment records"],
      price: "from $200",
      cadence: "/ month",
      amount: 20_000,
    },
    {
      id: "reporting",
      name: "Financial Reporting",
      description: "A clear picture of how the business is doing.",
      lines: ["Monthly Profit & Loss", "Monthly Balance Sheet", "Organized financial data", "Plain-English summary"],
      price: "from $150",
      cadence: "/ month",
      amount: 15_000,
    },
  ],
};

/* ── Process: how an engagement runs ────────────────────────────────────── */
export const process = {
  kicker: "Process",
  title: "From first call to clean books.",
  month: "Engagement file",
  steps: [
    {
      n: "01",
      name: "Discovery",
      body: "We discuss your business, accounting software, where your bookkeeping stands today and what reporting you need.",
      days: "First call",
    },
    {
      n: "02",
      name: "Review & setup",
      body: "I review the available records, identify gaps, and we agree on the scope and priorities.",
      days: "Scope agreed",
    },
    {
      n: "03",
      name: "Bookkeeping",
      body: "I categorize transactions, reconcile accounts, organize payables and receivables, and complete the agreed work.",
      days: "The work",
    },
    {
      n: "04",
      name: "Reporting & handover",
      body: "I share the completed work and reports, explain the key items, and we agree on any next steps.",
      days: "Handover",
    },
  ],
};

/* ── Experience: selected Upwork contracts ──────────────────────────────── */
type Contract = {
  fy: string;
  period: string;
  role: string;
  org: string;
  /** Hours logged on Upwork; null for fixed-price / project contracts. */
  hours: number | null;
  responsibilities: string[];
  achievements: string[];
};

const contracts: Contract[] = [
  {
    fy: "Upwork · 2025 – 2026",
    period: "Oct 2025 – Nov 2026",
    role: "Bookkeeping",
    org: "Eric Breuer Designs, LLC · Hourly contract",
    hours: 426,
    responsibilities: ["Ongoing bookkeeping over a 13-month engagement"],
    achievements: ["5.0 client rating", "$2,122.50 billed", "“He was great working with.”"],
  },
  {
    fy: "Upwork · 2026",
    period: "Mar – Sep 2026",
    role: "QuickBooks & weekly bookkeeping",
    org: "Upwork client · Hourly contract",
    hours: 270,
    responsibilities: ["Weekly bookkeeping in QuickBooks over six months"],
    achievements: ["5.0 client rating", "$2,700 billed"],
  },
  {
    fy: "Upwork · 2026",
    period: "Jul – Aug 2026",
    role: "QuickBooks Online expert: integrations, cleanup & P&Ls",
    org: "Upwork client · Urgent hourly contract",
    hours: 15,
    responsibilities: ["QuickBooks Online integrations", "Cleanup of the books", "Profit & Loss reports"],
    achievements: ["5.0 client rating", "Delivered in two weeks"],
  },
  {
    fy: "Upwork · 2026",
    period: "Jul 2026",
    role: "QuickBooks bookkeeping & accounting",
    org: "Upwork client · Fixed-price contract",
    hours: null,
    responsibilities: ["Bookkeeping and accounting in QuickBooks"],
    achievements: ["5.0 client rating", "$650 fixed price"],
  },
  {
    fy: "Upwork · 2026",
    period: "Mar – Apr 2026",
    role: "Amazon bookkeeper",
    org: "Upwork client · Hourly contract",
    hours: 33,
    responsibilities: ["Bookkeeping for an Amazon seller"],
    achievements: ["5.0 client rating"],
  },
  {
    fy: "Upwork · 2025 – 2026",
    period: "Dec 2025 – Mar 2026",
    role: "QuickBooks cleanup specialist",
    org: "Upwork client · Hourly contract",
    hours: 236,
    responsibilities: ["Cleanup of QuickBooks books"],
    achievements: ["5.0 client rating", "$2,360 billed", "Moved to a long-term contract"],
  },
  {
    fy: "Upwork · 2026",
    period: "Jan 2026",
    role: "Buildium setup for property management",
    org: "Upwork client · Project",
    hours: null,
    responsibilities: ["Buildium setup for a property management business"],
    achievements: ["5.0 client rating", "“Great experience working with this freelancer.”"],
  },
  {
    fy: "Upwork · 2025 – 2026",
    period: "Dec 2025 – Jan 2026",
    role: "Real estate chart of accounts setup",
    org: "Upwork client · Urgent project",
    hours: null,
    responsibilities: ["Chart of accounts setup for a real estate business"],
    achievements: ["5.0 client rating"],
  },
  {
    fy: "Upwork · 2025",
    period: "Nov 2025",
    role: "Xero setup & bank reconciliation, UK VAT e-commerce",
    org: "Upwork client · Project",
    hours: null,
    responsibilities: ["Xero setup for a VAT-registered UK e-commerce business", "One month of bank reconciliation"],
    achievements: ["5.0 client rating", "“Brilliant work done by Rahim, absolutely top-tier performance!”"],
  },
  {
    fy: "Upwork · 2025",
    period: "Feb – Mar 2025",
    role: "Migration from Xero to Zoho Books",
    org: "Upwork client · Project",
    hours: null,
    responsibilities: ["Migrating a business from Xero to Zoho Books"],
    achievements: ["5.0 client rating"],
  },
];

export const experience = {
  kicker: "Experience",
  title: "The general ledger of a career.",
  runningLabel: "Hours brought forward",
  columnLabel: "Hours",
  unit: "hrs",
  fixedLabel: "Project",
  roles: contracts,
};

/* ── Results: balance sheet ─────────────────────────────────────────────── */
export const results = {
  kicker: "Results",
  title: "The balance sheet.",
  asOf: "As of November 2026",
  // Each side's `total` is rendered with a double underline.
  assets: {
    heading: "On Upwork",
    rows: [
      { label: "Completed jobs", value: 23, suffix: "", decimals: 0 },
      { label: "Hours worked", value: 1500, suffix: "+", decimals: 0 },
      { label: "Earned", value: 10, prefix: "$", suffix: "K+", decimals: 0 },
    ],
    total: { label: "Job Success Score", value: 100, suffix: "%", decimals: 0 },
  },
  equity: {
    heading: "What it's built on",
    rows: [
      { label: "Years of experience", value: 5, suffix: "+", decimals: 0 },
      { label: "Certifications held", value: 6, suffix: "", decimals: 0 },
      { label: "Accounting platforms", value: 8, suffix: "", decimals: 0 },
    ],
    total: { label: "Client rating", value: 5, suffix: " / 5", decimals: 1 },
  },
  footnote: "Upwork figures as shown on Rahim's profile. The 5.0 rating is the score on each contract listed above.",
};

/* ── Tools & certifications: filing cabinet ─────────────────────────────── */
export const tools = {
  kicker: "Tools & certifications",
  title: "Filed, labelled, and ready.",
  drawers: [
    {
      label: "Software",
      folders: [
        { name: "QuickBooks Online", note: "Level II certified" },
        { name: "QuickBooks Desktop", note: "Desktop editions" },
        { name: "Xero", note: "Advisor certified" },
        { name: "Zoho Books", note: "Certified" },
        { name: "Wave", note: "Small business" },
        { name: "Buildium", note: "Property management" },
        { name: "AppFolio", note: "Property management" },
        { name: "Microsoft Excel", note: "Certified" },
      ],
    },
    {
      label: "Certifications",
      folders: [
        { name: "QuickBooks Level II Certified", note: "Intuit QuickBooks" },
        { name: "Xero Advisor Certified", note: "Udemy" },
        { name: "Certified Microsoft Excel", note: "Microsoft Excel" },
        { name: "Buildium Certified", note: "Buildium" },
        { name: "AppFolio Certified", note: "AppFolio" },
        { name: "Certified ZohoBooks", note: "ZohoBooks" },
      ],
    },
  ],
};

/* ── Testimonials: audit notes ──────────────────────────────────────────── */
export const testimonials = {
  kicker: "Testimonials",
  title: "Audit notes from clients.",
  notes: [
    {
      quote: "Brilliant work done by Rahim, absolutely top-tier performance!",
      name: "Upwork client",
      role: "Xero setup & bank reconciliation, UK VAT e-commerce",
      ref: "AN-01",
    },
    {
      quote: "Great to work with. Moved to long term contract.",
      name: "Upwork client",
      role: "QuickBooks cleanup specialist",
      ref: "AN-02",
    },
    {
      quote: "He was great working with.",
      name: "Eric Breuer Designs, LLC",
      role: "Bookkeeping",
      ref: "AN-03",
    },
    {
      quote: "Great experience working with this freelancer.",
      name: "Upwork client",
      role: "Buildium setup for property management",
      ref: "AN-04",
    },
    {
      quote: "Wonderful to work with.",
      name: "Upwork client",
      role: "Bookkeeping",
      ref: "AN-05",
    },
    {
      quote: "Highly recommended.",
      name: "Upwork client",
      role: "Short-term project",
      ref: "AN-06",
    },
  ],
};

/* ── FAQ: ledger rows ───────────────────────────────────────────────────── */
export const faq = {
  kicker: "FAQ",
  title: "Open queries, cleared.",
  items: [
    {
      q: "Which countries do you work with?",
      a: "I work remotely with businesses in the USA, UK, Canada and other international markets.",
    },
    {
      q: "Which accounting software do you support?",
      a: "QuickBooks Online and Desktop, Xero, Zoho Books, Wave, Buildium and AppFolio, plus Excel for reporting and analysis.",
    },
    {
      q: "Can you clean up overdue bookkeeping?",
      a: "Yes. I review historical records, reconcile accounts, correct categorization issues and organize the books. The quote depends on the volume and condition of the records.",
    },
    {
      q: "Do you provide monthly bookkeeping?",
      a: "Yes. Monthly support can include transaction categorization, reconciliations and the financial reports we agree on.",
    },
    {
      q: "How do you price projects?",
      a: "Each package has a starting price. I confirm the final quote after reviewing your transaction volume, accounts, software and scope. Hourly work starts at $20/hour.",
    },
    {
      q: "When are you available?",
      a: "Monday to Friday, 9:00 AM – 1:00 PM Eastern Time, by appointment. Send the invoice below or message me on WhatsApp to book a call.",
    },
  ],
};

/* ── Contact: the invoice ───────────────────────────────────────────────── */
export const contact = {
  kicker: "Contact",
  title: "Let's get your books organized.",
  intro:
    "Tell me about your business and the bookkeeping support you need. There's no charge: the amounts are starting package prices.",
  invoicePrefix: "INV",
  fromLabel: "From",
  billToLabel: "Bill to",
  lineItemsLabel: "Services requested",
  notesLabel: "Notes",
  notesPlaceholder: "A little about your business, your accounting software, how many transactions a month, and where things stand today…",
  submit: "Send",
  submitting: "Posting…",
  successTitle: "Received. The books are balanced.",
  successBody: "Thank you. I'll be in touch shortly to arrange a call about your books.",
  errorTitle: "That entry didn't post.",
  errorBody:
    "Something went wrong sending your invoice. Please try again, or email me directly at " +
    person.email +
    " or message me on WhatsApp at " +
    person.phone +
    ".",
};

/* ── Footer ─────────────────────────────────────────────────────────────── */
export const footer = {
  signoff: "Accurate books. Clear reports. Confident decisions.",
  backToTop: "Rewind the tape",
  pending: "1 entry pending: send the invoice to balance the books.",
  balanced: "All entries posted. Books balanced.",
  legal: `© ${person.name} | Freelance ${person.title}`,
};

/* ── 404 ────────────────────────────────────────────────────────────────── */
export const notFound = {
  title: "Unreconciled entry: 404",
  body: "This page doesn't match anything in the books. It may have been moved, renamed, or never posted.",
  cta: "Return to the ledger",
};
