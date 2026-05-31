import { GameHeader } from "@/features/games/components/GameHeader";
import { EmberText } from "@/common/typography/EmberText";

export const ReviewGameHeader = () => (
  <GameHeader
    title={
      <>
        Guess from the <EmberText>review</EmberText>
      </>
    }
    blurb={
      <>
        Real audience reviews, with the title blacked out. Read the verdict and
        name the film — each wrong guess uncovers another review.
      </>
    }
  />
);
