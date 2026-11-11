/**
 * The four named easing curves used everywhere on the site.
 * Mirrored as CSS custom properties in globals.css (--ease-*), so CSS
 * transitions, Motion and GSAP all move with the same "hand".
 *
 *  ink    – a pen stroke: slow start, confident middle, gentle lift-off.
 *  settle – things coming to rest on paper (expo-out). Entrances.
 *  stamp  – a rubber stamp landing: fast, slight overshoot.
 *  page   – a page turn / sheet sliding from a folder: symmetric, weighty.
 */
export const EASE = {
  ink: [0.65, 0, 0.35, 1],
  settle: [0.22, 1, 0.36, 1],
  stamp: [0.3, 1.45, 0.5, 1],
  page: [0.76, 0, 0.24, 1],
} as const satisfies Record<string, readonly [number, number, number, number]>;

export type EaseName = keyof typeof EASE;

/** cubic-bezier() string for GSAP CustomEase / WAAPI. */
export const bezier = (name: EaseName) => `cubic-bezier(${EASE[name].join(",")})`;

/** Motion (framer) accepts a mutable 4-tuple. */
export const motionEase = (name: EaseName) => [...EASE[name]] as [number, number, number, number];
