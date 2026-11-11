"use client";
/**
 * GSAP is loaded lazily (dynamic import) so it never sits on the critical
 * path for first paint. Call `loadGsap()` inside effects; plugins and the
 * named eases are registered once.
 */
import { EASE } from "./easing";

type GsapBundle = {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
};

let pending: Promise<GsapBundle> | null = null;

export function loadGsap(): Promise<GsapBundle> {
  if (!pending) {
    pending = Promise.all([import("gsap"), import("gsap/ScrollTrigger"), import("gsap/CustomEase")]).then(
      ([{ gsap }, { ScrollTrigger }, { CustomEase }]) => {
        gsap.registerPlugin(ScrollTrigger, CustomEase);
        (Object.keys(EASE) as Array<keyof typeof EASE>).forEach((k) => {
          const [a, b, c, d] = EASE[k];
          CustomEase.create(k, `M0,0 C${a},${b} ${c},${d} 1,1`);
        });
        return { gsap, ScrollTrigger };
      },
    );
  }
  return pending;
}
