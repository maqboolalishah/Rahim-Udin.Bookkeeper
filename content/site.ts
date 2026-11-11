/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SITE CONTENT — the single source of truth for every word on the site.
 *
 *  Everything in [square brackets] is a placeholder for personal details.
 *  Swap values here; no component needs to change.
 *  Amounts in `ledgerEntries` are purely decorative (they drive the
 *  "Living Ledger" balance indicator) and are expressed in cents.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const person = {
  name: "[Your Name]",
  initials: "[YN]",
  title: "Bookkeeper",
  city: "[City]",
  region: "[State/Region]",
  country: "[Country]",
  email: "[hello@yourdomain.com]",
  phone: "[+1 (555) 010-0000]",
  hours: "Mon – Fri, 9:00 – 17:00 [Time zone]",
  yearsExperience: 8, // drives copy like "[X]+ years"; keep in sync with `experience`
  siteUrl: "https://example.com", // TODO: replace with the real domain
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/[your-handle]" },
    { label: "Upwork", href: "https://www.upwork.com/freelancers/[your-handle]" },
    { label: "Email", href: "mailto:[hello@yourdomain.com]" },
  ],
} as const;

export const seo = {
  title: `${person.name}, Bookkeeper in ${person.city}`,
  description:
    "Independent bookkeeping for small businesses: monthly books, payroll, reconciliations and clear financial reports, kept accurate and closed on time.",
  keywords: [
    "bookkeeper",
    "bookkeeping services",
    "small business bookkeeping",
    "payroll",
    "bank reconciliation",
    "month-end close",
    person.city,
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
  { id: "process", ref: "JE-005", label: "Month-end close", dr: 0, cr: 196_000 },
  { id: "experience", ref: "JE-006", label: "Prior periods", dr: 90_000, cr: 150_000 },
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
  eyebrow: `${person.name}, ${person.title}`,
  // Split into lines so the headline can stagger across the DR / CR rule.
  headline: ["Your numbers,", "in perfect", "balance."],
  lede: `Independent bookkeeping for small businesses in ${person.city} and beyond. Clean books every month, reconciled to the cent, with reports you can actually read.`,
  primaryCta: { label: "Book a consultation", href: "#contact" },
  secondaryCta: { label: "See services", href: "#services" },
  meta: [
    { label: "Est.", value: "[Year]" },
    { label: "Based in", value: person.city },
    { label: "Accepting", value: "[2] new clients" },
  ],
  hint: "Move your cursor to reconcile the figures",
};

/* ── Receipt tape marquee ───────────────────────────────────────────────── */
export const marquee = [
  "Bookkeeping",
  "Payroll",
  "Bank reconciliation",
  "Tax prep support",
  "Financial reports",
  "Accounts payable",
  "Accounts receivable",
  "Month-end close",
  "Catch-up books",
  "Sales tax filings",
  "Cash-flow forecasts",
  "Budget vs. actual",
];

/* ── About: journal entries ─────────────────────────────────────────────── */
export const about = {
  kicker: "About",
  title: "The story, posted in order.",
  intro: `I'm ${person.name}, an independent bookkeeper with [X]+ years of keeping small-business books honest. Here's how the account was built, one entry at a time.`,
  portrait: {
    src: "/portrait-placeholder.svg", // TODO: replace with a real portrait (e.g. /portrait.jpg)
    alt: `Portrait of ${person.name}`,
    caption: `${person.name}, ${person.city}`,
  },
  entries: [
    {
      date: "[2014]",
      ref: "JE-101",
      title: "First ledger, first job",
      body: "Started as an accounts assistant at [Company], matching invoices to purchase orders and learning why every cent needs a home.",
      highlight: "[1,200] invoices matched",
    },
    {
      date: "[2017]",
      ref: "JE-102",
      title: "Certified and specialised",
      body: "Earned [Certification] and moved into full-cycle bookkeeping for [service businesses / retail / trades], from bank feeds to year-end packs.",
      highlight: "[Certification]",
    },
    {
      date: "[2020]",
      ref: "JE-103",
      title: "Opened my own books",
      body: `Went independent in ${person.city} to give small-business owners the attention a big firm can't: one bookkeeper who knows their numbers by name.`,
      highlight: "[0] → [40] clients",
    },
    {
      date: "[2024]",
      ref: "JE-104",
      title: "Advisory, not just entries",
      body: "Added monthly reporting calls and cash-flow forecasts, so clients use their books to decide, not just to file.",
      highlight: "[4,200] hours saved",
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
      title: "Reconciliations",
      covers: ["Bank & credit cards", "Merchant & payment apps", "Loan schedules"],
      delivers: ["Statements that tie out", "Duplicates caught early", "Audit-ready trail"],
      proficiency: 98,
      details:
        "Every account reconciled monthly to the statement balance, with uncleared items explained, not hidden in suspense.",
      tools: ["[QuickBooks Online]", "[Xero]", "[Dext]"],
    },
    {
      code: "2100",
      title: "Payroll",
      covers: ["Pay runs & timesheets", "Contractor payments", "Filings & year-end forms"],
      delivers: ["Staff paid on time", "Liabilities on the books", "No late-filing fees"],
      proficiency: 94,
      details:
        "Weekly, bi-weekly or monthly runs with deductions posted correctly and payroll liabilities reconciled every period.",
      tools: ["[Gusto]", "[ADP]", "[Payroll module]"],
    },
    {
      code: "3200",
      title: "Financial reporting",
      covers: ["P&L and balance sheet", "Cash-flow statement", "Budget vs. actual"],
      delivers: ["A one-page monthly pack", "Trends in plain English", "Numbers lenders trust"],
      proficiency: 96,
      details: "Reports land by the [5th] business day of each month, with a short written summary of what moved and why.",
      tools: ["[Fathom]", "[Excel / Sheets]", "[Spotlight]"],
    },
    {
      code: "4400",
      title: "Clean-up & catch-up",
      covers: ["Months (or years) behind", "Messy chart of accounts", "Prior bookkeeper hand-offs"],
      delivers: ["Current, accurate books", "A tidy chart of accounts", "Tax season without panic"],
      proficiency: 92,
      details: "A fixed-scope project to rebuild history, correct miscodings and leave you with a system that stays clean.",
      tools: ["[QuickBooks Online]", "[Xero]", "[Hubdoc]"],
    },
  ],
};

/* ── Services: receipts ─────────────────────────────────────────────────── */
export const services = {
  kicker: "Services",
  title: "Itemised, so there are no surprises.",
  intro: "Fixed monthly pricing, agreed up front. Every engagement starts with a free consultation.",
  items: [
    {
      id: "monthly",
      name: "Monthly Bookkeeping",
      description: "Your books, kept current and closed every month.",
      lines: [
        "Transaction categorisation",
        "Bank & card reconciliations",
        "Monthly P&L + balance sheet",
        "Receipt capture setup",
      ],
      price: "[$450]",
      cadence: "/ month",
      amount: 45_000,
    },
    {
      id: "payroll",
      name: "Payroll Management",
      description: "Accurate pay runs and filings, every period.",
      lines: ["Pay runs for up to [10] staff", "Contractor payments", "Payroll tax filings", "Year-end forms"],
      price: "[$180]",
      cadence: "/ month",
      amount: 18_000,
    },
    {
      id: "cleanup",
      name: "Catch-up & Clean-up",
      description: "Behind on your books? We'll bring them current.",
      lines: [
        "Historical transaction review",
        "Corrected chart of accounts",
        "Reconciled opening balances",
        "Hand-off checklist",
      ],
      price: "[$900]",
      cadence: "one-off",
      amount: 90_000,
    },
    {
      id: "advisory",
      name: "Reporting & Advisory",
      description: "Numbers you can make decisions with.",
      lines: ["Monthly reporting call", "Cash-flow forecast", "Budget vs. actual", "Tax-season pack for your CPA"],
      price: "[$300]",
      cadence: "/ month",
      amount: 30_000,
    },
  ],
};

/* ── Process: closing the books ─────────────────────────────────────────── */
export const process = {
  kicker: "Process",
  title: "Closing the books, every month.",
  month: "[Month] [Year]",
  steps: [
    {
      n: "01",
      name: "Collect",
      body: "Bank feeds, receipts, invoices and statements come in through one secure inbox. You snap; I sort.",
      days: "Days 1–3",
    },
    {
      n: "02",
      name: "Categorize",
      body: "Every transaction coded to the right account, with rules set up so next month is faster.",
      days: "Days 4–8",
    },
    {
      n: "03",
      name: "Reconcile",
      body: "Each account ticked against its statement until the difference is exactly zero. No plugs, no suspense.",
      days: "Days 9–15",
    },
    {
      n: "04",
      name: "Report",
      body: "Your P&L, balance sheet and cash position, delivered as a clean one-page pack.",
      days: "Days 16–22",
    },
    {
      n: "05",
      name: "Advise",
      body: "A short call to walk through what changed, what's coming, and what to do about it.",
      days: "Days 23–30",
    },
  ],
};

/* ── Experience: general ledger ─────────────────────────────────────────── */
export const experience = {
  kicker: "Experience",
  title: "The general ledger of a career.",
  runningLabel: "Years brought forward",
  roles: [
    {
      fy: "FY [2024] – Present",
      period: "[2020] – Present",
      role: "Independent Bookkeeper",
      org: `${person.name} Bookkeeping`,
      years: 3.5,
      responsibilities: [
        "Full-cycle bookkeeping for [40]+ small businesses",
        "Monthly close, reporting packs and advisory calls",
        "Payroll for [15] clients, including year-end filings",
      ],
      achievements: ["[100]% of client books closed by day [10]", "Grew to [X] clients by referral only"],
    },
    {
      fy: "FY [2019]",
      period: "[2017] – [2020]",
      role: "Senior Bookkeeper",
      org: "[Accounting Firm]",
      years: 2.5,
      responsibilities: [
        "Managed a portfolio of [25] client files",
        "Reviewed junior staff reconciliations",
        "Prepared year-end packs for the tax team",
      ],
      achievements: ["Cut month-end close from [12] to [6] days", "Led migration of [30] clients to cloud software"],
    },
    {
      fy: "FY [2016]",
      period: "[2014] – [2017]",
      role: "Accounts Assistant",
      org: "[Company]",
      years: 2,
      responsibilities: [
        "Accounts payable and receivable processing",
        "Supplier statement reconciliations",
        "Petty cash and expense reports",
      ],
      achievements: ["Recovered [$12k] in duplicate supplier payments"],
    },
  ],
};

/* ── Results: balance sheet ─────────────────────────────────────────────── */
export const results = {
  kicker: "Results",
  title: "The balance sheet.",
  asOf: "As of [Month Year]",
  // Each side's `total` is rendered with a double underline.
  assets: {
    heading: "What clients gain",
    rows: [
      { label: "Clients served", value: 120, suffix: "+", decimals: 0 },
      { label: "Hours saved for owners", value: 4200, suffix: "", decimals: 0 },
      { label: "Transactions reconciled", value: 186000, suffix: "", decimals: 0 },
    ],
    total: { label: "Books closed on time", value: 99.8, suffix: "%", decimals: 1 },
  },
  equity: {
    heading: "What it's built on",
    rows: [
      { label: "Years of experience", value: 8, suffix: "+", decimals: 0 },
      { label: "Certifications held", value: 3, suffix: "", decimals: 0 },
      { label: "Client retention", value: 96, suffix: "%", decimals: 0 },
    ],
    total: { label: "Reconciliation accuracy", value: 99.9, suffix: "%", decimals: 1 },
  },
  footnote: "All figures are placeholders: replace with your own verified numbers.",
};

/* ── Tools & certifications: filing cabinet ─────────────────────────────── */
export const tools = {
  kicker: "Tools & certifications",
  title: "Filed, labelled, and ready.",
  drawers: [
    {
      label: "Software",
      folders: [
        { name: "[QuickBooks Online]", note: "Advanced user" },
        { name: "[Xero]", note: "Certified advisor" },
        { name: "[Gusto]", note: "Payroll" },
        { name: "[Dext]", note: "Receipt capture" },
        { name: "[Excel / Sheets]", note: "Models & forecasts" },
      ],
    },
    {
      label: "Certifications",
      folders: [
        { name: "[Certified Bookkeeper]", note: "[Issuing body], [Year]" },
        { name: "[QuickBooks ProAdvisor]", note: "[Level], [Year]" },
        { name: "[Xero Advisor]", note: "[Year]" },
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
      quote:
        "For the first time in [X] years I know exactly where my cash is going. The monthly pack takes me five minutes to read.",
      name: "[Client Name]",
      role: "[Owner, Studio / Café / Practice]",
      ref: "AN-01",
    },
    {
      quote:
        "We were [14] months behind. Three weeks later the books were current and our CPA called them the cleanest she'd seen.",
      name: "[Client Name]",
      role: "[Founder, Company]",
      ref: "AN-02",
    },
    {
      quote: "Payroll used to eat my Fridays. Now it just happens, correctly, and I get my weekends back.",
      name: "[Client Name]",
      role: "[Director, Company]",
      ref: "AN-03",
    },
    {
      quote: "Responsive, precise and genuinely kind about our messy receipts shoebox. Worth every cent, and she'd know.",
      name: "[Client Name]",
      role: "[Owner, Trade business]",
      ref: "AN-04",
    },
  ],
};

/* ── FAQ: ledger rows ───────────────────────────────────────────────────── */
export const faq = {
  kicker: "FAQ",
  title: "Open queries, cleared.",
  items: [
    {
      q: "Do you work with businesses outside " + person.city + "?",
      a: "Yes. Everything runs on cloud software and secure document sharing, so I work with clients across [Country]. Calls happen over video at a time that suits you.",
    },
    {
      q: "Which accounting software do you use?",
      a: "Mostly [QuickBooks Online] and [Xero]. If you're on something else, I'll either work in it or help you migrate with no lost history.",
    },
    {
      q: "How is pricing set?",
      a: "Fixed monthly fees based on transaction volume and the services you need, agreed before we start. No hourly surprises.",
    },
    {
      q: "My books are a mess. Can you still help?",
      a: "That's what catch-up and clean-up projects are for. We'll scope it on the consultation call and fix it in one fixed-price project.",
    },
    {
      q: "Do you file taxes?",
      a: "I prepare tax-ready books and a year-end pack for your CPA or tax preparer, and I'm happy to coordinate with them directly. [Adjust to your jurisdiction and scope.]",
    },
    {
      q: "How do I get started?",
      a: "Send the invoice below. I'll reply within [one] business day to book a free 30-minute consultation.",
    },
  ],
};

/* ── Contact: the invoice ───────────────────────────────────────────────── */
export const contact = {
  kicker: "Contact",
  title: "Start with an invoice, addressed to me.",
  intro: "Tell me who you are and what you need. There's no charge: the amounts are illustrative monthly estimates.",
  invoicePrefix: "INV",
  fromLabel: "From",
  billToLabel: "Bill to",
  lineItemsLabel: "Services requested",
  notesLabel: "Notes",
  notesPlaceholder: "A little about your business, how many transactions a month, and where things stand today…",
  submit: "Send",
  submitting: "Posting…",
  successTitle: "Received. The books are balanced.",
  successBody: "Thank you. I'll reply within [one] business day to book your free consultation.",
  errorTitle: "That entry didn't post.",
  errorBody: "Something went wrong sending your invoice. Please try again, or email me directly at " + person.email + ".",
};

/* ── Footer ─────────────────────────────────────────────────────────────── */
export const footer = {
  signoff: "Let's close the books.",
  backToTop: "Rewind the tape",
  pending: "1 entry pending: send the invoice to balance the books.",
  balanced: "All entries posted. Books balanced.",
  legal: `© ${person.name}. All rights reserved.`,
};

/* ── 404 ────────────────────────────────────────────────────────────────── */
export const notFound = {
  title: "Unreconciled entry: 404",
  body: "This page doesn't match anything in the books. It may have been moved, renamed, or never posted.",
  cta: "Return to the ledger",
};
