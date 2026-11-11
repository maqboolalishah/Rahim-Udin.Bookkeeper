"use client";
import { useEffect, useRef, useState } from "react";
import { onOpened } from "@/lib/intro";
import { formatAmount, seeded } from "@/lib/utils";
import { cn } from "@/lib/utils";

/* Ledger columns (as % from the left) and row pitch for the background figures. */
const COLS = [14, 27, 40, 64, 77, 90];
const ROWS = 15;

type Fig = { id: number; x: number; y: number; text: string; dx: number; dy: number; r: number; neg: boolean; col: number };

function build(): Fig[] {
  const rnd = seeded(1987);
  const out: Fig[] = [];
  let id = 0;
  COLS.forEach((x, col) => {
    for (let row = 0; row < ROWS; row++) {
      if (rnd() < 0.42) continue; // leave gaps like a real ledger
      const cents = Math.round(rnd() * 980_000 + 1_000);
      const neg = rnd() < 0.14;
      out.push({
        id: id++,
        x,
        y: 6 + row * (88 / (ROWS - 1)),
        text: formatAmount(neg ? -cents : cents),
        dx: (rnd() - 0.5) * 120,
        dy: (rnd() - 0.5) * 70,
        r: (rnd() - 0.5) * 22,
        neg,
        col,
      });
    }
  });
  return out;
}

const FIGS = build();

/**
 * Chaos → order. Figures float slightly out of place; the cursor reconciles
 * them into perfect right-aligned columns as it passes nearby (they stay put).
 * Touch / no-hover devices: they snap column by column after the intro.
 */
export function HeroNumberField() {
  const figs = FIGS;
  const host = useRef<HTMLDivElement>(null);
  const [allDone, setAllDone] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const nodes = Array.from(el.querySelectorAll<HTMLElement>("[data-fig]"));
    const settled = new Array(nodes.length).fill(false);
    let count = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const settle = (i: number) => {
      if (settled[i]) return;
      settled[i] = true;
      count++;
      nodes[i].dataset.settled = "true";
      window.dispatchEvent(new CustomEvent("hero:reconcile", { detail: count / nodes.length }));
      if (count === nodes.length) setAllDone(true);
    };

    if (reduce) {
      nodes.forEach((_, i) => settle(i));
      return;
    }

    // Cache centers relative to the viewport-ish host box; refresh on resize/scroll.
    let centers: Array<[number, number]> = [];
    const measure = () => {
      centers = nodes.map((n) => {
        const r = n.getBoundingClientRect();
        return [r.left + r.width / 2, r.top + r.height / 2];
      });
    };

    if (!fine) {
      // Mobile: sequential snap, column by column, after the page opens.
      const timers: number[] = [];
      const off = onOpened(() => {
        figs.forEach((f, i) => {
          timers.push(window.setTimeout(() => settle(i), 700 + f.col * 160 + (f.y / 100) * 420));
        });
      });
      return () => {
        off();
        timers.forEach(clearTimeout);
      };
    }

    let raf = 0;
    let px = -1e4,
      py = -1e4;
    const R2 = 150 * 150;
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!raf) raf = requestAnimationFrame(check);
    };
    const check = () => {
      raf = 0;
      for (let i = 0; i < centers.length; i++) {
        if (settled[i]) continue;
        const dx = centers[i][0] - px;
        const dy = centers[i][1] - py;
        if (dx * dx + dy * dy < R2) settle(i);
      }
    };
    let sraf = 0;
    const onScroll = () => {
      if (!sraf) sraf = requestAnimationFrame(() => ((sraf = 0), measure()));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    el.parentElement?.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.parentElement?.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [figs]);

  return (
    <div
      ref={host}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      data-reconciled={allDone || undefined}
    >
      {figs.map((f) => (
        <span
          key={f.id}
          className={cn(
            "absolute -translate-y-1/2 select-none whitespace-nowrap text-[11px] md:text-[13px]",
            f.neg ? "text-audit/50" : "text-ink/25",
            f.col >= 2 && f.col <= 3 && "max-md:hidden",
          )}
          style={{ right: `${100 - f.x}%`, top: `${f.y}%` }}
        >
          <span
            data-fig
            className="num block transition-[transform,opacity,color] duration-[900ms] ease-stamp data-[settled=true]:!transform-none data-[settled=true]:!opacity-100"
            data-v={f.text}
            style={{
              transform: `translate3d(${f.dx.toFixed(1)}px, ${f.dy.toFixed(1)}px, 0) rotate(${f.r.toFixed(1)}deg)`,
              opacity: 0.55,
            }}
          />
        </span>
      ))}
    </div>
  );
}
