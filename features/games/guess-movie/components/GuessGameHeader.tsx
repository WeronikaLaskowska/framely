import { GameHeader } from "@/features/games/components/GameHeader";
import { EmberText } from "@/common/typography/EmberText";

export const GuessGameHeader = ({ genreName }: { genreName?: string }) => (
  <GameHeader
    badge={genreName ? `Genre · ${genreName}` : undefined}
    title={
      genreName ? (
        <>
          Guess the <EmberText>{genreName.toLowerCase()}</EmberText> film
        </>
      ) : (
        <>
          Guess the <EmberText>movie</EmberText>
        </>
      )
    }
  />
);
