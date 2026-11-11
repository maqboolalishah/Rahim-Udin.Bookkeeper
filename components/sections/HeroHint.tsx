"use client";
import { useEffect, useState } from "react";

/** "Move your cursor to reconcile" → live count → "Reconciled ✓". */
export function HeroHint({ label }: { label: string }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = (e: Event) => setP((e as CustomEvent<number>).detail);
    window.addEventListener("hero:reconcile", on);
    return () => window.removeEventListener("hero:reconcile", on);
  }, []);
  const done = p >= 1;
  return (
    <p className="smallcaps flex items-center gap-3" aria-hidden>
      <span className="relative inline-block h-px w-10 overflow-hidden bg-rule">
        <span
          className="absolute inset-0 origin-left bg-green transition-transform duration-500 ease-settle"
          style={{ transform: `scaleX(${p})` }}
        />
      </span>
      <span className={done ? "text-green" : undefined}>
        {done ? (
          "Figures reconciled ✓"
        ) : p > 0 ? (
          <>
            Reconciling <span className="num">{Math.round(p * 100)}%</span>
          </>
        ) : (
          label
        )}
      </span>
    </p>
  );
}
