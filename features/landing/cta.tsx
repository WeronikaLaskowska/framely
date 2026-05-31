import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";
import { CornerFrame } from "@/components/corner-frame";

/** Closing "feature presentation" slate. */
export function Cta() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 pb-28 pt-8 xl:px-10">
      <ScrollReveal>
        <div className="fr-card relative overflow-hidden px-6 py-16 text-center md:px-10 md:py-24">
          <CornerFrame />

          <ScrollReveal delay={140} className="relative mx-auto mt-5 max-w-3xl">
            <h2 className="fr-display text-[clamp(1.5rem,4.5vw,3rem)] leading-[1.35]">
              Lights down.
              <br />
              <span className="fr-ember-text">Roll the film.</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={300} className="mt-9">
            <Link
              href="/games"
              className="fr-btn fr-btn--ember relative px-8 py-4 text-base"
            >
              Choose a game
            </Link>
          </ScrollReveal>
        </div>
      </ScrollReveal>
    </section>
  );
}
