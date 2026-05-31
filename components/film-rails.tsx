"use client";

import { useEffect, useRef } from "react";

/**
 * Fixed perforated film-strip rails framing the viewport on wide screens.
 * A glowing "playhead" glides along each rail in sync with the page scroll
 * position, lighting up the sprocket holes it passes over. Respects
 * reduced-motion (the head still tracks scroll, just without easing).
 */
export function FilmRails() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const progress = max > 0 ? Math.min(Math.max(doc.scrollTop / max, 0), 1) : 0;
      node.style.setProperty("--scroll", progress.toFixed(4));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="fr-rails" aria-hidden>
      <div className="fr-rail fr-rail--left">
        <span className="fr-rail__head" />
      </div>
      <div className="fr-rail fr-rail--right">
        <span className="fr-rail__head" />
      </div>
    </div>
  );
}
