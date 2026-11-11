"use client";
import { useRef, type ComponentPropsWithoutRef, type ReactNode, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

type Common = { children: ReactNode; variant?: "primary" | "outline"; size?: "md" | "lg"; className?: string };
type AsLink = Common & { href: string } & Omit<ComponentPropsWithoutRef<"a">, "className" | "children">;
type AsButton = Common & { href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

/**
 * Magnetic CTA. Follows the pointer a few px, presses like a stamp (scale +
 * slight rotation) and leaves an ink-splash ring on click.
 */
export function Button(props: AsLink | AsButton) {
  const { children, variant = "primary", size = "md", className } = props;
  const inner = useRef<HTMLSpanElement>(null);

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || !inner.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * 0.22;
    const dy = (e.clientY - (r.top + r.height / 2)) * 0.32;
    inner.current.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
  };
  const onLeave = () => {
    if (inner.current) inner.current.style.transform = "";
  };
  const splash = (e: PointerEvent<HTMLElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const host = e.currentTarget;
    const r = host.getBoundingClientRect();
    const ring = document.createElement("span");
    const d = Math.max(r.width, r.height);
    ring.setAttribute("aria-hidden", "true");
    ring.style.cssText = `position:absolute;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px;width:${d}px;height:${d}px;border-radius:9999px;border:2px solid currentColor;pointer-events:none;opacity:.55`;
    host.appendChild(ring);
    ring
      .animate(
        [
          { transform: "scale(0.1)", opacity: 0.6 },
          { transform: "scale(1.6)", opacity: 0 },
        ],
        { duration: 650, easing: "cubic-bezier(0.22,1,0.36,1)" },
      )
      .finished.then(
        () => ring.remove(),
        () => ring.remove(),
      );
  };

  const classes = cn(
    "group/btn relative isolate inline-flex select-none items-center justify-center overflow-hidden rounded-full font-medium tracking-[-0.01em]",
    "transition-[transform,background-color,color] duration-200 ease-stamp active:scale-[0.94] active:-rotate-2",
    size === "lg" ? "h-14 px-8 text-[15px]" : "h-12 px-6 text-sm",
    variant === "primary" ? "bg-green text-paper hover:bg-ink" : "border border-ink text-ink hover:bg-ink hover:text-paper",
    className,
  );

  const content = (
    <>
      {/* stamp's dashed inner ring, revealed on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[4px] rounded-full border border-dashed border-current opacity-0 transition-[opacity,transform] duration-300 ease-settle group-hover/btn:opacity-40 scale-95 group-hover/btn:scale-100"
      />
      <span ref={inner} className="relative inline-flex items-center gap-2 transition-transform duration-300 ease-settle">
        {children}
      </span>
    </>
  );

  if (props.href !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { children: _c, variant: _v, size: _s, className: _cl, ...rest } = props as AsLink;
    return (
      <a {...rest} data-cursor="stamp" className={classes} onPointerMove={onMove} onPointerLeave={onLeave} onPointerDown={splash}>
        {content}
      </a>
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { children: _c, variant: _v, size: _s, className: _cl, type = "button", ...rest } = props as AsButton;
  return (
    <button
      {...rest}
      type={type}
      data-cursor="stamp"
      className={classes}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onPointerDown={splash}
    >
      {content}
    </button>
  );
}
