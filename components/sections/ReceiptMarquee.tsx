"use client";
import { useEffect, useRef } from "react";
import { loadGsap } from "@/components/motion/gsap";
import { marquee } from "@/content/site";

/**
 * RECEIPT TAPE: an infinite adding-machine strip. Items are summed with "+",
 * the run closes with "=". Speed follows scroll velocity (and direction);
 * hovering slows it right down so it can be read.
 */
export function ReceiptMarquee() {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let cleanup = () => {};
    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      const loop = gsap.to(el, { xPercent: -50, duration: 38, ease: "none", repeat: -1 });
      let hover = false;
      let base = 1;
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity(); // px/s
          const dir = v < 0 ? -1 : 1;
          base = dir; // the tape reverses when you scroll up, like rewinding
          const boost = Math.min(Math.abs(v) / 260, 6);
          gsap.to(loop, { timeScale: (hover ? 0.2 : 1 + boost) * base, duration: 0.25, overwrite: true });
          gsap.to(loop, { timeScale: (hover ? 0.2 : 1) * base, duration: 1.2, delay: 0.25, ease: "settle" });
        },
        onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
      });

      const enter = () => {
        hover = true;
        gsap.to(loop, { timeScale: 0.2 * base, duration: 0.6, ease: "settle", overwrite: true });
      };
      const leave = () => {
        hover = false;
        gsap.to(loop, { timeScale: base, duration: 0.8, ease: "settle", overwrite: true });
      };
      const strip = el.parentElement!;
      strip.addEventListener("pointerenter", enter);
      strip.addEventListener("pointerleave", leave);
      cleanup = () => {
        strip.removeEventListener("pointerenter", enter);
        strip.removeEventListener("pointerleave", leave);
        st.kill();
        loop.kill();
      };
    });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  const run = (copy: number) => (
    <div className="flex shrink-0 items-center" aria-hidden={copy > 0 || undefined}>
      {marquee.map((m, i) => (
        <span key={`${copy}-${m}`} className="flex items-center">
          <span className="px-5 md:px-7">{m}</span>
          <span className="text-brass-text">{i === marquee.length - 1 ? "=" : "+"}</span>
        </span>
      ))}
      <span className="flex items-center gap-4 px-5 md:px-7">
        <span>Balanced books</span>
        <span className="num text-green">0.00</span>
        <span className="text-brass-text">✓</span>
        <span aria-hidden className="mx-3 h-4 border-l border-dashed border-ink/30" />
      </span>
    </div>
  );

  return (
    <section aria-label="Services at a glance" className="relative z-10 -my-2 overflow-hidden py-10 md:py-14">
      <div className="tear-both relative -mx-4 -rotate-[1.4deg] bg-paper-deep py-5 shadow-[0_10px_30px_-18px_rgb(var(--shadow)/0.4)]">
        {/* perforation */}
        <div aria-hidden className="absolute inset-x-0 top-3 border-t border-dashed border-ink/15" />
        <div aria-hidden className="absolute inset-x-0 bottom-3 border-t border-dashed border-ink/15" />
        <div
          ref={track}
          className="flex w-max font-mono text-[13px] uppercase tracking-[0.14em] md:text-[15px]"
          data-cursor="audit"
        >
          {run(0)}
          {run(1)}
        </div>
      </div>
    </section>
  );
}
