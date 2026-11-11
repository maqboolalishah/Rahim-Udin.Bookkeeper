import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

/**
 * A link that underlines with an ink stroke drawn left→right, then gains a
 * second stroke: the accountant's double underline ("this is the total").
 * Pure CSS: works in Server Components.
 */
export function InkLink({ className, children, ...rest }: ComponentPropsWithoutRef<"a">) {
  return (
    <a data-cursor="link" className={cn("ink-link", className)} {...rest}>
      {children}
      <span aria-hidden className="ink-1" />
      <span aria-hidden className="ink-2" />
    </a>
  );
}
