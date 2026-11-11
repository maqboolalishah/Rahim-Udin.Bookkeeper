"use client";
import { useRef, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { bezier } from "@/components/motion/easing";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}
const getTheme = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

/**
 * Desk-lamp pull switch. "Day Ledger" = lamp on; "After-Hours" = lamp off.
 * Theme change is revealed as a radial pool of light from the lamp using the
 * View Transitions API (graceful instant fallback).
 */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "light" as Theme);
  const btn = useRef<HTMLButtonElement>(null);
  const isDark = theme === "dark";

  function toggle() {
    const next: Theme = isDark ? "light" : "dark";
    const apply = () => {
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem("ll-theme", next);
      } catch {
        /* storage unavailable: theme still applies for this page view */
      }
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduce || !btn.current) {
      apply();
      return;
    }
    const r = btn.current.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const vt = document.startViewTransition(() => flushSync(apply));
    vt.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 800, easing: bezier("page"), pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {});
  }

  return (
    <button
      ref={btn}
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="After-hours (dark) theme"
      onClick={toggle}
      data-cursor="link"
      className={cn(
        "group relative grid size-10 place-items-center rounded-full text-ink transition-colors hover:text-brass-text",
        className,
      )}
    >
      <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden className="overflow-visible">
        {/* light cone (lamp on) */}
        <path
          d="M10 13 L4 27 H24 L18 13 Z"
          fill="var(--brass)"
          className="origin-top transition-[opacity,transform] duration-500 ease-settle"
          style={{ opacity: isDark ? 0 : 0.28, transform: isDark ? "scaleY(0.6)" : "none" }}
        />
        {/* arm + base */}
        <path d="M14 13 V8 L22 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M8 29 H20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        {/* shade */}
        <path d="M9 13 Q14 8 19 13 Z" fill="currentColor" />
        {/* pull chain: tugs down on press */}
        <g className="transition-transform duration-200 ease-stamp group-active:translate-y-[3px]">
          <path d="M18 13 V19" stroke="currentColor" strokeWidth="0.9" strokeDasharray="1 1.2" />
          <circle cx="18" cy="20.2" r="1.3" fill={isDark ? "currentColor" : "var(--brass)"} />
        </g>
      </svg>
    </button>
  );
}
