/**
 * Tiny pub/sub for "the ledger has been opened" (preloader finished, or was
 * skipped / not shown). The hero waits on this before running its intro.
 */
let opened = false;
const listeners = new Set<() => void>();

export function markOpened() {
  if (opened) return;
  opened = true;
  listeners.forEach((l) => l());
  listeners.clear();
}

export function onOpened(cb: () => void): () => void {
  if (opened || (typeof document !== "undefined" && document.documentElement.hasAttribute("data-preloaded"))) {
    opened = true;
    queueMicrotask(cb);
    return () => {};
  }
  listeners.add(cb);
  return () => listeners.delete(cb);
}
