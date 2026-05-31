"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";

type HoverCardProps = {
  children: React.ReactNode;
  className?: string;
  /** Add a subtle 3D tilt toward the cursor. */
  tilt?: boolean;
};

/**
 * Card wrapper that writes --mouse-x / --mouse-y (for the spotlight) and,
 * when `tilt` is set, --tilt-x / --tilt-y for a gentle 3D lean toward the
 * cursor. All visuals live in `.fr-hover-card` in globals.css.
 */
export function HoverCard({ children, className, tilt = false }: HoverCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--mouse-x", `${x}px`);
    el.style.setProperty("--mouse-y", `${y}px`);
    if (tilt) {
      const rx = ((y / rect.height) - 0.5) * -6;
      const ry = ((x / rect.width) - 0.5) * 6;
      el.style.setProperty("--tilt-x", `${rx}deg`);
      el.style.setProperty("--tilt-y", `${ry}deg`);
    }
  }

  function onLeave() {
    const el = ref.current;
    if (!el || !tilt) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn("fr-hover-card", className)}
    >
      {children}
    </div>
  );
}
