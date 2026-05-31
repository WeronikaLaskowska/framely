"use client";

import { Trophy } from "lucide-react";
import { useHiloGame } from "@/features/games/higher-lower/hooks/useHiloGame";
import { BackLink } from "@/common/ui/BackLink";
import { LoadingState } from "@/common/ui/LoadingState";
import { ErrorState } from "@/common/ui/ErrorState";
import { Counter } from "@/common/typography/Counter";
import { HiloHeader } from "@/features/games/higher-lower/components/HiloHeader";
import { HiloMetricPicker } from "@/features/games/higher-lower/components/HiloMetricPicker";
import { HiloBoard } from "@/features/games/higher-lower/components/HiloBoard";
import { HiloResult } from "@/features/games/higher-lower/components/HiloResult";

export const HiloGameScreen = () => {
  const game = useHiloGame();

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-10">
      <div className="flex items-center justify-between">
        <BackLink href="/games" label="Games" />
        {game.status === "playing" && (
          <div className="flex items-center gap-4">
            <Counter>Streak {game.score}</Counter>
            <Counter className="inline-flex items-center gap-1.5 text-fr-fg-subtle">
              <Trophy size={13} /> {game.best}
            </Counter>
          </div>
        )}
      </div>

      <HiloHeader />

      {game.status === "select" && <HiloMetricPicker onSelect={game.start} />}
      {game.status === "loading" && <LoadingState message="Shuffling the deck…" />}
      {game.status === "error" && (
        <ErrorState message="Could not load deck" onRetry={game.backToSelect} retryLabel="Back" />
      )}

      {game.status === "playing" && game.cfg && game.current && game.next && (
        <HiloBoard
          cfg={game.cfg}
          current={game.current}
          next={game.next}
          revealed={game.revealed}
          lastCorrect={game.lastCorrect}
          onGuess={game.guess}
        />
      )}

      {game.status === "over" && (
        <HiloResult
          score={game.score}
          best={game.best}
          onPlayAgain={game.replay}
          onChangeStat={game.backToSelect}
        />
      )}
    </main>
  );
};
