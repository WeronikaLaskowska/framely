"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Delay in ms before the reveal transition starts once in view. */
  delay?: number;
};

/**
 * Wraps content with the `.fr-reveal` entrance, toggled to `.is-visible` the
 * first time it scrolls into view via IntersectionObserver.
 */
export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("fr-reveal", visible && "is-visible", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
