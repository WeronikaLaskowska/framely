import { GAMES } from "@/lib/games";
import { GameCell } from "@/features/games/components/GameCell";
import { BackLink } from "@/common/ui/BackLink";
import { SectionTitle } from "@/common/typography/SectionTitle";
import { EmberText } from "@/common/typography/EmberText";

export const GamesScreen = () => (
  <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:py-14 xl:px-10">
    <BackLink href="/" label="Back home" />

    <div className="fr-rise mt-10 flex flex-wrap items-end justify-between gap-4">
      <SectionTitle as="h1" className="mt-5">
        Choose a <EmberText>game</EmberText>
      </SectionTitle>
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
