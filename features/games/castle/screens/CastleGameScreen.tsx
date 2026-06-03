"use client";

import { useCastleGame } from "@/features/games/castle/hooks/useCastleGame";
import { plural } from "@/lib/format";
import { QueryWrapper } from "@/common/ui/QueryWrapper";
import { ErrorState } from "@/common/ui/ErrorState";
import { Caption } from "@/common/typography/Caption";
import { MovieSearch } from "@/features/games/components/MovieSearch";
import { ResultBanner } from "@/features/games/components/ResultBanner";
import { GameTopBar } from "@/features/games/components/GameTopBar";
import { GuessesLeft } from "@/features/games/components/GuessesLeft";
import { GiveUpButton } from "@/features/games/components/GiveUpButton";
import { CastleGameHeader } from "@/features/games/castle/components/CastleGameHeader";
import { CastleBoard } from "@/features/games/castle/components/CastleBoard";

export const CastleGameScreen = () => {
  const game = useCastleGame();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-8 sm:py-10">
      <GameTopBar
        backHref="/games"
        right={game.status === "playing" && <GuessesLeft count={game.attemptsLeft} />}
      />

      <CastleGameHeader />

      <QueryWrapper
        isLoading={game.status === "loading"}
        error={game.status === "error" ? (game.error ?? "Could not start game") : null}
        onRetry={game.start}
        loadingMessage="Assembling the cast…"
      >
        <div className="mt-8 flex flex-col gap-6">
          <CastleBoard cast={game.cast} revealedCount={game.revealedCount} />

          {!game.ended ? (
            <div className="flex flex-col gap-3">
              <MovieSearch
                onSelect={game.submitGuess}
                disabled={game.submitting}
                excludeIds={game.guessedIds}
                placeholder="Name the film from its cast…"
              />
              <ErrorState variant="inline" message={game.error} />
              {game.moreCastLeft && <Caption>A wrong guess reveals a bigger star</Caption>}
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
