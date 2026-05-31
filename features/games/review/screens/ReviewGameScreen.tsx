"use client";

import { useReviewGame } from "@/features/games/review/hooks/useReviewGame";
import { BackLink } from "@/common/ui/BackLink";
import { Counter } from "@/common/typography/Counter";
import { QueryWrapper } from "@/common/ui/QueryWrapper";
import { MovieSearch } from "@/features/games/components/MovieSearch";
import { ResultBanner } from "@/features/games/components/ResultBanner";
import { ReviewGameHeader } from "@/features/games/review/components/ReviewGameHeader";
import { ReviewClueCard } from "@/features/games/review/components/ReviewClueCard";

export const ReviewGameScreen = () => {
  const game = useReviewGame();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-8 sm:py-10">
      <div className="flex items-center justify-between gap-4">
        <BackLink href="/games" label="Games" />
        {game.status === "playing" && (
          <Counter>
            {game.attemptsLeft} {game.attemptsLeft === 1 ? "guess" : "guesses"} left
          </Counter>
        )}
      </div>

      <ReviewGameHeader />

      <QueryWrapper
        isLoading={game.status === "loading"}
        error={game.status === "error" ? (game.error ?? "Could not start game") : null}
        onRetry={game.start}
        loadingMessage="Pulling up the reviews…"
      >
        <div className="mt-8 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            {game.revealedClues.map((clue, i) => (
              <ReviewClueCard key={clue.id} clue={clue} index={i} />
            ))}
          </div>

          {!game.ended ? (
            <div className="flex flex-col gap-3">
              <MovieSearch
                onSelect={game.submitGuess}
                disabled={game.submitting}
                excludeIds={game.guessedIds}
                placeholder="Name the reviewed film…"
              />
              {game.error && <span className="text-sm text-fr-close">{game.error}</span>}
              {game.moreCluesLeft && (
                <p className="text-center text-xs uppercase tracking-widest text-fr-fg-subtle">
                  A wrong guess uncovers another review
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
              <ResultBanner
                won={game.status === "won"}
                target={game.target}
                detail={
                  game.status === "won"
                    ? `Solved with ${game.wrong} ${game.wrong === 1 ? "miss" : "misses"}`
                    : undefined
                }
                onPlayAgain={game.start}
              />
            )
          )}
        </div>
      </QueryWrapper>
    </main>
  );
};
