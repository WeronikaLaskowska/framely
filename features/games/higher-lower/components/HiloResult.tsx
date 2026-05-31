import { RotateCcw } from "lucide-react";
import { Card } from "@/common/ui/Card";
import { Button } from "@/common/ui/Button";
import { Timecode } from "@/common/typography/Timecode";

type HiloResultProps = {
  score: number;
  best: number;
  points?: number | null;
  onPlayAgain: () => void;
  onChangeStat: () => void;
};

export const HiloResult = ({ score, best, points, onPlayAgain, onChangeStat }: HiloResultProps) => (
  <Card className="fr-pop mt-10 p-8 text-center">
    <Timecode className="text-fr-close">Streak ended</Timecode>
    <p className="fr-display mt-3 text-5xl">{score}</p>
    <p className="mt-2 text-sm text-fr-fg-muted">
      {score === best && score > 0 ? "New best streak!" : `Best streak: ${best}`}
    </p>
    {points != null && points > 0 && (
      <span className="mt-3 inline-flex items-center gap-1.5 bg-fr-flame/15 px-3 py-1 text-sm font-semibold text-fr-flame">
        +{points} pts
      </span>
    )}
    <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
      <Button variant="ember" onClick={onPlayAgain} className="cursor-pointer px-6 py-3">
        <RotateCcw size={16} /> Play again
      </Button>
      <Button variant="ghost" onClick={onChangeStat} className="cursor-pointer px-6 py-3">
        Change stat
      </Button>
    </div>
  </Card>
);
