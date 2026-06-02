import { useCallback, useEffect, useState } from "react";
import type { GuessResult } from "@/models/guess";
import type { Hint, HintType } from "@/models/hint";
import type { MovieFacts, MovieLite } from "@/models/movie";
import { awardWin } from "@/features/score/award";
import {
  useRevealHintMutation,
  useRevealTargetMutation,
  useStartGuessGameMutation,
  useSubmitGuessMutation,
} from "@/queries/guessGame.queries";

export const MAX_GUESSES = 8;
export const HINT_UNLOCK_AT = 5;

export type GuessGameStatus = "loading" | "playing" | "won" | "lost" | "error";

export const useGuessGame = (genre?: number) => {
  const [token, setToken] = useState<string | null>(null);
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [status, setStatus] = useState<GuessGameStatus>("loading");
  const [target, setTarget] = useState<MovieFacts | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hints, setHints] = useState<Hint[]>([]);
  const [hintLoading, setHintLoading] = useState<HintType | null>(null);
  const [debugTitle, setDebugTitle] = useState<string | null>(null);
  const [awardedPoints, setAwardedPoints] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { mutateAsync: startGame } = useStartGuessGameMutation(genre);
  const { mutateAsync: submitGuessReq } = useSubmitGuessMutation();
  const { mutateAsync: revealTargetReq } = useRevealTargetMutation();
  const { mutateAsync: revealHintReq } = useRevealHintMutation();

  const reveal = useCallback(
    async (activeToken: string) => {
      try {
        const { target: revealed } = await revealTargetReq(activeToken);
        setTarget(revealed);
        setStatus("lost");
      } catch {
        /* ignore — leave the round playable */
      }
    },
    [revealTargetReq],
  );

  const start = useCallback(async () => {
    setStatus("loading");
    setGuesses([]);
    setTarget(null);
    setError(null);
    setHints([]);
    setDebugTitle(null);
    setAwardedPoints(null);
    try {
      const { token: fresh } = await startGame();
      setToken(fresh);
      setStatus("playing");
      if (process.env.NODE_ENV !== "production") {
        revealTargetReq(fresh)
          .then((d) => setDebugTitle(d.target.title))
          .catch(() => {});
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start game");
      setStatus("error");
    }
  }, [startGame, revealTargetReq]);

  // Draw the first secret film when the round mounts. `start` performs an async
  // network fetch, so this is genuine effect work (synchronising with a server),
  // not derivable render state.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async game bootstrap, not derived state
    start();
  }, [start]);

  const submitGuess = useCallback(
    async (movie: MovieLite) => {
      if (!token || submitting || status !== "playing") return;
      if (guesses.some((g) => g.guess.id === movie.id)) return;
      setSubmitting(true);
      setError(null);
      try {
        const { result, target: solved } = await submitGuessReq({
          token,
          movieId: movie.id,
        });
        const next = [result, ...guesses];
        setGuesses(next);
        if (result.correct) {
          setTarget(solved);
          setStatus("won");
          setAwardedPoints(awardWin(MAX_GUESSES - next.length, MAX_GUESSES));
        } else if (next.length >= MAX_GUESSES) {
          await reveal(token);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Guess failed");
      } finally {
        setSubmitting(false);
      }
    },
    [token, submitting, status, guesses, submitGuessReq, reveal],
  );

  const giveUp = useCallback(() => {
    if (token) reveal(token);
  }, [token, reveal]);

  const revealHint = useCallback(
    async (type: HintType) => {
      if (!token || hintLoading || hints.some((h) => h.type === type)) return;
      setHintLoading(type);
      try {
        const { hint } = await revealHintReq({ token, type });
        setHints((prev) => [...prev, hint]);
      } catch {
        /* ignore */
      } finally {
        setHintLoading(null);
      }
    },
    [token, hintLoading, hints, revealHintReq],
  );

  return {
    status,
    guesses,
    target,
    error,
    hints,
    hintLoading,
    debugTitle,
    awardedPoints,
    submitting,
    ended: status === "won" || status === "lost",
    hintsUnlocked: guesses.length >= HINT_UNLOCK_AT,
    currentGuess: Math.min(guesses.length + 1, MAX_GUESSES),
    start,
    submitGuess,
    giveUp,
    revealHint,
  };
};
