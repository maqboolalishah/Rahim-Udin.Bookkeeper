"use client";
import { useEffect, useRef } from "react";
import { services } from "@/content/site";
import { loadGsap } from "@/components/motion/gsap";
import { LedgerSection } from "@/components/motion/LedgerSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Receipt } from "@/components/ui/Receipt";

/**
 * SERVICES: "The Receipt Printer". Receipts feed out of a slot in stepped
 * increments (like a thermal printer) scrubbed to scroll on desktop; on
 * mobile each receipt prints when it reaches the viewport.
 */
export function Services() {
  const grid = useRef<HTMLDivElement>(null);
  const receipts = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const els = receipts.current.filter(Boolean) as HTMLDivElement[];
    if (!grid.current || !els.length) return;
    let cancelled = false;
    let revert = () => {};
    loadGsap().then(({ gsap }) => {
      if (cancelled) return;
      const mm = gsap.matchMedia();
      revert = () => mm.revert();

      mm.add(
        {
          desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { desktop } = ctx.conditions as { desktop: boolean };
          if (desktop) {
            els.forEach((el, i) => {
              gsap.fromTo(
                el,
                { yPercent: -101 },
                {
                  yPercent: 0,
                  ease: "steps(18)",
                  scrollTrigger: {
                    trigger: grid.current,
                    start: `top ${78 - i * 6}%`,
                    end: `top ${18 - i * 6}%`,
                    scrub: 0.4,
                  },
                },
              );
            });
          } else {
            els.forEach((el) => {
              gsap.fromTo(
                el,
                { yPercent: -101 },
                { yPercent: 0, ease: "steps(14)", duration: 1.3, scrollTrigger: { trigger: el.parentElement, start: "top 85%" } },
              );
            });
          }
        },
      );
    });
    return () => {
      cancelled = true;
      revert();
    };
  }, []);

  return (
    <LedgerSection id="services" entry="services" aria-labelledby="services-title" className="py-24 md:py-36">
      <div className="container-ledger">
        <SectionHeading index="04" kicker={services.kicker} title={services.title} intro={services.intro} id="services-title" />

        {/* The printer slot */}
        <div aria-hidden className="relative z-10 hidden lg:block">
          <div className="relative h-12 rounded-[14px] bg-ink shadow-[0_14px_30px_-12px_rgb(var(--shadow)/0.6)]">
            <div className="absolute inset-x-6 bottom-3 h-[3px] rounded-full bg-paper/15" />
            <div className="absolute left-6 top-3 flex items-center gap-2">
              <span className="size-1.5 animate-pulse rounded-full bg-[var(--ledger-green)] [filter:brightness(1.6)]" />
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-paper/60">Printing</span>
            </div>
            <span className="absolute right-6 top-3 font-mono text-[9px] uppercase tracking-[0.3em] text-paper/60">
              LL-4 · Thermal
            </span>
          </div>
        </div>

        <div ref={grid} className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:-mt-3 lg:grid-cols-4 lg:px-6">
          {services.items.map((s, i) => (
            // Clip only the top edge: the receipt emerges from under the slot.
            <div key={s.id} className="[clip-path:inset(0_-60px_-80px_-60px)] max-lg:pt-1">
              <div aria-hidden className="mb-0 h-2 rounded-t-sm bg-ink lg:hidden" />
              <Receipt
                service={s}
                no={i + 1}
                ref={(el) => {
                  receipts.current[i] = el;
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </LedgerSection>
  );
}
