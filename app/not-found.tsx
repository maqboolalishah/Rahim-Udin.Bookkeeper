import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "@/content/site";

export const metadata: Metadata = { title: "Unreconciled entry" };

/** 404: "Unreconciled entry". */
export default function NotFound() {
  return (
    <main id="main" className="ruled relative grid min-h-[100svh] place-items-center pt-[var(--header-h)]">
      <div className="container-ledger max-w-4xl">
        <div className="relative border-y-2 border-ink py-12 md:py-16">
          <p className="smallcaps">Suspense account · Ref. ERR-404</p>
          <h1 className="display mt-6 text-[clamp(2.75rem,8vw,6.5rem)]">
            Unreconciled entry: <span className="num text-audit">(404)</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-muted">{notFound.body}</p>
          <div className="mt-10 grid max-w-md grid-cols-[1fr_auto] gap-y-1 text-sm">
            <span className="smallcaps">Expected</span>
            <span className="num">1 page</span>
            <span className="smallcaps">Found</span>
            <span className="num">0 pages</span>
            <span className="smallcaps border-t border-ink pt-1 !text-ink">Difference</span>
            <span className="num border-t border-ink pt-1 text-audit">(1)</span>
          </div>
          <Link
            href="/"
            className="mt-10 inline-flex h-12 items-center rounded-full bg-green px-6 text-sm font-medium text-paper transition-colors hover:bg-ink"
          >
            {notFound.cta} →
          </Link>
          <span
            aria-hidden
            className="absolute right-0 top-8 -rotate-12 rounded-md border-[3px] border-audit px-4 py-2 font-mono text-lg font-bold uppercase tracking-[0.2em] text-audit opacity-90 md:text-2xl"
          >
            Unmatched
          </span>
        </div>
      </div>
    </main>
  );
}
