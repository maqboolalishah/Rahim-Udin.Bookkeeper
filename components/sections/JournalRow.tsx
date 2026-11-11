"use client";
import { useEffect, useRef, useState } from "react";
import { useInViewOnce } from "@/components/motion/useInView";
import { cn } from "@/lib/utils";

type Entry = { date: string; ref: string; title: string; body: string; highlight: string };

/**
 * One journal entry. On entering view it is "posted": the description types
 * in like a typewriter, the row's rule draws, and a small posted ✓ appears.
 */
export function JournalRow({ entry, index }: { entry: Entry; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const seen = useInViewOnce(ref, { threshold: 0.5 });
  const [n, setN] = useState(0);
  const done = n >= entry.title.length;

  useEffect(() => {
    if (!seen) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let i = 0;
    const id = window.setInterval(
      () => {
        i = reduce ? entry.title.length : i + 1;
        setN(i);
        if (i >= entry.title.length) window.clearInterval(id);
      },
      reduce ? 0 : 32,
    );
    return () => window.clearInterval(id);
  }, [seen, entry.title.length]);

  return (
    <li
      ref={ref}
      className="relative grid grid-cols-[4.75rem_1fr] gap-x-4 gap-y-2 py-7 md:grid-cols-[6rem_1fr_5rem_10rem] md:gap-x-6"
    >
      <span className="num pt-1 text-sm text-ink-muted">{entry.date}</span>

      <div className="min-w-0">
        <h3 className="font-serif text-2xl leading-tight md:text-[28px]">
          <span className="sr-only">{entry.title}</span>
          <span aria-hidden>
            {entry.title.slice(0, n)}
            <span
              className={cn(
                "ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-[0.12em] bg-brass",
                seen && !done ? "animate-pulse" : "opacity-0",
              )}
            />
            {/* reserve space so the row doesn't shift while typing */}
            <span className="invisible">{entry.title.slice(n)}</span>
          </span>
        </h3>
        <p
          className={cn(
            "mt-2 max-w-[38rem] leading-relaxed text-ink-muted transition-[opacity,transform] duration-700 ease-settle",
            done ? "opacity-100" : "opacity-0 motion-safe:translate-y-2",
          )}
        >
          {entry.body}
        </p>
      </div>

      <span className="num col-start-1 row-start-2 text-xs text-ink-muted md:col-start-3 md:row-start-1 md:pt-2">
        {entry.ref}
      </span>

      <div className="col-start-2 row-start-2 flex items-start justify-end gap-2 md:col-start-4 md:row-start-1 md:pt-1">
        <span className="num text-right text-sm text-brass-text" data-cursor="audit">
          {entry.highlight}
        </span>
        <span
          aria-label={done ? "Posted" : undefined}
          className={cn(
            "grid size-5 shrink-0 place-items-center rounded-full border border-green text-[10px] text-green transition-[opacity,transform] duration-500 ease-stamp",
            done ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        >
          ✓
        </span>
      </div>

      {/* the row's rule */}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-ink/40 transition-transform duration-1000 ease-ink"
        style={{ transform: seen ? "scaleX(1)" : "scaleX(0)", transitionDelay: `${index * 40}ms` }}
      />
    </li>
  );
}
