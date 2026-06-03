"use client";

import { Award } from "lucide-react";
import { LEVELS } from "@/features/score/levels";
import { plural } from "@/lib/format";
import { usePlayerScore } from "@/features/score/usePlayerScore";
import { Modal } from "@/common/ui/Modal";
import { Counter } from "@/common/typography/Counter";
import { Timecode } from "@/common/typography/Timecode";
import { ScoreProgressLevelItem } from "@/features/score/components/ScoreProgressLevelItem";
import { ScoreEarningHint } from "@/features/score/components/ScoreEarningHint";

type ScoreProgressModalProps = {
  open: boolean;
  onClose: () => void;
};

export const ScoreProgressModal = ({ open, onClose }: ScoreProgressModalProps) => {
  const { total, wins, rank } = usePlayerScore();

  return (
    <Modal open={open} onClose={onClose} title="Your progress" icon={<Award size={16} />}>
      <div className="flex flex-col gap-6">
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <p className="fr-display text-2xl">{rank.level.name}</p>
            <Counter className="text-fr-fg-muted">{total} pts</Counter>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden bg-fr-surface">
            <div
              className="h-full bg-fr-flame transition-[width] duration-500"
              style={{ width: `${Math.round(rank.progress * 100)}%` }}
            />
          </div>
          <Timecode className="mt-2 block text-fr-fg-subtle">
            {rank.next
              ? `${rank.pointsToNext} pts to ${rank.next.name}`
              : "Top rank reached"}{" "}
            · {wins} {plural(wins, "win")}
          </Timecode>
        </div>

        <div>
          <Timecode className="mb-3 block text-fr-flame">Ranks to unlock</Timecode>
          <ul className="flex flex-col gap-2">
            {LEVELS.map((level, i) => (
              <ScoreProgressLevelItem
                key={level.name}
                level={level}
                total={total}
                current={rank.index === i}
              />
            ))}
          </ul>
        </div>

        <ScoreEarningHint />
      </div>
    </Modal>
  );
};
