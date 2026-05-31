import { GameHeader } from "@/features/games/components/GameHeader";
import { EmberText } from "@/common/typography/EmberText";

/** Higher or Lower title block. */
export const HiloHeader = () => (
  <GameHeader
    title={
      <>
        Higher or <EmberText>lower</EmberText>
      </>
    }
  />
);
