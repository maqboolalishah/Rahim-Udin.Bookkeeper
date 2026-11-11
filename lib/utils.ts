/** Join class names, skipping falsy values. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

const amountFmt = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Format cents as an accounting amount. Negatives use parentheses,
 * as is convention in ledgers: -1234 → "(12.34)".
 */
export function formatAmount(cents: number): string {
  const v = amountFmt.format(Math.abs(cents) / 100);
  return cents < 0 ? `(${v})` : v;
}

/** Deterministic PRNG (mulberry32) so SSR and client render identical "random" layouts. */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
