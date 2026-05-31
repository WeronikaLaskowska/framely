import Link from "next/link";
import { Play, Film } from "lucide-react";
import { TvHero } from "@/features/landing/tv-hero";
import { DecodeText } from "@/components/decode-text";
import { Marquee } from "@/components/marquee";

const MARQUEE_ITEMS = [
  "GENRE",
  "RELEASE YEAR",
  "BOX OFFICE",
  "RATING",
  "STUDIO",
  "CAST",
  "RUNTIME",
  "ASPECT 2.39:1",
  "ISO 1980+",
];

export function Hero() {
  return (
    <section className="relative">
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-12 md:py-24 xl:px-10">
        {/* copy */}
        <div className="relative z-10 flex flex-col items-start gap-6 md:col-span-7">
          {/* <span className="fr-rise fr-tape">
            <Film size={12} />
            Daily cinema puzzle
          </span> */}

          <h1 className="fr-rise fr-delay-1 fr-display text-[clamp(1.6rem,5.4vw,3.4rem)] leading-[1.35]">
            <span className="fr-stock-text">NAME</span>{" "}
            <span className="fr-outline-text">THE</span>
            <br />
            <DecodeText text="MOVIE." className="fr-ember-text" delay={500} duration={1100} />
          </h1>

          <p className="fr-rise fr-delay-2 max-w-md text-lg leading-relaxed text-fr-fg-muted">
            You think you know everything about movies, don&apos;t you? Well
            guess what, you don&apos;t know anything. Play this game and
            you&apos;ll see just how much you don&apos;t know.
          </p>

          <div className="fr-rise fr-delay-3 flex flex-wrap items-center gap-3">
            <Link href="/games" className="fr-btn fr-btn--ember px-6 py-3.5 text-base">
              <Play size={17} /> Start the reel
            </Link>
            <Link href="/games/poster" className="fr-btn fr-btn--ghost px-6 py-3.5 text-base">
              Poster mode
            </Link>
          </div>

          <div className="fr-rise fr-delay-4 mt-2 flex flex-wrap gap-x-6 gap-y-1">
            <span className="fr-timecode">6 clues</span>
            <span className="fr-timecode">2 games</span>
            <span className="fr-timecode">Films 1980 →</span>
            <span className="fr-timecode">Powered by TMDB</span>
          </div>
        </div>

        {/* monitor */}
        <div className="fr-rise fr-delay-2 relative z-10 md:col-span-5">
          <TvHero />
        </div>
      </div>

      {/* attribute marquee */}
      <div className="fr-rise fr-delay-5 border-y border-fr-border/60 bg-fr-bg-2/40">
        <div className="mx-auto max-w-6xl xl:px-6">
          <Marquee items={MARQUEE_ITEMS} />
        </div>
      </div>
    </section>
  );
}
