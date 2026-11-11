import { hero } from "@/content/site";
import { LedgerSection } from "@/components/motion/LedgerSection";
import { Button } from "@/components/ui/Button";
import { InkLink } from "@/components/ui/InkLink";
import { HeroNumberField } from "./HeroNumberField";
import { HeroHint } from "./HeroHint";

/**
 * HERO: the Debit / Credit split. The headline staggers across a vertical
 * rule (DR | CR); background figures reconcile into columns under the cursor.
 */
export function Hero() {
  const [l1, l2, l3] = hero.headline;
  return (
    <LedgerSection
      id="top"
      entry="hero"
      aria-labelledby="hero-title"
      className="hero group/hero flex min-h-[100svh] flex-col overflow-hidden pt-[var(--header-h)]"
    >
      <HeroNumberField />

      {/* The DR | CR rule */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 hidden md:block">
        <span className="hero-rule absolute inset-y-[var(--header-h)] w-px bg-ink/70" />
        <span className="hero-rule absolute inset-y-[var(--header-h)] left-[4px] w-px bg-ink/25" />
      </div>
      <div aria-hidden className="container-ledger relative mt-4 grid grid-cols-2 md:mt-6">
        <span className="smallcaps hero-fade pr-6 text-right max-md:text-left">DR · Debit</span>
        <span className="smallcaps hero-fade pl-6 max-md:text-right">Credit · CR</span>
      </div>

      <div className="container-ledger relative flex flex-1 flex-col justify-center py-8 md:py-10">
        <p className="hero-fade smallcaps mb-5 !text-[11.5px] !text-brass-text md:mb-7">{hero.eyebrow}</p>

        <h1 id="hero-title" className="display text-[clamp(2.9rem,min(9vw,15.5vh),10rem)]">
          <span className="sr-only">{hero.headline.join(" ")}</span>
          <span aria-hidden className="block">
            <span className="hero-line block overflow-hidden pb-[0.08em]">
              <span className="block" style={{ "--d": 0 } as React.CSSProperties}>
                {l1}
              </span>
            </span>
            <span className="hero-line block overflow-hidden pb-[0.08em] md:pl-[calc(50%+1.5rem)]">
              <span className="block italic text-green" style={{ "--d": 1 } as React.CSSProperties}>
                {l2}
              </span>
            </span>
            <span className="hero-line block overflow-hidden pb-[0.12em] md:pl-[calc(50%+1.5rem)]">
              <span className="relative inline-block" style={{ "--d": 2 } as React.CSSProperties}>
                {l3}
                {/* double underline: the total */}
                <span className="hero-total absolute -bottom-[0.06em] left-0 right-[0.25em] flex flex-col gap-[0.05em]">
                  <span className="h-[0.025em] min-h-[2px] origin-left bg-brass" />
                  <span className="h-[0.025em] min-h-[2px] origin-left bg-brass" />
                </span>
              </span>
            </span>
          </span>
        </h1>

        <div className="mt-8 grid gap-10 md:mt-10 md:grid-cols-2">
          <div className="hero-fade md:pr-10 md:text-right" style={{ "--d": 3 } as React.CSSProperties}>
            <p className="ml-auto max-w-[34rem] text-[17px] leading-relaxed text-ink-muted md:text-lg">{hero.lede}</p>
            <div className="mt-8 flex flex-wrap items-center gap-6 md:justify-end">
              <Button href={hero.primaryCta.href} size="lg">
                {hero.primaryCta.label}
                <span aria-hidden>→</span>
              </Button>
              <InkLink href={hero.secondaryCta.href} className="text-[15px]">
                {hero.secondaryCta.label}
              </InkLink>
            </div>
          </div>

          <dl className="hero-fade max-w-md md:pl-10" style={{ "--d": 4 } as React.CSSProperties}>
            {hero.meta.map((m) => (
              <div key={m.label} className="flex items-baseline gap-3 border-b border-rule py-2.5 text-sm">
                <dt className="smallcaps">{m.label}</dt>
                <span aria-hidden className="flex-1 translate-y-[-3px] border-b border-dotted border-ink/30" />
                <dd className="num">{m.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="container-ledger relative flex items-center justify-between pb-6">
        <div className="hero-fade max-md:hidden">
          <HeroHint label={hero.hint} />
        </div>
        <span className="smallcaps hero-fade">
          Scroll to post entries <span aria-hidden>↓</span>
        </span>
      </div>
    </LedgerSection>
  );
}
