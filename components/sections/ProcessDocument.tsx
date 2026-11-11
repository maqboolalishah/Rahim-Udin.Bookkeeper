import { cn } from "@/lib/utils";

/* Slip positions: [x, y, rotate] when scattered (step 0). */
const SCATTER: Array<[number, number, number]> = [
  [-70, -60, -24],
  [60, -80, 18],
  [-40, 40, 12],
  [80, 30, -16],
  [5, -10, 32],
];

/**
 * The single document that travels through the close:
 *  0 crumpled receipts → 1 sorted stack → 2 ticked statement →
 *  3 clean report with chart → 4 approved, with the advice stamp.
 * Pure function of `step`; every change is a CSS transform/opacity transition.
 */
export function ProcessDocument({ step, className }: { step: number; className?: string }) {
  const sheetOn = step >= 2;
  return (
    <div aria-hidden className={cn("relative aspect-[4/5] w-full", className)}>
      {/* receipts */}
      {SCATTER.map(([x, y, r], i) => {
        const style =
          step === 0
            ? { transform: `translate(${x}%, ${y}%) rotate(${r}deg) scale(0.92) skewX(${r / 4}deg)`, opacity: 1 }
            : step === 1
              ? { transform: `translate(0, ${-i * 3}%) rotate(${i % 2 ? 1.5 : -1.5}deg)`, opacity: 1 }
              : { transform: `translate(0, -10%) scale(0.7)`, opacity: 0 };
        return (
          <div
            key={i}
            className="absolute left-[30%] top-[28%] w-[40%] transition-[transform,opacity] duration-[900ms] ease-settle"
            style={{ ...style, transitionDelay: `${i * 50}ms`, zIndex: 5 - i }}
          >
            <div className="tear-bottom bg-paper-deep px-3 pb-5 pt-3 shadow-[0_6px_18px_-8px_rgb(var(--shadow)/0.45)]">
              <div className="h-1.5 w-1/2 bg-ink/50" />
              {[0, 1, 2, 3].map((k) => (
                <div key={k} className="mt-2 flex justify-between">
                  <div className="h-1 w-1/2 bg-ink/25" />
                  <div className="h-1 w-1/5 bg-ink/40" />
                </div>
              ))}
              <div className="mt-3 h-px bg-ink/50" />
              <div className="mt-1.5 ml-auto h-1.5 w-1/3 bg-ink/60" />
            </div>
          </div>
        );
      })}

      {/* the sheet: statement → report → approved */}
      <div
        className="absolute inset-[6%] flex flex-col bg-paper p-[7%] shadow-[0_28px_60px_-30px_rgb(var(--shadow)/0.7)] ring-1 ring-ink/10 transition-[transform,opacity] duration-[900ms] ease-settle"
        style={{
          opacity: sheetOn ? 1 : 0,
          transform: sheetOn ? (step === 4 ? "rotate(-1.5deg) scale(0.96)" : "none") : "translateY(12%) scale(0.9)",
        }}
      >
        <div className="flex items-baseline justify-between">
          <span className="font-serif text-[clamp(0.9rem,1.6vw,1.35rem)]">{step >= 3 ? "Monthly report" : "Bank statement"}</span>
          <span className="num text-[9px] text-ink-muted">[MM/YY]</span>
        </div>
        <div className="mt-2 h-px bg-ink" />

        <div className="relative mt-3 flex-1">
          {/* statement rows with ticks */}
          <div
            className={cn(
              "absolute inset-0 space-y-[7%] transition-opacity duration-500",
              step === 2 ? "opacity-100" : "opacity-0",
            )}
          >
            {Array.from({ length: 7 }).map((_, k) => (
              <div key={k} className="flex items-center gap-2">
                <div className="h-1 flex-1 bg-ink/20" />
                <div className="h-1 w-1/5 bg-ink/45" />
                <span
                  className="grid size-3.5 place-items-center text-[10px] font-bold text-green transition-[transform,opacity] duration-300 ease-stamp"
                  style={{
                    transform: step === 2 ? "scale(1)" : "scale(0)",
                    opacity: step === 2 ? 1 : 0,
                    transitionDelay: `${250 + k * 110}ms`,
                  }}
                >
                  ✓
                </span>
              </div>
            ))}
          </div>

          {/* report: chart + lines */}
          <div
            className={cn(
              "absolute inset-0 flex flex-col transition-opacity duration-500",
              step >= 3 ? "opacity-100" : "opacity-0",
            )}
          >
            <div className="flex h-[55%] items-end gap-[6%] border-b border-l border-ink/40 px-[4%]">
              {[38, 52, 46, 68, 74, 88].map((h, k) => (
                <div
                  key={k}
                  className={cn(
                    "flex-1 origin-bottom transition-transform duration-700 ease-settle",
                    k === 5 ? "bg-green" : "bg-ink/30",
                  )}
                  style={{
                    height: `${h}%`,
                    transform: step >= 3 ? "scaleY(1)" : "scaleY(0)",
                    transitionDelay: `${200 + k * 80}ms`,
                  }}
                />
              ))}
            </div>
            <div className="mt-[8%] space-y-2">
              <div className="flex justify-between">
                <div className="h-1 w-2/5 bg-ink/25" />
                <div className="h-1 w-1/5 bg-ink/50" />
              </div>
              <div className="flex justify-between">
                <div className="h-1 w-1/3 bg-ink/25" />
                <div className="h-1 w-1/6 bg-ink/50" />
              </div>
              <div className="mt-2 border-y border-ink py-[2px]" />
            </div>
          </div>
        </div>

        {/* advice: approval stamp */}
        <div
          className="absolute bottom-[10%] right-[8%] grid aspect-square w-[34%] place-items-center rounded-full border-[3px] border-green text-green transition-[transform,opacity] duration-500 ease-stamp"
          style={{
            opacity: step === 4 ? 0.95 : 0,
            transform: step === 4 ? "rotate(-12deg) scale(1)" : "rotate(-30deg) scale(1.8)",
          }}
        >
          <div className="grid size-[84%] place-items-center rounded-full border border-dashed border-green text-center">
            <span className="font-mono text-[clamp(0.55rem,0.9vw,0.75rem)] font-bold uppercase leading-tight tracking-[0.15em]">
              Closed
              <br />
              <span className="text-[1.6em]">✓</span>
              <br />
              Advised
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
