"use client";
import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";
import { useLedger } from "@/lib/ledger-store";
import { cn } from "@/lib/utils";

type Props = ComponentPropsWithoutRef<"section"> & {
  /** Ledger entry id (see content/site.ts → ledgerEntries). */
  entry?: string;
  /** Show the faint ruling + margin line background. */
  ruled?: boolean;
};

/**
 * A <section> that:
 *  1. posts its ledger entry when ~35% visible, and
 *  2. sets data-inview="true" once, which CSS uses to draw rules,
 *     margin lines and `.reveal` elements (see globals.css).
 * Children stay server-rendered: only this thin wrapper is a client component.
 */
export function LedgerSection({ entry, ruled, className, children, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);
  const post = useLedger((s) => s.post);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.dataset.inview = "true";
        if (entry) post(entry);
        io.disconnect();
      },
      // Tall sections may never reach 35% of their own height; use a viewport band instead.
      { threshold: 0, rootMargin: "0px 0px -35% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [entry, post]);

  return (
    <section ref={ref} className={cn("relative", ruled && "ruled", className)} {...rest}>
      {ruled && <span aria-hidden className="margin-line" />}
      {children}
    </section>
  );
}
