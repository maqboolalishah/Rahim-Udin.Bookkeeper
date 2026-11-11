"use client";
import { useEffect, useState } from "react";
import { nav, person, hero } from "@/content/site";
import { InkLink } from "@/components/ui/InkLink";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * Masthead. The nav link for the section in view gets the double underline
 * (aria-current), the ledger convention for "this is the total".
 */
export function Header() {
  const [active, setActive] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Watch every section; only nav targets get the double underline.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    document.querySelectorAll("main section[id]").forEach((el) => io.observe(el));
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  // Close the mobile sheet on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background-color,border-color] duration-500",
        scrolled || open ? "border-b border-rule bg-paper/90 backdrop-blur-md" : "border-b border-transparent",
      )}
    >
      <div className="container-ledger flex h-[var(--header-h)] items-center justify-between gap-6">
        <a href="#top" className="group flex items-center gap-3" data-cursor="link">
          <span
            aria-hidden
            className="grid size-9 place-items-center rounded-full border border-ink font-serif text-[13px] italic transition-transform duration-500 ease-stamp group-hover:-rotate-12"
          >
            {person.initials.replace(/[[\]]/g, "")}
          </span>
          <span className="sr-only sm:hidden">{person.name}, home</span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="font-serif text-[15px]">{person.name}</span>
            <span className="smallcaps !text-[9.5px]">
              {person.title} · {person.city}
            </span>
          </span>
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-[13.5px]">
            {nav.map((n) => (
              <li key={n.href}>
                <InkLink href={n.href} aria-current={active === n.href.slice(1) ? "true" : undefined}>
                  {n.label}
                </InkLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <span className="hidden md:block">
            <Button href={hero.primaryCta.href} className="!h-10 !px-5 !text-[13px]">
              {hero.primaryCta.label}
            </Button>
          </span>
          <button
            type="button"
            className="relative grid size-10 place-items-center lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {/* Two rules that become an × : "void entry" */}
            <span
              className={cn(
                "absolute h-px w-5 bg-ink transition-transform duration-300 ease-settle",
                open ? "rotate-45" : "-translate-y-1",
              )}
            />
            <span
              className={cn(
                "absolute h-px w-5 bg-ink transition-transform duration-300 ease-settle",
                open ? "-rotate-45" : "translate-y-1",
              )}
            />
          </button>
        </div>
      </div>

      {/* Mobile sheet: slides out like a page from a file folder. */}
      <nav
        id="mobile-nav"
        aria-label="Mobile"
        className={cn(
          "border-t border-rule bg-paper transition-[opacity,transform,visibility] duration-400 ease-page lg:hidden",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-3 opacity-0 max-lg:absolute max-lg:inset-x-0",
        )}
      >
        <ul className="container-ledger py-4">
          {nav.map((n, i) => (
            <li key={n.href} className="border-b border-rule last:border-0">
              <a
                href={n.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline justify-between py-3.5 font-serif text-2xl"
              >
                {n.label}
                <span className="num text-xs text-ink-muted">{String(i + 1).padStart(2, "0")}</span>
              </a>
            </li>
          ))}
          <li className="pt-4">
            <Button href={hero.primaryCta.href} className="w-full" onClick={() => setOpen(false)}>
              {hero.primaryCta.label}
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
