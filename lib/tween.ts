/**
 * Minimal rAF number tween (replaces a motion library for counters).
 * Easing: easeOutQuint, the closest closed-form match to our "settle" curve.
 */
export const easeSettle = (t: number) => 1 - Math.pow(1 - t, 5);

export function tween(from: number, to: number, ms: number, onUpdate: (v: number) => void, ease = easeSettle): () => void {
  let raf = 0;
  const start = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / ms);
    onUpdate(from + (to - from) * ease(t));
    if (t < 1) raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf);
}
