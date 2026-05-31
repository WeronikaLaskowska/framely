import { GAMES } from "@/lib/games";
import { GameCell } from "@/features/games/components/GameCell";
import { ScrollReveal } from "@/common/decoration/ScrollReveal";
import { SectionTitle } from "@/common/typography/SectionTitle";
import { EmberText } from "@/common/typography/EmberText";

/** The games shown as a contact sheet of film cells. */
export const GamesPreview = () => (
  <section className="relative mx-auto w-full max-w-6xl px-5 py-24 xl:px-10">
    <div className="fr-grid-backdrop pointer-events-none absolute inset-0" aria-hidden />

    <ScrollReveal className="relative mb-10 flex flex-wrap items-end justify-between gap-4">
      <SectionTitle>
        The <EmberText>lineup</EmberText>
      </SectionTitle>
    </ScrollReveal>

    <div className="relative grid gap-5 md:grid-cols-2">
      {GAMES.map((game, i) => (
        <ScrollReveal key={game.slug} delay={160 + i * 110} className="h-full">
          <GameCell game={game} />
        </ScrollReveal>
      ))}
    </div>
  </section>
);
