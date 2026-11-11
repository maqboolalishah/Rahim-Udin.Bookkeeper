"use client";
import { useState, useSyncExternalStore } from "react";
import { useLedger } from "@/lib/ledger-store";
import { scrollToTarget } from "@/components/motion/SmoothScroll";
import { cn } from "@/lib/utils";

export function FooterStatus({ pending, balanced }: { pending: string; balanced: string }) {
  const done = useLedger((s) => s.balanced);
  return <p className={cn("text-xs", done ? "text-green" : "text-ink-muted")}>{done ? `✓ ${balanced}` : pending}</p>;
}

/** Back to top: the tape rewinds (spool spins backwards while the page scrolls up). */
export function RewindButton({ label }: { label: string }) {
  const [spinning, setSpinning] = useState(false);
  return (
    <button
      type="button"
      data-cursor="link"
      onClick={() => {
        setSpinning(true);
        scrollToTarget(0, { duration: 2 });
        document.getElementById("top")?.focus({ preventScroll: true });
        setTimeout(() => setSpinning(false), 2000);
      }}
      className="group inline-flex items-center gap-3 text-sm"
    >
      <svg
        viewBox="0 0 32 32"
        className={cn("size-8 transition-transform", spinning && "animate-[spin_0.5s_linear_infinite_reverse]")}
        aria-hidden
      >
        <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="16" cy="16" r="5" fill="none" stroke="currentColor" strokeWidth="1.2" />
        {[0, 120, 240].map((a) => (
          <line key={a} x1="16" y1="11" x2="16" y2="3" stroke="currentColor" strokeWidth="1.2" transform={`rotate(${a} 16 16)`} />
        ))}
      </svg>
      <span className="ink-link" data-underlined>
        {label} <span aria-hidden>↑</span>
        <span aria-hidden className="ink-1" />
        <span aria-hidden className="ink-2" />
      </span>
    </button>
  );
}

/** Current year, rendered on the client (keeps the page fully static). */
export function FooterYear() {
  const year = useSyncExternalStore(
    () => () => {},
    () => String(new Date().getFullYear()),
    () => "[Year]",
  );
  return <span className="num">{year}</span>;
}
