"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { testimonials } from "@/content/site";
import { LedgerSection } from "@/components/motion/LedgerSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stamp } from "@/components/ui/Stamp";
import { useInViewOnce } from "@/components/motion/useInView";
import { cn } from "@/lib/utils";

type Note = (typeof testimonials.notes)[number];

/** One auditor's note: a paper slip with a signature line and an APPROVED stamp. */
function AuditNote({ note, i, total }: { note: Note; i: number; total: number }) {
  const ref = useRef<HTMLElement>(null);
  const seen = useInViewOnce(ref, { threshold: 0.7, rootMargin: "0px" });
  return (
    <figure
      ref={ref}
      aria-roledescription="slide"
      aria-label={`${i + 1} of ${total}`}
      className={cn(
        "relative flex w-[min(26rem,82vw)] shrink-0 select-none flex-col bg-paper-deep p-7 shadow-[0_20px_40px_-30px_rgb(var(--shadow)/0.7)] md:p-9",
        i % 2 ? "rotate-[0.8deg]" : "-rotate-[0.6deg]",
      )}
    >
      <div className="flex items-baseline justify-between">
        <span className="smallcaps">Audit note</span>
        <span className="num text-xs text-ink-muted">{note.ref}</span>
      </div>
      <div className="mt-3 h-px bg-ink/50" />
      <blockquote className="mt-6 flex-1 font-serif text-[22px] leading-snug md:text-[25px]">
        <span aria-hidden className="text-brass">
          “
        </span>
        {note.quote}
        <span aria-hidden className="text-brass">
          ”
        </span>
      </blockquote>
      <figcaption className="mt-10">
        <div className="font-serif text-2xl italic leading-none">{note.name}</div>
        <div className="mt-1 h-px bg-ink" aria-hidden />
        <div className="mt-2 flex justify-between text-xs text-ink-muted">
          <span>{note.role}</span>
          <span className="smallcaps !text-[9px]">Signature</span>
        </div>
      </figcaption>
      <div className="absolute -top-5 right-3 md:right-6">
        <Stamp
          label="Approved"
          sub="Client file"
          tone="brass"
          rotate={-14}
          landed={seen}
          delay={0.25}
          className="bg-paper-deep/80 text-[13px]"
        />
      </div>
    </figure>
  );
}

/**
 * TESTIMONIALS: "Audit Notes". A draggable strip (mouse drag on desktop,
 * swipe on touch) that snaps note-by-note; buttons + arrow keys for keyboard.
 */
export function Testimonials() {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const x = useRef(0);
  const drag = useRef<{ id: number; startX: number; startOffset: number; moved: boolean } | null>(null);
  const [index, setIndex] = useState(0);
  const max = useRef(0);
  const notes = testimonials.notes;

  const stepWidth = useCallback(() => {
    const first = track.current?.children[0] as HTMLElement | undefined;
    return first ? first.offsetWidth + 24 : 0;
  }, []);

  const apply = (v: number, animated: boolean) => {
    const el = track.current;
    if (!el) return;
    x.current = v;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.style.transition = animated && !reduce ? "transform 700ms var(--ease-page)" : "none";
    el.style.transform = `translate3d(${v}px, 0, 0)`;
  };

  useEffect(() => {
    const measure = () => {
      if (!viewport.current || !track.current) return;
      const vpStyle = getComputedStyle(viewport.current);
      const inner = viewport.current.clientWidth - parseFloat(vpStyle.paddingLeft) - parseFloat(vpStyle.paddingRight);
      max.current = Math.max(0, track.current.scrollWidth - inner);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (viewport.current) ro.observe(viewport.current);
    return () => ro.disconnect();
  }, []);

  const goTo = (i: number) => {
    const clamped = Math.max(0, Math.min(notes.length - 1, i));
    setIndex(clamped);
    apply(-Math.min(max.current, clamped * stepWidth()), true);
  };

  /* Pointer drag (mouse) + swipe (touch). Vertical page scroll is preserved via touch-action: pan-y. */
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    drag.current = { id: e.pointerId, startX: e.clientX, startOffset: x.current, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (!d.moved) return;
    let v = d.startOffset + dx;
    // rubber-band past the ends
    if (v > 0) v *= 0.25;
    if (v < -max.current) v = -max.current + (v + max.current) * 0.25;
    apply(v, false);
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d || !d.moved) return;
    const w = stepWidth();
    const dx = e.clientX - d.startX;
    // a decisive flick advances one note even if it didn't cross halfway
    const base = Math.round(-x.current / (w || 1));
    goTo(Math.abs(dx) > 60 && base === index ? index + (dx < 0 ? 1 : -1) : base);
  };

  return (
    <LedgerSection
      id="testimonials"
      entry="testimonials"
      aria-labelledby="testimonials-title"
      className="overflow-hidden py-24 md:py-36"
    >
      <div className="container-ledger">
        <SectionHeading index="09" kicker={testimonials.kicker} title={testimonials.title} id="testimonials-title" />

        <div
          ref={viewport}
          role="region"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") goTo(index + 1);
            if (e.key === "ArrowLeft") goTo(index - 1);
          }}
          className="-mx-4 px-4 py-6 md:-mx-8 md:px-8"
        >
          <div
            ref={track}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{ touchAction: "pan-y" }}
            className="flex w-max cursor-grab gap-6 will-change-transform active:cursor-grabbing"
          >
            {notes.map((n, i) => (
              <AuditNote key={n.ref} note={n} i={i} total={notes.length} />
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center gap-6">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            className="grid size-11 place-items-center rounded-full border border-ink transition-opacity disabled:opacity-30"
            aria-label="Previous note"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            disabled={index >= notes.length - 1}
            className="grid size-11 place-items-center rounded-full border border-ink transition-opacity disabled:opacity-30"
            aria-label="Next note"
          >
            →
          </button>
          <span className="num text-sm text-ink-muted" aria-live="polite">
            {String(index + 1).padStart(2, "0")} / {String(notes.length).padStart(2, "0")}
          </span>
          <span className="smallcaps ml-auto hidden md:inline">Drag to review</span>
        </div>
      </div>
    </LedgerSection>
  );
}
