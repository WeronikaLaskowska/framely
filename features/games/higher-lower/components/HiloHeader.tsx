import { GameHeader } from "@/features/games/components/GameHeader";
import { EmberText } from "@/common/typography/EmberText";

export const HiloHeader = () => (
  <GameHeader
    title={
      <>
        Higher or <EmberText>lower</EmberText>
      </>
    }
  />
);
