"use client";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { cn } from "@/lib/utils";

type Tone = "red" | "brass" | "green";
const toneClass: Record<Tone, string> = {
  red: "text-audit border-audit",
  brass: "text-brass-text border-brass",
  green: "text-green border-green",
};

/* Rubber-stamp ink texture: an SVG noise mask punches small voids into the ink. */
const INK_MASK =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='f'><feTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='2' seed='7'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -2.6 2.1'/></filter><rect width='100%' height='100%' filter='url(%23f)'/></svg>\")";

type StampProps = {
  label: string;
  sub?: string;
  tone?: Tone;
  shape?: "rect" | "round";
  rotate?: number;
  /** true → the stamp lands (thud); false → lifted away. Omit for a static stamp. */
  landed?: boolean;
  /** seconds */
  delay?: number;
  className?: string;
  onLanded?: () => void;
};

/**
 * An ink stamp that lands with a thud: big & faint → small, sharp and slightly
 * rotated (the "stamp" ease overshoots a touch, like rubber meeting paper).
 * Pure CSS transition on transform/opacity.
 */
export function Stamp({
  label,
  sub,
  tone = "red",
  shape = "rect",
  rotate = -8,
  landed,
  delay = 0,
  className,
  onLanded,
}: StampProps) {
  const reduce = useReducedMotion();
  const on = landed ?? true;
  const dur = reduce ? 200 : 420;

  return (
    <div
      aria-hidden
      onTransitionEnd={(e) => {
        if (e.target === e.currentTarget && e.propertyName === "transform" && on) onLanded?.();
      }}
      style={{
        WebkitMaskImage: INK_MASK,
        maskImage: INK_MASK,
        opacity: on ? 0.92 : 0,
        transform: on ? `rotate(${rotate}deg)` : `rotate(${rotate - 10}deg) scale(${reduce ? 1 : 1.9})`,
        transition: `transform ${dur}ms var(--ease-stamp) ${delay}s, opacity ${Math.round(dur * 0.5)}ms linear ${delay}s`,
      }}
      className={cn(
        "pointer-events-none inline-flex select-none flex-col items-center justify-center border-[3px] font-mono font-bold uppercase leading-none",
        shape === "round" ? "aspect-square rounded-full p-4" : "rounded-[6px] px-4 py-2",
        toneClass[tone],
        className,
      )}
    >
      <span
        className={cn(
          "flex flex-col items-center justify-center",
          shape === "round"
            ? "aspect-square w-full rounded-full border border-dashed border-current p-2"
            : "border-y border-current py-1",
        )}
      >
        <span className="tracking-[0.18em]">{label}</span>
        {sub && <span className="mt-1 text-[max(0.32em,9px)] font-medium tracking-[0.24em]">{sub}</span>}
      </span>
    </div>
  );
}
