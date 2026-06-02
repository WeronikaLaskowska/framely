"use client";

import { useState } from "react";
import { Trophy } from "lucide-react";
import { usePlayerScore } from "@/features/score/usePlayerScore";
import { ScoreProgressModal } from "@/features/score/components/ScoreProgressModal";

export const ScoreTrigger = () => {
  const [open, setOpen] = useState(false);
  const { total, rank } = usePlayerScore();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Your progress and ranks"
        title={`${rank.level.name} · ${total} pts`}
        className="relative inline-flex h-10 w-10 cursor-pointer items-center justify-center border-2 border-fr-border-strong bg-fr-surface/80 text-fr-fg-muted transition-colors hover:border-fr-flame/50 hover:text-fr-flame"
      >
        <Trophy size={18} />
        {total > 0 && (
          <span className="absolute -right-1 -top-1 min-w-4 bg-fr-flame px-1 text-[9px] font-bold leading-4 text-fr-bg">
            {rank.index + 1}
          </span>
        )}
      </button>

      <ScoreProgressModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};
