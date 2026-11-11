"use client";
import { useEffect, useRef, useState } from "react";
import { getLenis } from "@/components/motion/SmoothScroll";
import { bezier } from "@/components/motion/easing";
import { markOpened } from "@/lib/intro";
import { person, preloader } from "@/content/site";
import { formatAmount, seeded } from "@/lib/utils";

/* Deterministic column of amounts that rolls and settles on 0.00. */
const rnd = seeded(42);
const TAPE = [...Array.from({ length: 22 }, () => formatAmount(Math.round((rnd() - 0.35) * 2_000_000))), "0.00"];

/**
 * "Opening Balance" preloader (≤ 2.2s, skippable, once per session).
 * SSR renders it visible; the boot script in <head> hides it before paint
 * when it's been seen or reduced motion is on.
 */
export function Preloader() {
  const [gone, setGone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const skipRef = useRef<() => void>(() => {});

  /*
   * Timeline (ms) on the Web Animations API, so no animation library is
   * needed before first paint:
   *   0    rules draw            150  label in
   *   200  tape rolls → 0.00     850  name stroke draws in ink
   *   1350 ink fills             1650 page turns up and away (550ms)
   */
  useEffect(() => {
    const html = document.documentElement;
    if (html.hasAttribute("data-preloaded")) {
      // Already hidden by CSS (seen this session / reduced motion).
      markOpened();
      return;
    }
    const el = root.current;
    if (!el) return;
    const $ = (sel: string) => Array.from(el.querySelectorAll<HTMLElement | SVGElement>(sel));
    const EXIT = 1650;

    html.style.overflow = "hidden";
    getLenis()?.stop();

    const tape = $("[data-tape]")[0] as HTMLElement;
    const rowH = (tape.firstElementChild as HTMLElement | null)?.getBoundingClientRect().height ?? 24;
    const anim = (t: Element, kf: Keyframe[], delay: number, duration: number, ease: Parameters<typeof bezier>[0]) =>
      t.animate(kf, { delay, duration, easing: bezier(ease), fill: "both" });

    const parts: Animation[] = [
      ...$("[data-rule]").map((r, i) => anim(r, [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], i * 80, 550, "ink")),
      ...$("[data-label]").map((l) =>
        anim(
          l,
          [
            { opacity: 0, transform: "translateY(6px)" },
            { opacity: 1, transform: "none" },
          ],
          150,
          400,
          "settle",
        ),
      ),
      anim(
        tape,
        [{ transform: "translateY(0)" }, { transform: `translateY(${-(TAPE.length - 1) * rowH}px)` }],
        200,
        850,
        "settle",
      ),
      ...$("[data-name-stroke]").map((n) =>
        anim(n, [{ strokeDashoffset: "1400px" }, { strokeDashoffset: "0px" }], 850, 750, "ink"),
      ),
      ...$("[data-name-fill]").map((n) => anim(n, [{ opacity: 0 }, { opacity: 1 }], 1350, 350, "settle")),
    ];
    el.style.transformOrigin = "50% 100%";
    const exit = el.animate([{ transform: "none" }, { transform: "translateY(-100%) rotateX(6deg)" }], {
      delay: EXIT,
      duration: 550,
      easing: bezier("page"),
      fill: "forwards",
    });
    let openTimer = window.setTimeout(markOpened, EXIT + 150);

    const finish = () => {
      try {
        sessionStorage.setItem("ll-opened", "1");
      } catch {
        /* storage unavailable: preloader may show again next visit */
      }
      html.setAttribute("data-preloaded", "");
      html.style.overflow = "";
      getLenis()?.start();
      setGone(true);
    };
    exit.finished.then(finish, () => {});

    // Skip: complete everything instantly and start the page turn now.
    skipRef.current = () => {
      parts.forEach((a) => a.finish());
      if ((exit.currentTime as number) < EXIT) exit.currentTime = EXIT;
      clearTimeout(openTimer);
      openTimer = window.setTimeout(markOpened, 150);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && skipRef.current();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(openTimer);
      parts.forEach((a) => a.cancel());
      exit.cancel();
      html.style.overflow = "";
    };
  }, []);

  if (gone) return null;

  return (
    <div
      id="preloader"
      ref={root}
      role="status"
      aria-label={`${preloader.label}: loading`}
      className="fixed inset-0 z-[80] overflow-hidden bg-paper text-ink will-change-transform"
    >
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
        <div className="container-ledger">
          <div className="grid grid-cols-[1fr_auto] items-end gap-6 pb-3">
            {/* The name, written in with ink */}
            <svg viewBox="0 0 900 140" className="h-auto w-full max-w-[640px] overflow-visible" aria-hidden>
              <text
                data-name-stroke
                x="0"
                y="110"
                fill="none"
                stroke="var(--ink)"
                strokeWidth="1.2"
                strokeDasharray="1400"
                strokeDashoffset="1400"
                style={{ fontFamily: "var(--font-fraunces)", fontSize: 120, fontStyle: "italic", letterSpacing: "-0.03em" }}
              >
                {person.name}
              </text>
              <text
                data-name-fill
                x="0"
                y="110"
                fill="var(--ink)"
                opacity="0"
                style={{ fontFamily: "var(--font-fraunces)", fontSize: 120, fontStyle: "italic", letterSpacing: "-0.03em" }}
              >
                {person.name}
              </text>
            </svg>

            {/* Adding-machine column */}
            <div className="text-right">
              <div data-label className="smallcaps mb-2">
                {preloader.label}
              </div>
              <div className="relative h-7 overflow-hidden md:h-9" aria-hidden>
                <div data-tape className="num text-right text-xl md:text-3xl">
                  {TAPE.map((v, i) => (
                    <div key={i} className="h-7 leading-7 md:h-9 md:leading-9" data-zero={i === TAPE.length - 1 ? "" : undefined}>
                      {v}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div data-rule className="h-px origin-left bg-ink" style={{ transform: "scaleX(0)" }} />
          <div className="mt-[3px] h-px origin-left bg-ink/40" data-rule style={{ transform: "scaleX(0)" }} />
        </div>
      </div>

      <button
        type="button"
        onClick={() => skipRef.current()}
        className="smallcaps absolute bottom-6 right-4 px-3 py-2 hover:text-ink md:right-8"
      >
        {preloader.skip} <span aria-hidden>→</span>
      </button>
    </div>
  );
}
