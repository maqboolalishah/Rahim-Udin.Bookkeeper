"use client";
import { useEffect, useId, useRef, useState } from "react";
import { experience } from "@/content/site";
import { LedgerSection } from "@/components/motion/LedgerSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TweenNumber } from "@/components/ui/TweenAmount";
import { cn } from "@/lib/utils";

type Role = (typeof experience.roles)[number];

/** One role = one ledger row. Expands (aria-expanded) to reveal the detail. */
function RoleRow({
  role,
  open,
  onToggle,
  rowRef,
}: {
  role: Role;
  open: boolean;
  onToggle: () => void;
  rowRef: (el: HTMLLIElement | null) => void;
}) {
  const id = useId();
  return (
    <li ref={rowRef} className="reveal">
      <div className="border-b border-rule py-3 text-ink-muted">
        <span className="smallcaps !text-brass-text">{role.fy}</span>
      </div>
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={id}
          className="group grid w-full grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 border-b border-ink/60 py-5 text-left md:grid-cols-[9rem_1fr_6rem_2rem]"
        >
          <span className="num text-sm text-ink-muted max-md:col-span-2">{role.period}</span>
          <span>
            <span className="block font-serif text-2xl leading-tight md:text-[30px]">{role.role}</span>
            <span className="mt-1 block text-[15px] text-ink-muted">{role.org}</span>
          </span>
          <span className="num text-right text-lg" data-cursor="audit">
            {role.hours === null ? (
              <span className="text-sm text-ink-muted">{experience.fixedLabel}</span>
            ) : (
              <>
                {role.hours.toLocaleString("en-US")}
                <span className="ml-1 text-xs text-ink-muted">{experience.unit}</span>
              </>
            )}
          </span>
          {/* + → = */}
          <span aria-hidden className="relative hidden size-4 self-center md:block">
            <span
              className={cn(
                "absolute left-0 top-1/2 h-px w-full bg-ink transition-transform duration-300 ease-settle",
                open && "-translate-y-[3px]",
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-1/2 h-px w-full bg-ink transition-transform duration-300 ease-settle",
                open ? "translate-y-[3px]" : "rotate-90",
              )}
            />
          </span>
        </button>
      </h3>
      <div
        id={id}
        role="region"
        className={cn(
          "grid transition-[grid-template-rows] duration-500 ease-settle",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden" inert={!open}>
          <div className="grid gap-8 py-6 md:grid-cols-2 md:pl-[10.5rem]">
            <div>
              <p className="smallcaps mb-3">Responsibilities</p>
              <ul className="space-y-2 text-[15px] leading-relaxed">
                {role.responsibilities.map((r) => (
                  <li key={r} className="flex gap-3">
                    <span aria-hidden className="text-ink-muted">
                      –
                    </span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="smallcaps mb-3">Achievements</p>
              <ul className="space-y-2 text-[15px] leading-relaxed">
                {role.achievements.map((a) => (
                  <li key={a} className="flex gap-3">
                    <span aria-hidden className="text-green">
                      ✓
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

/**
 * EXPERIENCE: the general ledger. A brass running balance accumulates years
 * as each row passes the middle of the viewport.
 */
export function Experience() {
  const [open, setOpen] = useState<number | null>(0);
  const [balance, setBalance] = useState(0);
  const rows = useRef<Array<HTMLLIElement | null>>([]);
  const total = experience.roles.reduce((s, r) => s + (r.hours ?? 0), 0);

  useEffect(() => {
    const cumulative = experience.roles.map((_, i) => experience.roles.slice(0, i + 1).reduce((s, r) => s + (r.hours ?? 0), 0));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const i = rows.current.indexOf(e.target as HTMLLIElement);
          if (i < 0) continue;
          // Row crosses the middle band going down → brought forward; going up → reversed.
          if (e.isIntersecting) setBalance((b) => Math.max(b, cumulative[i]));
          else if (e.boundingClientRect.top > window.innerHeight / 2) setBalance(i === 0 ? 0 : cumulative[i - 1]);
        }
      },
      { rootMargin: "0px 0px -50% 0px" },
    );
    rows.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);

  return (
    <LedgerSection id="experience" entry="experience" ruled aria-labelledby="experience-title" className="py-24 md:py-36">
      <div className="container-ledger">
        <SectionHeading index="06" kicker={experience.kicker} title={experience.title} id="experience-title" />

        <div className="grid gap-10 lg:grid-cols-12">
          {/* Running balance */}
          <aside aria-label={experience.runningLabel} className="lg:order-2 lg:col-span-3 lg:col-start-10">
            <div className="sticky top-24 z-10 border border-brass bg-paper/95 p-5 backdrop-blur-sm max-lg:flex max-lg:items-baseline max-lg:justify-between">
              <p className="smallcaps !text-brass-text">{experience.runningLabel}</p>
              <p className="mt-2 font-serif text-brass-text max-lg:mt-0" data-cursor="audit">
                <TweenNumber value={balance} decimals={0} className="text-[clamp(2.5rem,5vw,4.5rem)] leading-none" />
                <span className="ml-2 text-base">{experience.unit}</span>
              </p>
              <div
                aria-hidden
                className="mt-4 h-px origin-left bg-brass transition-transform duration-700 ease-ink max-lg:hidden"
                style={{ transform: `scaleX(${balance / total})` }}
              />
              <p className="num mt-2 text-xs text-ink-muted max-lg:hidden">of {total.toLocaleString("en-US")} carried forward</p>
            </div>
          </aside>

          <div className="lg:order-1 lg:col-span-9">
            <div aria-hidden className="hidden grid-cols-[9rem_1fr_6rem_2rem] gap-x-6 border-b-2 border-ink pb-2 md:grid">
              <span className="smallcaps">Period</span>
              <span className="smallcaps">Account · Role</span>
              <span className="smallcaps text-right">{experience.columnLabel}</span>
              <span />
            </div>
            <ol>
              {experience.roles.map((r, i) => (
                <RoleRow
                  key={r.role}
                  role={r}
                  open={open === i}
                  onToggle={() => setOpen((o) => (o === i ? null : i))}
                  rowRef={(el) => {
                    rows.current[i] = el;
                  }}
                />
              ))}
            </ol>
            <div className="mt-2 flex items-baseline justify-end gap-6 py-4">
              <span className="smallcaps">Total carried forward</span>
              <span className="rule-double num text-lg">
                {total.toLocaleString("en-US")} {experience.unit}
              </span>
            </div>
          </div>
        </div>
      </div>
    </LedgerSection>
  );
}
