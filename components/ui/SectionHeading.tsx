import { cn } from "@/lib/utils";

type Props = {
  index: string; // "02"
  kicker: string;
  title: string;
  intro?: string;
  id: string; // heading id for aria-labelledby
  className?: string;
  align?: "left" | "split";
};

/**
 * Section masthead: folio number + small-caps kicker, a big serif title,
 * and a single rule (subtotal) drawn beneath when the section enters.
 */
export function SectionHeading({ index, kicker, title, intro, id, className, align = "split" }: Props) {
  return (
    <header className={cn("mb-12 md:mb-20", className)}>
      <div className="reveal flex items-baseline gap-4">
        <span className="num text-xs text-brass-text">§ {index}</span>
        <span className="smallcaps">{kicker}</span>
      </div>
      <div className="mt-2 h-px w-full bg-ink/80 draw-x" aria-hidden />
      <div className={cn("mt-6 grid gap-6 md:mt-8", align === "split" && "lg:grid-cols-12")}>
        <h2
          id={id}
          className="reveal display text-[clamp(2.5rem,6.4vw,6rem)] lg:col-span-7"
          style={{ "--i": 1 } as React.CSSProperties}
        >
          {title}
        </h2>
        {intro && (
          <p
            className="reveal max-w-[34rem] self-end text-[17px] leading-relaxed text-ink-muted lg:col-span-4 lg:col-start-9"
            style={{ "--i": 2 } as React.CSSProperties}
          >
            {intro}
          </p>
        )}
      </div>
    </header>
  );
}
