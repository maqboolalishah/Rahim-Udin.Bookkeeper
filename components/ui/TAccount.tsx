"use client";
import { useRef, useState } from "react";
import { ReconBar } from "./ReconBar";

export type TAccountData = {
  code: string;
  title: string;
  covers: readonly string[];
  delivers: readonly string[];
  proficiency: number;
  details: string;
  tools: readonly string[];
};

/**
 * A T-account card. Front: title bar + Dr (covers) | Cr (delivers) columns
 * + reconciliation bar. Hover (mouse) or the toggle (touch/keyboard) flips it
 * to reveal details. The hidden face is `inert` so focus never lands on it.
 */
export function TAccount({ data, index }: { data: TAccountData; index: number }) {
  const [hover, setHover] = useState(false);
  const [pinned, setPinned] = useState(false);
  const flipped = hover || pinned;
  const frontBtn = useRef<HTMLButtonElement>(null);
  const backBtn = useRef<HTMLButtonElement>(null);

  return (
    <article
      className="reveal group [perspective:1400px]"
      style={{ "--i": index } as React.CSSProperties}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHover(false)}
      aria-labelledby={`t-${data.code}`}
    >
      <div
        className="grid h-full transition-transform duration-[900ms] ease-page [transform-style:preserve-3d] motion-reduce:transition-none"
        style={{ transform: flipped ? "rotateY(180deg)" : "none" }}
      >
        {/* FRONT */}
        <div
          inert={flipped}
          className="col-start-1 row-start-1 flex flex-col border border-ink/80 bg-paper p-5 [backface-visibility:hidden] md:p-6"
        >
          <div className="flex items-baseline justify-between">
            <span className="num text-xs text-brass-text">Acct. {data.code}</span>
            <button
              ref={frontBtn}
              type="button"
              onClick={() => {
                setPinned(true);
                requestAnimationFrame(() => backBtn.current?.focus());
              }}
              aria-label={`Show details for ${data.title}`}
              className="smallcaps !text-[10px] hover:!text-ink"
            >
              Details ↻
            </button>
          </div>
          <h3 id={`t-${data.code}`} className="mt-3 text-center font-serif text-[26px] leading-tight">
            {data.title}
          </h3>
          {/* the T */}
          <div className="mt-3 h-[2px] bg-ink" aria-hidden />
          <div className="grid flex-1 grid-cols-2">
            <div className="border-r-2 border-ink py-3 pr-3">
              <p className="smallcaps !text-[9.5px]">Dr · Covers</p>
              <ul className="mt-2 space-y-1.5 text-[13.5px] leading-snug">
                {data.covers.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
            <div className="py-3 pl-3">
              <p className="smallcaps !text-[9.5px] text-right">Cr · Delivers</p>
              <ul className="mt-2 space-y-1.5 text-right text-[13.5px] leading-snug">
                {data.delivers.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-4 border-t border-rule pt-4">
            <ReconBar value={data.proficiency} />
          </div>
        </div>

        {/* BACK */}
        <div
          inert={!flipped}
          className="col-start-1 row-start-1 flex flex-col bg-green p-5 text-paper [backface-visibility:hidden] [transform:rotateY(180deg)] md:p-6"
        >
          <div className="flex items-baseline justify-between">
            <span className="num text-xs opacity-80">Acct. {data.code} · Notes</span>
            <button
              ref={backBtn}
              type="button"
              onClick={() => {
                setPinned(false);
                setHover(false);
                requestAnimationFrame(() => frontBtn.current?.focus());
              }}
              aria-label={`Back to ${data.title} summary`}
              className="smallcaps !text-[10px] !text-paper/80 hover:!text-paper"
            >
              ← Back
            </button>
          </div>
          <p className="mt-4 font-serif text-[22px] leading-snug">{data.details}</p>
          <div className="mt-auto pt-6">
            <p className="smallcaps !text-[9.5px] !text-paper/75">Working papers</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {data.tools.map((t) => (
                <li key={t} className="num rounded-full border border-paper/40 px-2.5 py-1 text-[11px]">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}
