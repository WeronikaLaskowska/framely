import { Play } from "lucide-react";
import { TvHero } from "@/features/landing/components/TvHero";
import { MARQUEE_TITLES } from "@/features/landing/data/marqueeTitles";
import { DecodeText } from "@/common/decoration/DecodeText";
import { Marquee } from "@/common/decoration/Marquee";
import { ButtonLink } from "@/common/ui/ButtonLink";
import { DisplayHeading } from "@/common/typography/DisplayHeading";
import { StockText } from "@/common/typography/StockText";
import { OutlineText } from "@/common/typography/OutlineText";
import { Timecode } from "@/common/typography/Timecode";

export const Hero = () => (
  <section className="relative">
    <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-12 md:py-24 xl:px-10">
      <div className="relative z-10 flex flex-col items-start gap-6 md:col-span-7">
        <DisplayHeading className="fr-rise fr-delay-1 text-[clamp(1.6rem,5.4vw,3.4rem)] leading-[1.35]">
          <StockText>NAME</StockText> <OutlineText>THE</OutlineText>
          <br />
          <DecodeText text="MOVIE." className="fr-ember-text" delay={500} duration={1100} />
        </DisplayHeading>

        <p className="fr-rise fr-delay-2 max-w-md text-lg leading-relaxed text-fr-fg-muted">
          You think you know everything about movies, don&apos;t you? Well
          guess what, you don&apos;t know anything. Play this game and
          you&apos;ll see just how much you don&apos;t know.
        </p>

        <div className="fr-rise fr-delay-3 flex flex-wrap items-center gap-3">
          <ButtonLink href="/games/guess-movie" variant="ember" className="px-6 py-3.5 text-base">
            <Play size={17} /> Play Spotle
          </ButtonLink>
          <ButtonLink href="/games" variant="ghost" className="px-6 py-3.5 text-base">
            All games
          </ButtonLink>
        </div>

        <div className="fr-rise fr-delay-4 mt-2 flex flex-wrap gap-x-6 gap-y-1">
          <Timecode>Powered by TMDB</Timecode>
        </div>
      </div>

      <div className="fr-rise fr-delay-2 relative z-10 md:col-span-5">
        <TvHero />
      </div>
    </div>

    <div className="fr-rise fr-delay-5 border-y border-fr-border/60 bg-fr-bg-2/40">
      <div className="mx-auto max-w-6xl xl:px-6">
        <Marquee items={MARQUEE_TITLES} />
      </div>
    </div>
  </section>
);
