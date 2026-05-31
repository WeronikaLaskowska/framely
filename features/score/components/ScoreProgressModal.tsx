"use client";

import { Award, Check, Lock } from "lucide-react";
import { LEVELS } from "@/features/score/levels";
import { usePlayerScore } from "@/features/score/usePlayerScore";
import { Modal } from "@/common/ui/Modal";
import { Counter } from "@/common/typography/Counter";
import { Timecode } from "@/common/typography/Timecode";

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
            · {wins} {wins === 1 ? "win" : "wins"}
          </Timecode>
        </div>

        <div>
          <Timecode className="mb-3 block text-fr-flame">Ranks to unlock</Timecode>
          <ul className="flex flex-col gap-2">
            {LEVELS.map((level, i) => {
              const unlocked = total >= level.min;
              const current = rank.index === i;
              const ptsNeeded = Math.max(0, level.min - total);

              return (
                <li
                  key={level.name}
                  className={`flex items-center justify-between gap-3 border-2 px-3 py-2.5 ${
                    current
                      ? "border-fr-flame/50 bg-fr-flame/10"
                      : unlocked
                        ? "border-fr-border bg-fr-surface/40"
                        : "border-fr-border bg-fr-surface/20 opacity-80"
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center ${
                        unlocked ? "text-fr-correct" : "text-fr-fg-subtle"
                      }`}
                    >
                      {unlocked ? <Check size={14} /> : <Lock size={14} />}
                    </span>
                    <span className="min-w-0 truncate text-sm text-fr-fg">
                      {level.name}
                      {current && (
                        <span className="ml-2 text-xs uppercase tracking-widest text-fr-flame">
                          Now
                        </span>
                      )}
                    </span>
                  </span>
                  <Counter className="shrink-0 text-fr-fg-subtle">
                    {unlocked ? `${level.min} pts` : `${ptsNeeded} to go`}
                  </Counter>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="text-xs leading-relaxed text-fr-fg-subtle">
          Win any game to earn points — fewer guesses left means a bigger reward. Higher or
          Lower pays out from your streak when the run ends.
        </p>
      </div>
    </Modal>
  );
};
