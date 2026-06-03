"use client";

import { useReviewGame } from "@/features/games/review/hooks/useReviewGame";
import { plural } from "@/lib/format";
import { QueryWrapper } from "@/common/ui/QueryWrapper";
import { ErrorState } from "@/common/ui/ErrorState";
import { MovieSearch } from "@/features/games/components/MovieSearch";
import { ResultBanner } from "@/features/games/components/ResultBanner";
import { GameTopBar } from "@/features/games/components/GameTopBar";
import { GuessesLeft } from "@/features/games/components/GuessesLeft";
import { GiveUpButton } from "@/features/games/components/GiveUpButton";
import { ReviewGameHeader } from "@/features/games/review/components/ReviewGameHeader";
import { ReviewClueCard } from "@/features/games/review/components/ReviewClueCard";

export const ReviewGameScreen = () => {
  const game = useReviewGame();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-8 sm:py-10">
      <GameTopBar
        backHref="/games"
        right={game.status === "playing" && <GuessesLeft count={game.attemptsLeft} />}
      />

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
              <ErrorState variant="inline" message={game.error} />
              <GiveUpButton onClick={game.giveUp} />
            </div>
          ) : (
            game.target && (
              <ResultBanner
                won={game.status === "won"}
                target={game.target}
                detail={
                  game.status === "won"
                    ? `Solved with ${game.wrong} ${plural(game.wrong, "miss", "misses")}`
                    : undefined
                }
                points={game.awardedPoints}
                onPlayAgain={game.start}
              />
            )
          )}
        </div>
      </QueryWrapper>
    </main>
  );
};
