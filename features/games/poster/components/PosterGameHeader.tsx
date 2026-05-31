import { GameHeader } from "@/features/games/components/GameHeader";
import { EmberText } from "@/common/typography/EmberText";

export const PosterGameHeader = () => (
  <GameHeader
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
