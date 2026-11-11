"use client";
import { useRef } from "react";
import { useInViewOnce } from "@/components/motion/useInView";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  /** Start rolling as soon as mounted / controlled externally. */
  start?: boolean;
};

const DIGITS = Array.from({ length: 10 }, (_, i) => i); // one turn of the drum

/**
 * Adding-machine odometer: each digit is a drum that rolls into place,
 * least-significant first (right → left), like a mechanical register.
 * Screen readers get the plain value; the drums are aria-hidden.
 */
export function Odometer({ value, decimals = 0, prefix = "", suffix = "", className, start }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInViewOnce(ref, { threshold: 0.6 });
  const go = start ?? seen;

  const text = value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  const chars = text.split("");
  const digitCount = chars.filter((c) => /\d/.test(c)).length;
  let digitIndex = 0;

  return (
    <span ref={ref} data-cursor="audit" className={cn("num inline-flex items-baseline", className)}>
      <span className="sr-only">{`${prefix}${text}${suffix}`}</span>
      <span aria-hidden className="inline-flex leading-none">
        {prefix}
        {chars.map((c, i) => {
          if (!/\d/.test(c)) return <span key={i}>{c}</span>;
          const d = Number(c);
          const fromRight = digitCount - 1 - digitIndex++;
          return (
            <span key={i} className="relative inline-block h-[1em] overflow-hidden">
              <span
                className="flex flex-col transition-transform ease-settle motion-reduce:transition-none"
                style={{
                  transform: go ? `translateY(-${d * 10}%)` : "translateY(0)",
                  transitionDuration: `${1100 + fromRight * 140}ms`,
                  transitionDelay: `${fromRight * 70}ms`,
                }}
              >
                {DIGITS.map((n, k) => (
                  <span key={k} className="block h-[1em]">
                    {n}
                  </span>
                ))}
              </span>
            </span>
          );
        })}
        {suffix}
      </span>
    </span>
  );
}
