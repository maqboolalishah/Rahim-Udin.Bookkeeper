"use client";
import { useEffect, useRef } from "react";
import { useMediaQuery, useReducedMotion } from "@/components/motion/useReducedMotion";

type Mode = "nib" | "link" | "stamp" | "audit" | "text" | "hidden";

/**
 * Fountain-pen cursor.
 *  default → nib · links → ring with double underline
 *  CTAs (data-cursor="stamp") → rubber stamp · numbers (data-cursor="audit") → crosshair
 * Only on fine pointers with motion allowed. Position is written directly to
 * transform in a rAF loop (no React re-renders).
 */
export function Cursor() {
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduce = useReducedMotion();
  const enabled = fine && !reduce;
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const el = root.current;
    if (!el) return;
    const html = document.documentElement;
    html.classList.add("has-cursor");

    let x = -100,
      y = -100,
      tx = -100,
      ty = -100;
    let mode: Mode = "hidden";
    let raf = 0;

    const setMode = (m: Mode) => {
      if (m !== mode) {
        mode = m;
        el.dataset.mode = m;
      }
    };

    const resolve = (t: EventTarget | null): Mode => {
      if (!(t instanceof Element)) return "nib";
      const tagged = t.closest<HTMLElement>("[data-cursor]");
      if (tagged) return (tagged.dataset.cursor as Mode) || "nib";
      if (t.closest("input:not([type=checkbox]):not([type=radio]), textarea, select")) return "text";
      if (t.closest("a, button, [role=button], summary, label")) return "link";
      return "nib";
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX;
      ty = e.clientY;
      if (mode === "hidden") {
        x = tx;
        y = ty;
      }
      setMode(resolve(e.target));
    };
    const onDown = () => (el.dataset.pressed = "true");
    const onUp = () => delete el.dataset.pressed;
    const onLeave = () => setMode("hidden");

    const loop = () => {
      // Light easing: the pen trails the hand slightly, never lags.
      x += (tx - x) * 0.35;
      y += (ty - y) * 0.35;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  const layer = "absolute left-0 top-0 opacity-0 scale-50 transition-[opacity,transform] duration-300 ease-settle";
  return (
    <div
      ref={root}
      aria-hidden
      data-mode="hidden"
      className="group pointer-events-none fixed left-0 top-0 z-[95] text-ink will-change-transform"
    >
      {/* Nib: tip sits on the hotspot */}
      <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        className={`${layer} group-data-[mode=nib]:scale-100 group-data-[mode=nib]:opacity-100 group-data-[pressed=true]:scale-90`}
        style={{ transformOrigin: "0 0" }}
      >
        <path d="M1 1 L9 21 L14 16 L19 19 L21 17 L18 12 L23 9 Z" fill="var(--ink)" />
        <path d="M1 1 L13 13" stroke="var(--paper)" strokeWidth="0.9" />
        <circle cx="13" cy="13" r="1.6" fill="var(--paper)" />
        <path d="M18 12 L21 17" stroke="var(--brass)" strokeWidth="1.1" />
      </svg>

      {/* Link: ring + double underline */}
      <div
        className={`${layer} -translate-x-1/2 -translate-y-1/2 group-data-[mode=link]:scale-100 group-data-[mode=link]:opacity-100`}
      >
        <div className="size-10 rounded-full border border-ink" />
        <div className="absolute -bottom-2 left-1/2 h-[5px] w-6 -translate-x-1/2 border-y border-ink" />
      </div>

      {/* Stamp: round rubber stamp */}
      <div
        className={`${layer} -translate-x-1/2 -translate-y-1/2 group-data-[mode=stamp]:scale-100 group-data-[mode=stamp]:opacity-100 group-data-[pressed=true]:!scale-[0.85]`}
      >
        <div className="grid size-16 -rotate-12 place-items-center rounded-full border-2 border-audit bg-paper/70 text-audit">
          <div className="grid size-[52px] place-items-center rounded-full border border-dashed border-audit">
            <span className="font-mono text-[9px] font-semibold tracking-[0.2em]">POST</span>
          </div>
        </div>
      </div>

      {/* Audit crosshair */}
      <svg
        viewBox="0 0 40 40"
        width="40"
        height="40"
        className={`${layer} -translate-x-1/2 -translate-y-1/2 group-data-[mode=audit]:scale-100 group-data-[mode=audit]:opacity-100`}
      >
        <circle cx="20" cy="20" r="9" fill="none" stroke="var(--ledger-green)" strokeWidth="1" />
        <path d="M20 2 V14 M20 26 V38 M2 20 H14 M26 20 H38" stroke="var(--ledger-green)" strokeWidth="1" />
        <circle cx="20" cy="20" r="1.2" fill="var(--audit-red)" />
      </svg>
    </div>
  );
}
