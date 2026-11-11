import Image from "next/image";
import { about } from "@/content/site";
import { LedgerSection } from "@/components/motion/LedgerSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JournalRow } from "./JournalRow";

/** ABOUT: the bookkeeper's story as dated journal entries, posted on scroll. */
export function About() {
  return (
    <LedgerSection id="about" entry="about" ruled aria-labelledby="about-title" className="py-24 md:py-36">
      <div className="container-ledger">
        <SectionHeading index="02" kicker={about.kicker} title={about.title} intro={about.intro} id="about-title" />

        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Portrait clipped to the page */}
          <figure className="reveal lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <div className="group relative mx-auto max-w-[22rem] -rotate-2 bg-paper-deep p-3 pb-12 shadow-[0_24px_50px_-30px_rgb(var(--shadow)/0.6)] transition-transform duration-700 ease-settle hover:rotate-0">
                <Image
                  src={about.portrait.src}
                  alt={about.portrait.alt}
                  width={480}
                  height={600}
                  sizes="(min-width: 1024px) 22rem, 80vw"
                  unoptimized={about.portrait.src.endsWith(".svg")}
                  className="h-auto w-full"
                />
                <figcaption className="absolute inset-x-3 bottom-3 flex justify-between font-serif text-[15px] italic text-ink-muted">
                  <span>{about.portrait.caption}</span>
                  <span className="num not-italic text-xs">Fig. 1</span>
                </figcaption>
                {/* Paperclip: wiggles on hover */}
                <svg
                  aria-hidden
                  viewBox="0 0 30 80"
                  className="absolute -top-7 left-8 h-20 w-8 origin-bottom group-hover:animate-[clip-wiggle_0.6s_var(--ease-stamp)]"
                >
                  <path
                    d="M10 60 V14 a6 6 0 0 1 12 0 V66 a9 9 0 0 1 -18 0 V22"
                    fill="none"
                    stroke="var(--ink-muted)"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </figure>

          {/* The journal */}
          <div className="lg:col-span-8">
            <div aria-hidden className="hidden grid-cols-[6rem_1fr_5rem_10rem] gap-x-6 border-b-2 border-ink pb-2 md:grid">
              <span className="smallcaps">Date</span>
              <span className="smallcaps">Description</span>
              <span className="smallcaps">Ref.</span>
              <span className="smallcaps text-right">Posted</span>
            </div>
            <ol>
              {about.entries.map((e, i) => (
                <JournalRow key={e.ref} entry={e} index={i} />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </LedgerSection>
  );
}
