import { GameHeader } from "@/features/games/components/GameHeader";
import { EmberText } from "@/common/typography/EmberText";

/** Poster-game title block. */
export const PosterGameHeader = () => (
  <GameHeader
    badge="Reel 02 · Poster"
    title={
      <>
        Name the <EmberText>poster</EmberText>
      </>
    }
    blurb={
      <>
        Each wrong guess clears another fragment of the artwork. Spot it before
        it&apos;s fully exposed.
      </>
    }
  />
);
