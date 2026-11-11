"use client";
import { useEffect, useState, type RefObject } from "react";

/**
 * Fires once when the element crosses the threshold, then disconnects.
 * Cheap: one IntersectionObserver per call, no scroll listeners.
 */
export function useInViewOnce<T extends Element>(
  ref: RefObject<T | null>,
  { threshold = 0.25, rootMargin = "0px 0px -10% 0px" }: IntersectionObserverInit = {},
): boolean {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, seen, threshold, rootMargin]);
  return seen;
}
