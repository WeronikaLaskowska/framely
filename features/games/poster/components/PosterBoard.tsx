"use client";

import { useMemo } from "react";
import { CornerFrame } from "@/common/decoration/CornerFrame";

type PosterBoardProps = {
  posterUrl: string;
  cols: number;
  rows: number;
  /** Indices in reveal order. */
  order: number[];
  /** How many tiles (from the front of `order`) are cleared. */
  revealedCount: number;
  /** When true, every tile is cleared (round over). */
  fullyRevealed: boolean;
};

/**
 * The poster behind a grid of frosted tiles, framed like a screening monitor.
 * Cleared tiles fade away to expose the artwork; covered tiles stay blurred.
 */
export const PosterBoard = ({
  posterUrl,
  cols,
  rows,
  order,
  revealedCount,
  fullyRevealed,
}: PosterBoardProps) => {
  const total = cols * rows;
  const revealed = useMemo(() => new Set(order.slice(0, revealedCount)), [order, revealedCount]);

  return (
    <div className="relative mx-auto w-full max-w-[340px]">
      <div className="fr-monitor__halo" aria-hidden />
      <div className="fr-monitor relative aspect-[2/3]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={posterUrl}
          alt="Hidden movie poster"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
          }}
        >
          {Array.from({ length: total }, (_, i) => {
            const clear = fullyRevealed || revealed.has(i);
            return (
              <div
                key={i}
                className="fr-poster-tile"
                style={{
                  backdropFilter: clear ? "none" : "blur(15px)",
                  WebkitBackdropFilter: clear ? "none" : "blur(15px)",
                  backgroundColor: clear ? "transparent" : "rgba(7,7,10,0.74)",
                  borderRight:
                    !clear && (i + 1) % cols !== 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  borderBottom:
                    !clear && i < total - cols ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}
              />
            );
          })}
        </div>
        <div className="fr-scanlines" aria-hidden />
        <CornerFrame />
      </div>
    </div>
  );
};
