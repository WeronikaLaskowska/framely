"use client";

import { usePosterGame } from "@/features/games/poster/hooks/usePosterGame";
import { plural } from "@/lib/format";
import { Button } from "@/common/ui/Button";
import { QueryWrapper } from "@/common/ui/QueryWrapper";
import { ErrorState } from "@/common/ui/ErrorState";
import { Caption } from "@/common/typography/Caption";
import { MovieSearch } from "@/features/games/components/MovieSearch";
import { ResultBanner } from "@/features/games/components/ResultBanner";
import { GameTopBar } from "@/features/games/components/GameTopBar";
import { GuessesLeft } from "@/features/games/components/GuessesLeft";
import { GiveUpButton } from "@/features/games/components/GiveUpButton";
import { PosterGameHeader } from "@/features/games/poster/components/PosterGameHeader";
import { PosterDifficultyPicker } from "@/features/games/poster/components/PosterDifficultyPicker";
import { PosterBoard } from "@/features/games/poster/components/PosterBoard";

export const PosterGameScreen = () => {
  const game = usePosterGame();
  const { cfg } = game;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-8 sm:py-10">
      <GameTopBar
        backHref="/games"
        right={game.status === "playing" && <GuessesLeft count={game.attemptsLeft} />}
      />

      <PosterGameHeader />

      {game.status === "select" ? (
        <PosterDifficultyPicker onSelect={game.start} />
      ) : (
        <QueryWrapper
          isLoading={game.status === "loading"}
          error={game.status === "error" ? (game.error ?? "Could not start game") : null}
          onRetry={game.backToSelect}
          retryLabel="Back"
          loadingMessage="Loading a poster…"
        >
          {cfg && game.posterUrl && (
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
                  <ErrorState variant="inline" message={game.error} />
                  {game.guessedIds.length > 0 && <Caption>{game.wrong} wrong so far</Caption>}
                  <GiveUpButton onClick={game.giveUp} />
                </div>
              ) : (
                game.target && (
                  <div className="w-full">
                    <ResultBanner
                      won={game.status === "won"}
                      target={game.target}
                      detail={
                        game.status === "won"
                          ? `Solved with ${game.wrong} ${plural(game.wrong, "miss", "misses")}`
                          : undefined
                      }
                      points={game.awardedPoints}
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
        </QueryWrapper>
      )}
    </main>
  );
};
