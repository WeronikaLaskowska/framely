"use client";

import { useState } from "react";
import {
  HINT_UNLOCK_AT,
  MAX_GUESSES,
  useGuessGame,
} from "@/features/games/guess-movie/hooks/useGuessGame";
import { BackLink } from "@/common/ui/BackLink";
import { QueryWrapper } from "@/common/ui/QueryWrapper";
import { MovieSearch } from "@/features/games/components/MovieSearch";
import { ResultBanner } from "@/features/games/components/ResultBanner";
import { GuessGameHeader } from "@/features/games/guess-movie/components/GuessGameHeader";
import { GuessToolbar } from "@/features/games/guess-movie/components/GuessToolbar";
import { DebugAnswer } from "@/features/games/guess-movie/components/DebugAnswer";
import { GuessGrid } from "@/features/games/guess-movie/components/GuessGrid";
import { HintChip } from "@/features/games/guess-movie/components/HintChip";
import { HintModal } from "@/features/games/guess-movie/components/HintModal";
import { TutorialModal } from "@/features/games/guess-movie/components/TutorialModal";

type GuessGameScreenProps = {
  genre?: number;
  genreName?: string;
  backHref?: string;
};

export const GuessGameScreen = ({
  genre,
  genreName,
  backHref = "/games",
}: GuessGameScreenProps) => {
  const game = useGuessGame(genre);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8 sm:py-10">
      <BackLink href={backHref} label={genreName ? "Genres" : "Games"} />
      <GuessGameHeader genreName={genreName} />

      <QueryWrapper
        isLoading={game.status === "loading"}
        error={game.status === "error" ? (game.error ?? "Could not start game") : null}
        onRetry={game.start}
        loadingMessage="Drawing a secret film…"
      >
        <>
          {!game.ended && (
            <div className="mt-7 flex flex-col gap-3">
              {/* <DebugAnswer title={game.debugTitle} /> */}
              <MovieSearch
                onSelect={game.submitGuess}
                disabled={game.submitting}
                excludeIds={game.guesses.map((g) => g.guess.id)}
                genre={genre}
                placeholder={genreName ? `Guess a ${genreName.toLowerCase()} film…` : "Guess a movie…"}
              />
              <GuessToolbar
                currentGuess={game.currentGuess}
                maxGuesses={MAX_GUESSES}
                hintsUnlocked={game.hintsUnlocked}
                hintUnlockAt={HINT_UNLOCK_AT}
                guessesToUnlock={HINT_UNLOCK_AT - game.guesses.length}
                onTutorial={() => setTutorialOpen(true)}
                onHint={() => setHintOpen(true)}
                onGiveUp={game.giveUp}
              />
              {game.error && <span className="text-sm text-fr-close">{game.error}</span>}
              {game.hints.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {game.hints.map((h) => (
                    <HintChip key={h.type} hint={h} />
                  ))}
                </div>
              )}
            </div>
          )}

          {game.ended && game.target && (
            <div className="mt-7">
              <ResultBanner
                won={game.status === "won"}
                target={game.target}
                detail={
                  game.status === "won"
                    ? `Solved in ${game.guesses.length} ${game.guesses.length === 1 ? "guess" : "guesses"}`
                    : undefined
                }
                onPlayAgain={game.start}
              />
            </div>
          )}

          <div className="mt-8">
            <GuessGrid guesses={game.guesses} />
          </div>

          {game.guesses.length === 0 && !game.ended && (
            <p className="mt-10 text-center text-sm text-fr-fg-subtle">
              Guess your first movie!
            </p>
          )}
        </>
      </QueryWrapper>

      <TutorialModal open={tutorialOpen} onClose={() => setTutorialOpen(false)} />
      <HintModal
        open={hintOpen}
        onClose={() => setHintOpen(false)}
        revealed={game.hints}
        loadingType={game.hintLoading}
        onReveal={game.revealHint}
      />
    </main>
  );
};
