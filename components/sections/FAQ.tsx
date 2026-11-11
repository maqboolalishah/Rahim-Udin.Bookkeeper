"use client";
import { useId, useState } from "react";
import { faq } from "@/content/site";
import { LedgerSection } from "@/components/motion/LedgerSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

/** One ledger row. Opening it draws a rule and writes the answer in; + becomes =. */
function Row({ q, a, n }: { q: string; a: string; n: number }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <li className="reveal border-b border-ink/40" style={{ "--i": n } as React.CSSProperties}>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          className="group grid w-full grid-cols-[2.5rem_1fr_1.5rem] items-baseline gap-4 py-6 text-left md:grid-cols-[4rem_1fr_2rem]"
        >
          <span className="num text-sm text-ink-muted">{String(n + 1).padStart(2, "0")}</span>
          <span className="font-serif text-[22px] leading-snug transition-colors group-hover:text-green md:text-[28px]">{q}</span>
          {/* plus → equals */}
          <span aria-hidden className="relative size-4 self-center justify-self-end">
            <span
              className={cn(
                "absolute left-0 top-1/2 h-[1.5px] w-full bg-ink transition-transform duration-400 ease-settle",
                open && "-translate-y-[3px]",
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-1/2 h-[1.5px] w-full bg-ink transition-transform duration-400 ease-settle",
                open ? "translate-y-[3px]" : "rotate-90",
              )}
            />
          </span>
        </button>
      </h3>
      <div
        id={id}
        role="region"
        className={cn(
          "grid transition-[grid-template-rows] duration-500 ease-settle",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden" inert={!open}>
          <div className="grid grid-cols-[2.5rem_1fr] gap-4 pb-7 md:grid-cols-[4rem_1fr_2rem]">
            {/* ruled line draws, then the answer writes in (masked wipe) */}
            <div className="col-start-2">
              <div
                className="h-px origin-left bg-rule transition-transform duration-700 ease-ink"
                style={{ transform: open ? "scaleX(1)" : "scaleX(0)" }}
              />
              <p
                className="mt-4 max-w-[46rem] text-[17px] leading-relaxed text-ink-muted transition-[clip-path,opacity] duration-[900ms] ease-ink"
                style={{
                  clipPath: open ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
                  opacity: open ? 1 : 0,
                  transitionDelay: open ? "200ms" : "0ms",
                }}
              >
                {a}
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

/** FAQ: "Ledger Rows". */
export function FAQ() {
  return (
    <LedgerSection id="faq" entry="faq" ruled aria-labelledby="faq-title" className="py-24 md:py-36">
      <div className="container-ledger">
        <SectionHeading index="10" kicker={faq.kicker} title={faq.title} id="faq-title" />
        <ul className="border-t-2 border-ink lg:ml-[calc(100%/12)]">
          {faq.items.map((f, i) => (
            <Row key={f.q} q={f.q} a={f.a} n={i} />
          ))}
        </ul>
      </div>
    </LedgerSection>
  );
}
