# The Living Ledger: bookkeeper portfolio

A portfolio and business site for an independent bookkeeper. The whole page is a set of books kept in real time: each section posts an entry to the balance indicator (bottom-right), and sending the contact "invoice" closes the books at **0.00**.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Editing content

**All copy lives in [`content/site.ts`](content/site.ts).** Anything in `[square brackets]` is a placeholder: name, city, years, prices, clients, certifications and testimonials. Components never hold copy.

| To change | Where |
| --- | --- |
| Name, contact details, socials, domain | `person` |
| Services, prices and included items | `services.items` |
| Career history (the running balance sums `years`) | `experience.roles` |
| Stats on the balance sheet | `results` |
| Portrait | replace `public/portrait-placeholder.svg` and update `about.portrait.src` |
| Ledger amounts (decorative) | `ledgerEntries`; the closing entry auto-balances |

## Before launch (TODOs)

- **Contact form:** `lib/submit.ts` is mocked. Add `app/api/inquiry/route.ts` (validate server-side and send email, e.g. with Resend) and call it there. Use `fail@example.com` to preview the error state.
- **Domain:** set `person.siteUrl` (used for metadata, canonical URL and JSON-LD).
- **OG image:** `app/opengraph-image.tsx` is a generated placeholder; replace it with a designed PNG if preferred.

## Structure

```
app/            layout (fonts, pre-paint theme script, metadata), page (JSON-LD), 404, OG image
components/
  sections/     one file per section (Hero, About, Expertise, Services, Process, ...)
  ui/           Button, Stamp, Odometer, InkLink, Receipt, TAccount, ReconBar, Cursor, BalanceIndicator, ThemeToggle
  motion/       easing tokens, Lenis↔GSAP sync, lazy GSAP loader, LedgerSection, hooks
content/site.ts all copy
lib/            ledger store (Zustand), utils, tween, intro signal, mock submit
```

## Motion system

Four named curves are defined once in `components/motion/easing.ts` and mirrored as CSS variables (`--ease-ink`, `--ease-settle`, `--ease-stamp`, `--ease-page`):

- **ink**: pen strokes, drawn rules and underlines
- **settle**: things coming to rest (entrances)
- **stamp**: stamps landing, with a slight overshoot
- **page**: page turns and sheets sliding from folders

GSAP and Lenis are lazy-loaded after first paint. The preloader runs on the Web Animations API, and the hero intro is pure CSS, so nothing on the critical path waits for an animation library.

**Reduced motion** disables the preloader, smooth scroll, the pinned horizontal process (it becomes a vertical stepper), the custom cursor and parallax. Content simply fades in.
