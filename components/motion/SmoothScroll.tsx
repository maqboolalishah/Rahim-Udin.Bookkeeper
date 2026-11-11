"use client";
import { useEffect } from "react";
import type Lenis from "lenis";
import { loadGsap } from "./gsap";

let lenisInstance: Lenis | null = null;
/** Access the Lenis instance (null when reduced motion / not yet loaded). */
export const getLenis = () => lenisInstance;

/** easeInOutCubic: the closest (t)=>t match to the "page" bezier for Lenis. */
const pageEase = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Smooth-scroll to a selector / element / y, falling back to native scroll. */
export function scrollToTarget(target: string | number | HTMLElement, opts: { duration?: number } = {}) {
  const lenis = lenisInstance;
  if (lenis) {
    lenis.scrollTo(target, {
      duration: opts.duration ?? 1.4,
      easing: pageEase,
      offset: typeof target === "number" ? 0 : -72,
    });
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (typeof target === "number") window.scrollTo({ top: target, behavior: reduce ? "auto" : "smooth" });
  else {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }
}

/**
 * Lenis smooth scrolling driven by GSAP's ticker so ScrollTrigger and Lenis
 * share one clock (no double rAF, no jitter on pinned sections). Both libs
 * are lazy-loaded after first paint. Disabled for prefers-reduced-motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let cleanup = () => {};

    Promise.all([import("lenis"), loadGsap()]).then(([{ default: LenisCtor }, { gsap, ScrollTrigger }]) => {
      if (cancelled) return;
      const lenis = new LenisCtor({ autoRaf: false, anchors: { offset: -72 }, lerp: 0.11 });
      lenisInstance = lenis;
      // The preloader may still be running: respect its scroll lock.
      if (!document.documentElement.hasAttribute("data-preloaded")) lenis.stop();
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      cleanup = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        lenisInstance = null;
      };
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);
  return null;
}
