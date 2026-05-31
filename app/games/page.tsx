import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { GAMES } from "@/lib/games";
import { GameCell } from "@/features/games/game-cell";

export const metadata = {
  title: "Framely — choose a game",
};

export default function GamesPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-14 xl:px-10">
      <Link
        href="/"
        className="fr-timecode inline-flex items-center gap-2 transition-colors hover:text-fr-fg"
      >
        <ArrowLeft size={14} /> Back home
      </Link>

      <div className="fr-rise mt-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="fr-section-title mt-5">
            Choose a <span className="fr-ember-text">game</span>
          </h1>
        </div>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {GAMES.map((game, i) => (
          <div key={game.slug} className={`fr-rise h-full ${i === 1 ? "fr-delay-1" : ""}`}>
            <GameCell game={game} />
          </div>
        ))}
      </div>
    </main>
  );
}
