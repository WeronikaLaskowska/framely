"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type HoverCardProps = {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
};

export const HoverCard = ({ children, className, tilt = false }: HoverCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--mouse-x", `${x}px`);
    el.style.setProperty("--mouse-y", `${y}px`);
    if (tilt) {
      const rx = (y / rect.height - 0.5) * -6;
      const ry = (x / rect.width - 0.5) * 6;
      el.style.setProperty("--tilt-x", `${rx}deg`);
      el.style.setProperty("--tilt-y", `${ry}deg`);
    }
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el || !tilt) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  };

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
};
