"use client";
import { useRef } from "react";
import { tools } from "@/content/site";
import { LedgerSection } from "@/components/motion/LedgerSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useInViewOnce } from "@/components/motion/useInView";
import { cn } from "@/lib/utils";

type Folder = { name: string; note: string };

/**
 * One cabinet drawer. When it scrolls into view the drawer front pulls out and
 * the folders rise into view, tabs staggered like a real file. Hover/focus
 * lifts a folder to show its note.
 */
function Drawer({ label, folders, index }: { label: string; folders: readonly Folder[]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const open = useInViewOnce(ref, { threshold: 0.45 });
  const n = folders.length;
  const step = 22; // px each folder sits higher than the one in front
  const interior = 150 + (n - 1) * step;

  return (
    <div ref={ref} className="reveal" style={{ "--i": index } as React.CSSProperties}>
      {/* drawer interior: folders */}
      <ul
        className="relative px-3 [clip-path:inset(-140px_-24px_0_-24px)]"
        style={{ height: interior }}
        aria-label={`${label} folders`}
      >
        {folders.map((f, i) => {
          const fromFront = i; // 0 = front-most
          return (
            <li
              key={f.name}
              tabIndex={0}
              className="group/folder absolute inset-x-3 bottom-0 h-[150px] outline-none transition-transform duration-[900ms] ease-settle"
              style={{
                zIndex: n - i,
                transform: open ? `translateY(${-fromFront * step}px)` : "translateY(105%)",
                transitionDelay: `${(n - i) * 70 + 150}ms`,
              }}
            >
              <div className="h-full transition-transform duration-500 ease-settle group-hover/folder:-translate-y-[84px] group-focus-visible/folder:-translate-y-[84px]">
                {/* tab */}
                <div
                  className="relative z-10 flex h-7 w-max max-w-[60%] items-center gap-2 rounded-t-md border border-b-0 border-[color-mix(in_oklab,var(--brass)_70%,var(--ink))] bg-[color-mix(in_oklab,var(--brass)_32%,var(--paper))] px-3"
                  style={{ marginLeft: `${(i * 23) % 62}%` }}
                >
                  {/* neutral logo slot */}
                  <span aria-hidden className="size-3.5 shrink-0 rounded-[3px] border border-dashed border-ink/50" />
                  <span className="truncate font-mono text-[11px] tracking-wide">{f.name}</span>
                </div>
                {/* folder body */}
                <div className="h-[calc(100%-1.75rem)] rounded-md rounded-tl-none border border-[color-mix(in_oklab,var(--brass)_70%,var(--ink))] bg-[color-mix(in_oklab,var(--brass)_22%,var(--paper))] px-4 pt-[26px] shadow-[0_-4px_12px_-8px_rgb(var(--shadow)/0.5)]">
                  <p className="smallcaps !text-[9.5px]">Note</p>
                  <p className="mt-1 text-sm">{f.note}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* drawer front */}
      <div
        className={cn(
          "relative z-20 -mt-[70px] rounded-md border border-ink/70 bg-paper-deep px-5 pb-6 pt-5 shadow-[0_24px_40px_-28px_rgb(var(--shadow)/0.8)] transition-transform duration-[900ms] ease-page",
          open ? "translate-y-3" : "translate-y-0",
        )}
      >
        <div className="mx-auto flex w-max items-center gap-3 border border-ink/50 bg-paper px-4 py-1.5">
          <span className="smallcaps !text-ink">{label}</span>
          <span className="num text-[10px] text-ink-muted">{String(n).padStart(2, "0")} files</span>
        </div>
        {/* handle */}
        <div aria-hidden className="mx-auto mt-4 h-3 w-28 rounded-b-xl border-2 border-t-0 border-ink/70" />
      </div>
    </div>
  );
}

/** TOOLS & CERTIFICATIONS: "The Filing Cabinet". */
export function Tools() {
  return (
    <LedgerSection id="tools" entry="tools" aria-labelledby="tools-title" className="py-24 md:py-36">
      <div className="container-ledger">
        <SectionHeading index="08" kicker={tools.kicker} title={tools.title} id="tools-title" />
        <div className="mx-auto grid max-w-5xl gap-16 rounded-xl border border-ink/20 bg-[color-mix(in_oklab,var(--ink)_4%,var(--paper))] p-4 pt-10 md:grid-cols-2 md:gap-8 md:p-8 md:pt-12">
          {tools.drawers.map((d, i) => (
            <Drawer key={d.label} label={d.label} folders={d.folders} index={i} />
          ))}
        </div>
      </div>
    </LedgerSection>
  );
}
