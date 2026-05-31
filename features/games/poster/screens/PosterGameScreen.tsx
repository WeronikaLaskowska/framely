"use client";

import { usePosterGame } from "@/features/games/poster/hooks/usePosterGame";
import { BackLink } from "@/common/ui/BackLink";
import { Button } from "@/common/ui/Button";
import { LoadingState } from "@/common/ui/LoadingState";
import { ErrorState } from "@/common/ui/ErrorState";
import { Counter } from "@/common/typography/Counter";
import { MovieSearch } from "@/features/games/components/MovieSearch";
import { ResultBanner } from "@/features/games/components/ResultBanner";
import { PosterGameHeader } from "@/features/games/poster/components/PosterGameHeader";
import { PosterDifficultyPicker } from "@/features/games/poster/components/PosterDifficultyPicker";
import { PosterBoard } from "@/features/games/poster/components/PosterBoard";

export const PosterGameScreen = () => {
  const game = usePosterGame();
  const { cfg } = game;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10">
      <div className="flex items-center justify-between">
        <BackLink href="/games" label="Games" />
        {game.status === "playing" && (
          <Counter>
            {game.attemptsLeft} {game.attemptsLeft === 1 ? "guess" : "guesses"} left
          </Counter>
        )}
      </div>

      <PosterGameHeader />

      {game.status === "select" && <PosterDifficultyPicker onSelect={game.start} />}
      {game.status === "loading" && <LoadingState message="Loading a poster…" />}
      {game.status === "error" && (
        <ErrorState
          message={game.error ?? "Could not start game"}
          onRetry={game.backToSelect}
          retryLabel="Back"
        />
      )}

      {(game.status === "playing" || game.ended) && cfg && game.posterUrl && (
        <div className="mt-8 flex flex-col items-center gap-6">
          <PosterBoard
            posterUrl={game.posterUrl}
            cols={cfg.cols}
            rows={cfg.rows}
            order={game.order}
            revealedCount={game.revealedCount}
            fullyRevealed={game.ended}
          />

          {!game.ended ? (
            <div className="flex w-full max-w-md flex-col gap-3">
              <MovieSearch
                onSelect={game.submitGuess}
                disabled={game.submitting}
                excludeIds={game.guessedIds}
                placeholder="Name this movie…"
              />
              {game.error && <span className="text-sm text-fr-close">{game.error}</span>}
              {game.guessedIds.length > 0 && (
                <p className="text-center text-xs uppercase tracking-widest text-fr-fg-subtle">
                  {game.wrong} wrong so far
                </p>
              )}
              <button
                type="button"
                onClick={game.giveUp}
                className="mx-auto text-xs uppercase tracking-widest text-fr-fg-subtle transition-colors hover:text-fr-close"
              >
                Give up
              </button>
            </div>
          ) : (
            game.target && (
              <div className="w-full">
                <ResultBanner
                  won={game.status === "won"}
                  target={game.target}
                  detail={
                    game.status === "won"
                      ? `Solved with ${game.wrong} ${game.wrong === 1 ? "miss" : "misses"}`
                      : undefined
                  }
                  onPlayAgain={game.replay}
                />
                <Button
                  variant="ghost"
                  onClick={game.backToSelect}
                  className="mt-3 w-full px-5 py-2.5 text-sm"
                >
                  Change difficulty
                </Button>
              </div>
            )
          )}
        </div>
      )}
    </main>
  );
};
