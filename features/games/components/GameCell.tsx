import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GAMES, type GameMeta } from "@/lib/games";
import { HoverCard } from "@/common/decoration/HoverCard";
import { DisplayHeading } from "@/common/typography/DisplayHeading";
import { Timecode } from "@/common/typography/Timecode";
import { Counter } from "@/common/typography/Counter";

const TOTAL = String(GAMES.length).padStart(3, "0");

export const GameCell = ({ game }: { game: GameMeta }) => {
  const accent = game.accent === "cool" ? "text-fr-cool" : "text-fr-flame";
  const accentBg = game.accent === "cool" ? "bg-fr-cool" : "bg-fr-flame";

  return (
    <Link href={game.href} className="block h-full">
      <HoverCard tilt className="fr-card fr-cell group h-full p-7 pl-10 pr-10 md:p-9 md:pl-12 md:pr-12">
        <span className="fr-cell__sprocket fr-cell__sprocket--l" aria-hidden />
        <span className="fr-cell__sprocket fr-cell__sprocket--r" aria-hidden />

        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2.5">
              <span className={`h-1.5 w-1.5 rounded-full ${accentBg}`} />
              <Counter>
                {game.index} / {TOTAL}
              </Counter>
            </span>
            <span className="inline-flex h-9 w-9 items-center justify-center border-2 border-fr-border-strong text-fr-fg-muted transition-colors group-hover:border-fr-flame group-hover:text-fr-flame">
              <ArrowUpRight size={16} />
            </span>
          </div>

          <DisplayHeading as="h3" className="mt-7 text-xl md:text-2xl">
            {game.title}
          </DisplayHeading>
          <Timecode className={`mt-3 ${accent}`}>{game.tagline}</Timecode>

          <p className="mt-4 max-w-md text-fr-fg-muted">{game.description}</p>

          <Timecode className="mt-7 inline-flex items-center gap-2 text-fr-fg-subtle transition-colors group-hover:text-fr-fg">
            Play {game.title} →
          </Timecode>
        </div>
      </HoverCard>
    </Link>
  );
};
