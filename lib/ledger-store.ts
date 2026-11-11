import { create } from "zustand";
import { ledgerEntries } from "@/content/site";

/**
 * The Living Ledger store.
 * Sections "post" their entry when they enter the viewport. The final
 * `contact` entry is only posted when the invoice is sent, which closes the
 * books: difference = 0.00 and `balanced` flips to true.
 */
type LedgerState = {
  posted: string[];
  balanced: boolean;
  post: (id: string) => void;
  /** Post every outstanding entry and mark the books balanced. */
  closeBooks: () => void;
};

const CLOSING_ID = "contact";

export const useLedger = create<LedgerState>((set, get) => ({
  posted: [],
  balanced: false,
  post: (id) => {
    if (id === CLOSING_ID) return; // closing entry is reserved for closeBooks()
    if (get().posted.includes(id)) return;
    if (!ledgerEntries.some((e) => e.id === id)) return;
    set((s) => ({ posted: [...s.posted, id] }));
  },
  closeBooks: () =>
    set(() => ({
      // Keep visual order: already-posted first, then the rest in ledger order.
      posted: [...get().posted, ...ledgerEntries.map((e) => e.id).filter((id) => !get().posted.includes(id))],
      balanced: true,
    })),
}));

export type Totals = { dr: number; cr: number; diff: number; count: number; total: number };

export function computeTotals(posted: string[]): Totals {
  let dr = 0;
  let cr = 0;
  for (const id of posted) {
    const e = ledgerEntries.find((x) => x.id === id);
    if (e) {
      dr += e.dr;
      cr += e.cr;
    }
  }
  return { dr, cr, diff: dr - cr, count: posted.length, total: ledgerEntries.length };
}
