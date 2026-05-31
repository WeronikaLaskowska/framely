import { GameHeader } from "@/features/games/components/GameHeader";
import { EmberText } from "@/common/typography/EmberText";

export const CastleGameHeader = () => (
  <GameHeader
    title={
      <>
        Name the <EmberText>cast</EmberText>
      </>
    }
    blurb={
      <>
        Only the faces are showing — the title is a secret. Each wrong guess
        reveals a more famous co-star. Name the film.
      </>
    }
  />
);
