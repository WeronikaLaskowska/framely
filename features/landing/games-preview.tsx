import { GAMES } from "@/lib/games";
import { ScrollReveal } from "@/components/scroll-reveal";
import { GameCell } from "@/features/games/game-cell";

/** The two games shown as a contact sheet of film cells. */
export function GamesPreview() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-5 py-24 xl:px-10">
      <div className="fr-grid-backdrop pointer-events-none absolute inset-0" aria-hidden />

      <ScrollReveal className="relative mb-10 flex flex-wrap items-end justify-between gap-4">
        <h2 className="fr-section-title">
          The <span className="fr-ember-text">lineup</span>
        </h2>
        <span className="fr-timecode">Contact sheet · 2 modes</span>
      </ScrollReveal>

      <div className="relative grid gap-5 md:grid-cols-2">
        {GAMES.map((game, i) => (
          <ScrollReveal key={game.slug} delay={i * 120} className="h-full">
            <GameCell game={game} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
