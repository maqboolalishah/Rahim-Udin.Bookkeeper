"use client";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { computeTotals, useLedger } from "@/lib/ledger-store";
import { ledgerEntries } from "@/content/site";
import { formatAmount, cn } from "@/lib/utils";
import { TweenAmount } from "./TweenAmount";
import { Stamp } from "./Stamp";

/**
 * The persistent "Living Ledger" readout: Debits / Credits / Difference.
 * Expands into the journal of posted entries. When the books close it draws
 * a double underline and drops the BALANCED ✓ stamp onto the page.
 */
export function BalanceIndicator() {
  const posted = useLedger((s) => s.posted);
  const balanced = useLedger((s) => s.balanced);
  const t = useMemo(() => computeTotals(posted), [posted]);
  const [open, setOpen] = useState(false);
  const [bigStamp, setBigStamp] = useState(false);
  const panelId = useId();
  const wasBalanced = useRef(false);

  // On the transition to balanced: show the big stamp briefly + shake the page.
  useEffect(() => {
    if (!balanced || wasBalanced.current) return;
    wasBalanced.current = true;
    const show = setTimeout(() => setBigStamp(true), 650); // let the totals tween first
    const hide = setTimeout(() => setBigStamp(false), 3600);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [balanced]);

  const shake = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const main = document.getElementById("main");
    if (!main) return;
    main.classList.remove("shake");
    void main.offsetWidth; // restart animation
    main.classList.add("shake");
  };

  const visible = t.count > 0;
  const zero = t.diff === 0 && balanced;

  return (
    <>
      <aside
        aria-label="Ledger balance"
        className={cn(
          "fixed bottom-3 right-3 z-50 transition-[opacity,transform] duration-700 ease-settle md:bottom-5 md:right-5",
          visible ? "opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <div className="relative overflow-hidden rounded-[10px] border border-rule bg-paper/95 text-ink shadow-[0_18px_40px_-24px_rgb(var(--shadow)/0.55)] backdrop-blur-sm">
          {/* Journal of entries: expands upward (grid-rows trick, no height animation). */}
          <div
            id={panelId}
            inert={!open}
            className={cn(
              "grid transition-[grid-template-rows] duration-500 ease-settle",
              open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            )}
          >
            <div className="overflow-hidden">
              <ol
                className={cn(
                  "max-h-[50vh] w-[min(18rem,calc(100vw-1.5rem))] overflow-y-auto border-b border-rule px-4 py-3 transition-opacity duration-300",
                  open ? "opacity-100" : "opacity-0",
                )}
                data-lenis-prevent
              >
                {ledgerEntries.map((e) => {
                  const isPosted = posted.includes(e.id);
                  return (
                    <li
                      key={e.id}
                      className={cn(
                        "grid grid-cols-[3.4rem_1fr_auto] gap-2 py-1 text-[11px] transition-opacity",
                        isPosted ? "opacity-100" : "opacity-40",
                      )}
                    >
                      <span className="num text-ink-muted">{e.ref}</span>
                      <span className="truncate">{e.label}</span>
                      <span className="num text-right">
                        {isPosted ? (e.dr ? formatAmount(e.dr) : `(${formatAmount(e.cr)})`) : "pending"}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={panelId}
            data-cursor="audit"
            className="block w-[min(18rem,calc(100vw-1.5rem))] px-4 py-3 text-left max-md:w-auto max-md:py-2"
          >
            <span className="flex items-center justify-between gap-6 max-md:gap-3">
              <span className="smallcaps !text-[10px]">
                Ledger{" "}
                <span className="num">
                  {t.count}/{t.total}
                </span>
              </span>
              <span className="smallcaps !text-[10px] max-md:hidden">{open ? "Hide journal" : "Journal"}</span>
            </span>

            <span className="mt-2 hidden grid-cols-[auto_1fr] gap-x-6 gap-y-0.5 text-[12px] md:grid">
              <span className="smallcaps !text-[10px] leading-5">DR</span>
              <TweenAmount cents={t.dr} className="text-right leading-5" />
              <span className="smallcaps !text-[10px] leading-5">CR</span>
              <TweenAmount cents={t.cr} className="text-right leading-5" />
            </span>

            <span className="mt-1.5 flex items-baseline justify-between gap-6 border-t border-ink pt-1.5 text-[13px] max-md:mt-1 max-md:gap-3 max-md:border-0 max-md:pt-0">
              <span className="smallcaps !text-[10px]">Difference</span>
              <span className="relative">
                <TweenAmount
                  cents={t.diff}
                  className={cn("font-semibold transition-colors duration-500", zero ? "text-green" : "text-audit")}
                />
                {/* The total's double underline, drawn when balanced. */}
                <span aria-hidden className="absolute -bottom-[5px] left-0 right-0 flex flex-col gap-[2px]">
                  <span
                    className="h-px origin-left bg-green transition-transform duration-700 ease-ink"
                    style={{ transform: zero ? "scaleX(1)" : "scaleX(0)" }}
                  />
                  <span
                    className="h-px origin-left bg-green transition-transform duration-700 ease-ink"
                    style={{ transform: zero ? "scaleX(1)" : "scaleX(0)", transitionDelay: zero ? "300ms" : "0ms" }}
                  />
                </span>
              </span>
            </span>
          </button>
        </div>
        <span className="sr-only" aria-live="polite">
          {balanced ? "All entries posted. The books are balanced." : ""}
        </span>
      </aside>

      {/* The big stamp: thuds onto the page, shakes the paper, then lifts. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[70] grid place-items-center">
        {balanced && (
          <Stamp
            label="BALANCED ✓"
            sub="Difference 0.00"
            tone="green"
            rotate={-9}
            landed={bigStamp}
            onLanded={shake}
            className="bg-paper/40 text-[clamp(2rem,7vw,5.5rem)]"
          />
        )}
      </div>
    </>
  );
}
