import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { GameMeta } from "@/lib/games";
import { HoverCard } from "@/components/hover-card";
import { CornerFrame } from "@/components/corner-frame";

/** A game presented as a film-negative "contact-sheet" cell. */
export function GameCell({ game }: { game: GameMeta }) {
  const accent = game.accent === "cool" ? "text-fr-cool" : "text-fr-flame";
  const accentBg = game.accent === "cool" ? "bg-fr-cool" : "bg-fr-flame";

  return (
    <Link href={game.href} className="block h-full">
      <HoverCard tilt className="fr-card fr-cell group h-full p-7 pl-10 pr-10 md:p-9 md:pl-12 md:pr-12">
        <span className="fr-cell__sprocket fr-cell__sprocket--l" aria-hidden />
        <span className="fr-cell__sprocket fr-cell__sprocket--r" aria-hidden />
        {/* <CornerFrame /> */}

        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2.5">
              <span className={`h-1.5 w-1.5 rounded-full ${accentBg}`} />
              <span className="fr-counter">{game.index} / 002</span>
            </span>
            <span className="inline-flex h-9 w-9 items-center justify-center border-2 border-fr-border-strong text-fr-fg-muted transition-colors group-hover:border-fr-flame group-hover:text-fr-flame">
              <ArrowUpRight size={16} />
            </span>
          </div>

          <h3 className="fr-display mt-7 text-xl md:text-2xl">{game.title}</h3>
          <span className={`fr-timecode mt-3 ${accent}`}>{game.tagline}</span>

          <p className="mt-4 max-w-md text-fr-fg-muted">{game.description}</p>

          <span className="fr-timecode mt-7 inline-flex items-center gap-2 text-fr-fg-subtle transition-colors group-hover:text-fr-fg">
            Play {game.title} →
          </span>
        </div>
      </HoverCard>
    </Link>
  );
}
