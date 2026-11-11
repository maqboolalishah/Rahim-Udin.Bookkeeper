"use client";
import { useEffect, useRef, useState } from "react";
import { useInViewOnce } from "@/components/motion/useInView";
import { cn } from "@/lib/utils";

/**
 * Reconciliation bar: "Book" vs "Bank". The bank lands on the true value;
 * the book overshoots, corrects, and finally matches exactly, then glows green.
 */
export function ReconBar({ value, label = "Proficiency" }: { value: number; label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInViewOnce(ref, { threshold: 0.8 });
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!seen) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      const t = window.setTimeout(() => setStage(3), 0);
      return () => clearTimeout(t);
    }
    const ts = [setTimeout(() => setStage(1), 100), setTimeout(() => setStage(2), 1100), setTimeout(() => setStage(3), 1900)];
    return () => ts.forEach(clearTimeout);
  }, [seen]);

  const book = [0, value - 13, Math.min(100, value + 5), value][stage];
  const bank = stage === 0 ? 0 : value;
  const matched = stage === 3;

  const bar = (v: number, tone: string) => (
    <span
      className={cn(
        "relative block h-[5px] overflow-hidden rounded-full bg-rule transition-shadow duration-700",
        matched && "shadow-[0_0_10px_-1px_var(--ledger-green)]",
      )}
    >
      <span
        className={cn(
          "absolute inset-0 origin-left rounded-full transition-[transform,background-color] duration-700 ease-settle",
          tone,
        )}
        style={{ transform: `scaleX(${Math.max(0, Math.min(100, v)) / 100})` }}
      />
    </span>
  );

  return (
    <div ref={ref} className="space-y-1.5" data-cursor="audit">
      <div className="flex items-baseline justify-between">
        <span className="smallcaps !text-[10px]">{label}</span>
        <span className={cn("num text-xs transition-colors duration-500", matched ? "text-green" : "text-ink-muted")}>
          {matched ? `Reconciled ✓ ${value}%` : `${Math.max(0, book)}% / ${bank}%`}
        </span>
      </div>
      <div className="grid grid-cols-[2.6rem_1fr] items-center gap-x-3 gap-y-1.5">
        <span className="smallcaps !text-[9px]">Book</span>
        {bar(book, matched ? "bg-green" : "bg-brass")}
        <span className="smallcaps !text-[9px]">Bank</span>
        {bar(bank, matched ? "bg-green" : "bg-ink")}
      </div>
      <span className="sr-only">
        {label}: {value} percent
      </span>
    </div>
  );
}
