"use client";
import { useEffect, useRef } from "react";
import { formatAmount } from "@/lib/utils";
import { tween } from "@/lib/tween";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** An accounting amount (cents) that tweens between values: adding-machine feel. */
export function TweenAmount({ cents, className }: { cents: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(cents);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown.current === cents) return;
    if (reduced()) {
      shown.current = cents;
      el.textContent = formatAmount(cents);
      return;
    }
    return tween(shown.current, cents, 900, (v) => {
      shown.current = Math.round(v);
      el.textContent = formatAmount(shown.current);
    });
  }, [cents]);

  return (
    <span ref={ref} className={className ? `num ${className}` : "num"}>
      {formatAmount(cents)}
    </span>
  );
}

/** A plain number that tweens (e.g. years with one decimal). */
export function TweenNumber({ value, decimals = 1, className }: { value: number; decimals?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown.current === value) return;
    if (reduced()) {
      shown.current = value;
      el.textContent = value.toFixed(decimals);
      return;
    }
    return tween(shown.current, value, 1000, (v) => {
      shown.current = v;
      el.textContent = v.toFixed(decimals);
    });
  }, [value, decimals]);

  return (
    <span ref={ref} className={className ? `num ${className}` : "num"}>
      {value.toFixed(decimals)}
    </span>
  );
}
