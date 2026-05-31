import type { Difficulty } from "@/models/poster";
import { DIFFICULTY, DIFFICULTY_ORDER } from "@/features/games/poster/data/difficulty";
import { GamePicker } from "@/features/games/components/GamePicker";

/** Easy / medium / hard selection grid shown before a poster round. */
export const PosterDifficultyPicker = ({
  onSelect,
}: {
  onSelect: (difficulty: Difficulty) => void;
}) => (
  <GamePicker
    caption="Choose a difficulty"
    columns={3}
    onSelect={onSelect}
    options={DIFFICULTY_ORDER.map((d) => {
      const c = DIFFICULTY[d];
      return { id: d, label: c.label, blurb: c.blurb, footer: `${c.cols}×${c.rows} tiles` };
    })}
  />
);
