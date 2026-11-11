import { results } from "@/content/site";
import { LedgerSection } from "@/components/motion/LedgerSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Odometer } from "@/components/ui/Odometer";

type Row = { label: string; value: number; suffix: string; decimals: number };

function Side({ heading, rows, total, side }: { heading: string; rows: readonly Row[]; total: Row; side: "l" | "r" }) {
  return (
    <div className={side === "l" ? "lg:pr-12" : "lg:border-l lg:border-ink lg:pl-12"}>
      <h3 className="smallcaps border-b border-ink pb-2 !text-ink">{heading}</h3>
      <dl>
        {rows.map((r, i) => (
          <div
            key={r.label}
            className="reveal flex items-baseline gap-4 border-b border-rule py-4"
            style={{ "--i": i } as React.CSSProperties}
          >
            <dt className="text-[15px] md:text-base">{r.label}</dt>
            <span aria-hidden className="flex-1 translate-y-[-4px] border-b border-dotted border-ink/25" />
            <dd className="text-[clamp(1.5rem,3vw,2.25rem)] leading-none">
              <Odometer value={r.value} decimals={r.decimals} suffix={r.suffix} />
            </dd>
          </div>
        ))}
        {/* subtotal rule then the total, double-underlined once the drums settle */}
        <div className="mt-1 h-px origin-left bg-ink draw-x" style={{ "--i": 10 } as React.CSSProperties} aria-hidden />
        <div className="flex items-baseline gap-4 pt-5">
          <dt className="font-serif text-xl italic md:text-2xl">{total.label}</dt>
          <span aria-hidden className="flex-1" />
          <dd className="relative pb-2 text-[clamp(2.25rem,5vw,3.75rem)] leading-none text-green">
            <Odometer value={total.value} decimals={total.decimals} suffix={total.suffix} />
            <span aria-hidden className="absolute inset-x-0 bottom-0 flex flex-col gap-[3px]">
              <span className="h-px origin-left bg-green draw-x" style={{ "--i": 20 } as React.CSSProperties} />
              <span className="h-px origin-left bg-green draw-x" style={{ "--i": 23 } as React.CSSProperties} />
            </span>
          </dd>
        </div>
      </dl>
    </div>
  );
}

/** RESULTS: key stats as a mini balance sheet with adding-machine odometers. */
export function Results() {
  return (
    <LedgerSection id="results" entry="results" aria-labelledby="results-title" className="py-24 md:py-36">
      <div className="container-ledger">
        <SectionHeading index="07" kicker={results.kicker} title={results.title} id="results-title" />
        <div className="reveal mx-auto max-w-6xl border-y-2 border-ink bg-paper py-8 md:py-12">
          <div className="mb-10 text-center">
            <p className="font-serif text-2xl md:text-3xl">Statement of Financial Position</p>
            <p className="smallcaps mt-2">{results.asOf}</p>
          </div>
          <div className="grid gap-14 px-4 md:px-10 lg:grid-cols-2 lg:gap-0">
            <Side heading={results.assets.heading} rows={results.assets.rows} total={results.assets.total} side="l" />
            <Side heading={results.equity.heading} rows={results.equity.rows} total={results.equity.total} side="r" />
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-ink-muted">{results.footnote}</p>
      </div>
    </LedgerSection>
  );
}
