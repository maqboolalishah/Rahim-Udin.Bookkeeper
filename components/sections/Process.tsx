"use client";
import { useEffect, useRef, useState } from "react";
import { process } from "@/content/site";
import { loadGsap } from "@/components/motion/gsap";
import { useMediaQuery, useReducedMotion } from "@/components/motion/useReducedMotion";
import { LedgerSection } from "@/components/motion/LedgerSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProcessDocument } from "./ProcessDocument";
import { cn } from "@/lib/utils";

const DAYS = 30;

/** Month-end calendar: days get crossed off as the close progresses. */
function Calendar({ crossed, className }: { crossed: number; className?: string }) {
  return (
    <div className={className} aria-hidden>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="smallcaps !text-[10px]">Close calendar</span>
        <span className="num text-[11px] text-ink-muted">{process.month}</span>
      </div>
      <div className="grid grid-cols-10 gap-px border border-rule bg-rule">
        {Array.from({ length: DAYS }, (_, i) => {
          const done = i < crossed;
          return (
            <div key={i} className="relative grid aspect-square place-items-center bg-paper">
              <span className={cn("num text-[10px] transition-colors", done ? "text-ink-muted/60" : "text-ink")}>{i + 1}</span>
              {/* the cross */}
              <span
                className="absolute h-px w-[70%] bg-audit transition-transform duration-300 ease-ink"
                style={{ transform: `rotate(45deg) scaleX(${done ? 1 : 0})` }}
              />
              <span
                className="absolute h-px w-[70%] bg-audit transition-transform duration-300 ease-ink"
                style={{ transform: `rotate(-45deg) scaleX(${done ? 1 : 0})`, transitionDelay: done ? "120ms" : "0ms" }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * PROCESS: "Closing the Books". Desktop: pinned horizontal scroll; one
 * document on the desk transforms with each step while the calendar is
 * crossed off. Mobile / reduced motion: a vertical stepper.
 */
export function Process() {
  const pin = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const [step, setStep] = useState(0);
  const [crossed, setCrossed] = useState(0);
  // Pinned horizontal mode only on wide screens with motion allowed.
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reduce = useReducedMotion();
  const pinned = isDesktop && !reduce;
  const n = process.steps.length;

  useEffect(() => {
    if (!pinned) return;
    const tr = track.current!;
    // Travel exactly (n-1) panels so step i is in focus at progress i/(n-1).
    const distance = () => ((tr.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0) * (n - 1);
    let cancelled = false;
    let cleanup = () => {};
    loadGsap().then(({ gsap }) => {
      if (cancelled) return;
      const tween = gsap.to(tr, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pin.current,
          pin: true,
          start: "top top",
          end: () => `+=${distance() * 1.15}`,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            setStep(Math.round(p * (n - 1)));
            setCrossed(Math.round(p * DAYS));
          },
        },
      });
      cleanup = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(tr, { clearProps: "transform" });
      };
    });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [pinned, n]);

  return (
    <LedgerSection id="process" entry="process" aria-labelledby="process-title" className="pt-24 md:pt-36">
      <div className="container-ledger">
        <SectionHeading index="05" kicker={process.kicker} title={process.title} id="process-title" className="!mb-10" />
      </div>

      <div ref={pin} className={cn("relative", pinned && "h-[100svh] overflow-hidden")}>
        <div className={cn("container-ledger", pinned && "grid h-full grid-cols-12 items-center gap-10 pt-[var(--header-h)]")}>
          {/* Steps track */}
          <div ref={viewport} className={cn(pinned && "col-span-7 overflow-hidden")}>
            {pinned && (
              <div className="mb-8 flex items-center gap-4">
                <span className="num text-sm">
                  Step {process.steps[step].n} <span className="text-ink-muted">/ 0{n}</span>
                </span>
                <span className="relative h-px flex-1 bg-rule">
                  <span
                    className="absolute inset-y-0 left-0 w-full origin-left bg-ink transition-transform duration-300"
                    style={{ transform: `scaleX(${crossed / DAYS})` }}
                  />
                </span>
              </div>
            )}
            <ol ref={track} className={cn(pinned ? "flex w-max" : "space-y-14 pb-24 md:pb-36")}>
              {process.steps.map((s, i) => (
                <li
                  key={s.n}
                  className={cn(
                    "relative",
                    pinned
                      ? "w-[min(34rem,46vw)] shrink-0 pr-16"
                      : "grid gap-6 border-l border-ink/30 pl-6 sm:grid-cols-[1fr_14rem] sm:gap-10",
                  )}
                >
                  {!pinned && (
                    <span aria-hidden className="absolute -left-[5px] top-2 size-[9px] rounded-full border border-ink bg-paper" />
                  )}
                  <div>
                    <div className="flex items-baseline gap-4">
                      <span className="num text-sm text-brass-text">{s.n}</span>
                      <span className="smallcaps">{s.days}</span>
                    </div>
                    <h3
                      className={cn(
                        "display mt-3 text-[clamp(2.75rem,6vw,5.5rem)] transition-colors duration-500",
                        pinned && i !== step && "text-ink-muted",
                      )}
                    >
                      {s.name}
                      <span className="text-brass">.</span>
                    </h3>
                    <p className="mt-5 max-w-[26rem] text-[17px] leading-relaxed text-ink-muted">{s.body}</p>
                    {i < n - 1 && pinned && (
                      <span aria-hidden className="mt-8 block font-mono text-ink-muted">
                        →
                      </span>
                    )}
                  </div>
                  {/* Mobile: each step shows its own document state */}
                  {!pinned && <ProcessDocument step={i} className="mx-auto max-w-[14rem]" />}
                </li>
              ))}
            </ol>
          </div>

          {/* The desk: one travelling document + calendar (desktop only) */}
          {pinned && (
            <div className="col-span-5 flex flex-col items-center gap-8">
              <div
                className="w-full max-w-[min(22rem,42vh)] transition-transform duration-700 ease-settle"
                style={{ transform: `translateX(${(step - 2) * 10}px) rotate(${(step - 2) * 0.6}deg)` }}
              >
                <ProcessDocument step={step} />
              </div>
              <Calendar crossed={crossed} className="w-full max-w-[min(22rem,42vh)]" />
            </div>
          )}
        </div>
      </div>
    </LedgerSection>
  );
}
