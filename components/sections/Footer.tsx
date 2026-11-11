import { footer, person, nav } from "@/content/site";
import { InkLink } from "@/components/ui/InkLink";
import { FooterStatus, FooterYear, RewindButton } from "./FooterClient";

/** FOOTER: "Closing Balance". */
export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t-2 border-ink pb-28 pt-20 md:pb-16 md:pt-28">
      <div className="container-ledger">
        <p className="smallcaps">Closing balance</p>
        <p className="display mt-6 text-[clamp(3.25rem,11vw,11rem)]">
          {footer.signoff.split(" ").slice(0, -2).join(" ")}{" "}
          <span className="italic text-green">{footer.signoff.split(" ").slice(-2).join(" ")}</span>
        </p>

        <div className="mt-16 grid gap-12 border-t border-ink/50 pt-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="smallcaps mb-4">Contact</p>
            <address className="space-y-1.5 not-italic">
              <InkLink href={`mailto:${person.email}`} className="font-serif text-2xl md:text-3xl">
                {person.email}
              </InkLink>
              <p className="num text-ink-muted">{person.phone}</p>
              <p className="text-ink-muted">
                {[person.city, person.region, person.country].filter(Boolean).join(", ")}
              </p>
              <p className="text-sm text-ink-muted">{person.hours}</p>
            </address>
          </div>
          <nav aria-label="Footer" className="md:col-span-3">
            <p className="smallcaps mb-4">Ledger</p>
            <ul className="space-y-2">
              {nav.map((n) => (
                <li key={n.href}>
                  <InkLink href={n.href}>{n.label}</InkLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-4">
            <p className="smallcaps mb-4">Elsewhere</p>
            <ul className="space-y-2">
              {person.socials.map((s) => (
                <li key={s.label}>
                  <InkLink href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                    {s.label} <span aria-hidden>↗</span>
                  </InkLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-ink pt-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1 text-sm">
            <p>
              Books closed for <FooterYear />.
            </p>
            <FooterStatus pending={footer.pending} balanced={footer.balanced} />
          </div>
          <RewindButton label={footer.backToTop} />
          <p className="text-xs text-ink-muted">{footer.legal}</p>
        </div>
      </div>
    </footer>
  );
}
