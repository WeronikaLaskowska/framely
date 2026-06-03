import { Check, Lock } from "lucide-react";
import type { PlayerLevel } from "@/features/score/levels";
import { cn } from "@/lib/cn";
import { Counter } from "@/common/typography/Counter";

type ScoreProgressLevelItemProps = {
  level: PlayerLevel;
  total: number;
  current: boolean;
};

export const ScoreProgressLevelItem = ({ level, total, current }: ScoreProgressLevelItemProps) => {
  const unlocked = total >= level.min;
  const ptsNeeded = Math.max(0, level.min - total);

  return (
    <li
      className={cn(
        "flex items-center justify-between gap-3 border-2 px-3 py-2.5",
        current
          ? "border-fr-flame/50 bg-fr-flame/10"
          : unlocked
            ? "border-fr-border bg-fr-surface/40"
            : "border-fr-border bg-fr-surface/20 opacity-80",
      )}
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <span
          className={cn(
            "grid h-7 w-7 shrink-0 place-items-center",
            unlocked ? "text-fr-correct" : "text-fr-fg-subtle",
          )}
        >
          {unlocked ? <Check size={14} /> : <Lock size={14} />}
        </span>
        <span className="min-w-0 truncate text-sm text-fr-fg">
          {level.name}
          {current && (
            <span className="ml-2 text-xs uppercase tracking-widest text-fr-flame">Now</span>
          )}
        </span>
      </span>
      <Counter className="shrink-0 text-fr-fg-subtle">
        {unlocked ? `${level.min} pts` : `${ptsNeeded} to go`}
      </Counter>
    </li>
  );
};
