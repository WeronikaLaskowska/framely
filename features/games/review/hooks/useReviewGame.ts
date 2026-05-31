import { useCallback, useEffect, useState } from "react";
import type { MovieFacts, MovieLite } from "@/models/movie";
import type { ReviewClue } from "@/models/review";
import { awardWin } from "@/features/score/award";
import {
  useRevealReviewMutation,
  useStartReviewGameMutation,
  useSubmitReviewGuessMutation,
} from "@/queries/reviewGame.queries";

export const MAX_GUESSES = 6;

export type ReviewGameStatus = "loading" | "playing" | "won" | "lost" | "error";

/**
 * Drives a guess-from-a-review round: loads a hidden film with its title-redacted
 * reviews, reveals an extra review on each wrong guess and shows the answer on a
 * win or give-up.
 */
export const useReviewGame = () => {
  const [token, setToken] = useState<string | null>(null);
  const [clues, setClues] = useState<ReviewClue[]>([]);
  const [status, setStatus] = useState<ReviewGameStatus>("loading");
  const [wrong, setWrong] = useState(0);
  const [guessedIds, setGuessedIds] = useState<number[]>([]);
  const [target, setTarget] = useState<MovieFacts | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [awardedPoints, setAwardedPoints] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { mutateAsync: startReq } = useStartReviewGameMutation();
  const { mutateAsync: guessReq } = useSubmitReviewGuessMutation();
  const { mutateAsync: revealReq } = useRevealReviewMutation();

  const reveal = useCallback(
    async (activeToken: string) => {
      try {
        const { target: revealed } = await revealReq(activeToken);
        setTarget(revealed);
        setStatus("lost");
      } catch {
        /* ignore — leave the round playable */
      }
    },
    [revealReq],
  );

  const start = useCallback(async () => {
    setStatus("loading");
    setError(null);
    setWrong(0);
    setGuessedIds([]);
    setTarget(null);
    setClues([]);
    setAwardedPoints(null);
    try {
      const { token: fresh, clues: freshClues } = await startReq();
      setToken(fresh);
      setClues(freshClues);
      setStatus("playing");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start game");
      setStatus("error");
    }
  }, [startReq]);

  // Draw the first reviewed film when the round mounts — genuine async server
  // work, not derivable render state.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async game bootstrap, not derived state
    start();
  }, [start]);

  const submitGuess = useCallback(
    async (movie: MovieLite) => {
      if (!token || submitting || status !== "playing") return;
      if (guessedIds.includes(movie.id)) return;
      setSubmitting(true);
      setError(null);
      try {
        const { correct, target: solved } = await guessReq({ token, movieId: movie.id });
        setGuessedIds((prev) => [movie.id, ...prev]);
        if (correct) {
          setTarget(solved);
          setStatus("won");
          setAwardedPoints(awardWin(MAX_GUESSES - wrong, MAX_GUESSES));
        } else {
          const nextWrong = wrong + 1;
          setWrong(nextWrong);
          if (nextWrong >= MAX_GUESSES) await reveal(token);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Guess failed");
      } finally {
        setSubmitting(false);
      }
    },
    [token, submitting, status, guessedIds, wrong, guessReq, reveal],
  );

  const giveUp = useCallback(() => {
    if (token) reveal(token);
  }, [token, reveal]);

  // One review is shown to start; each wrong guess uncovers the next, capped by
  // however many usable reviews the film actually had.
  const revealedCount = Math.min(1 + wrong, clues.length);

  return {
    status,
    clues,
    target,
    error,
    awardedPoints,
    submitting,
    guessedIds,
    wrong,
    ended: status === "won" || status === "lost",
    attemptsLeft: MAX_GUESSES - wrong,
    revealedClues: clues.slice(0, revealedCount),
    moreCluesLeft: revealedCount < clues.length,
    start,
    submitGuess,
    giveUp,
  };
};
