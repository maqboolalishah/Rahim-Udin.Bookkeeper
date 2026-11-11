"use client";
import { forwardRef } from "react";
import { seeded } from "@/lib/utils";
import { scrollToTarget } from "@/components/motion/SmoothScroll";

export type ReceiptService = {
  id: string;
  name: string;
  description: string;
  lines: readonly string[];
  price: string;
  cadence: string;
};

/** Deterministic barcode widths per receipt. */
function bars(seed: number) {
  const r = seeded(seed);
  return Array.from({ length: 38 }, () => 1 + Math.floor(r() * 3));
}

/**
 * A printed receipt with a torn (zig-zag) bottom edge. The CTA pre-selects the
 * service on the contact invoice (via a window event) and scrolls there.
 */
export const Receipt = forwardRef<HTMLDivElement, { service: ReceiptService; no: number }>(function Receipt(
  { service, no },
  ref,
) {
  const request = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("invoice:add", { detail: service.id }));
    scrollToTarget("#contact");
    history.replaceState(null, "", "#contact");
  };

  return (
    <div ref={ref} className="group/receipt relative will-change-transform">
      {/* soft lift shadow: a static blurred plate whose opacity changes (cheap) */}
      <span
        aria-hidden
        className="absolute inset-x-4 bottom-0 top-6 rounded-lg bg-ink/50 opacity-0 blur-xl transition-opacity duration-500 group-hover/receipt:opacity-40"
      />
      <article
        aria-labelledby={`svc-${service.id}`}
        className="tear-bottom relative bg-paper-deep px-5 pb-10 pt-6 font-mono text-[12.5px] leading-relaxed transition-transform duration-500 ease-settle group-hover/receipt:-translate-y-1.5 md:px-6"
      >
        <div className="flex justify-between text-[10.5px] uppercase tracking-[0.14em] text-ink-muted">
          <span>Receipt</span>
          <span className="num">No. {String(no).padStart(4, "0")}</span>
        </div>
        <div className="my-3 border-t border-dashed border-ink/40" />
        <h3 id={`svc-${service.id}`} className="font-serif text-[26px] leading-[1.05] tracking-[-0.02em]">
          {service.name}
        </h3>
        <p className="mt-2 font-sans text-[14px] leading-snug text-ink-muted">{service.description}</p>
        <div className="my-4 border-t border-dashed border-ink/40" />
        <ul className="space-y-1.5">
          {service.lines.map((l) => (
            <li key={l} className="flex items-baseline gap-2">
              <span className="text-ink-muted">1×</span>
              <span>{l}</span>
              <span aria-hidden className="flex-1 translate-y-[-3px] border-b border-dotted border-ink/30" />
              <span className="text-green" aria-label="included">
                ✓
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-5 border-t border-ink pt-3">
          <div className="flex items-baseline justify-between">
            <span className="uppercase tracking-[0.12em] text-ink-muted">Starting at</span>
            <span className="rule-double num text-[18px] font-semibold">
              {service.price}
              <span className="ml-1 text-[11px] font-normal text-ink-muted">{service.cadence}</span>
            </span>
          </div>
        </div>
        <a
          href="#contact"
          onClick={request}
          data-cursor="stamp"
          className="mt-7 flex items-center justify-between border border-ink px-3 py-2.5 font-sans text-[13.5px] font-medium transition-colors hover:bg-ink hover:text-paper"
        >
          Request this service <span aria-hidden>→</span>
        </a>
        <div aria-hidden className="mt-6 flex h-9 items-stretch justify-center gap-[2px] opacity-70">
          {bars(no * 97).map((w, i) => (
            <span key={i} className="bg-ink" style={{ width: w }} />
          ))}
        </div>
        <p className="mt-2 text-center text-[10px] uppercase tracking-[0.2em] text-ink-muted">Thank you for your business</p>
      </article>
    </div>
  );
});
