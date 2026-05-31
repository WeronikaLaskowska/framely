import { useCallback, useEffect, useState } from "react";
import type { CastLite, MovieFacts, MovieLite } from "@/models/movie";
import {
  useRevealCastleMutation,
  useStartCastleGameMutation,
  useSubmitCastleGuessMutation,
} from "@/queries/castleGame.queries";

export type CastleGameStatus = "loading" | "playing" | "won" | "lost" | "error";

/**
 * Drives a Castle round: loads a hidden film with its billed cast, reveals one
 * more face on each wrong guess and shows the answer on a win or give-up. The
 * round lasts as long as there are cast members to uncover.
 */
export const useCastleGame = () => {
  const [token, setToken] = useState<string | null>(null);
  const [cast, setCast] = useState<CastLite[]>([]);
  const [status, setStatus] = useState<CastleGameStatus>("loading");
  const [wrong, setWrong] = useState(0);
  const [guessedIds, setGuessedIds] = useState<number[]>([]);
  const [target, setTarget] = useState<MovieFacts | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { mutateAsync: startReq } = useStartCastleGameMutation();
  const { mutateAsync: guessReq } = useSubmitCastleGuessMutation();
  const { mutateAsync: revealReq } = useRevealCastleMutation();

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
    setCast([]);
    try {
      const { token: fresh, cast: freshCast } = await startReq();
      setToken(fresh);
      setCast(freshCast);
      setStatus("playing");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start game");
      setStatus("error");
    }
  }, [startReq]);

  // Draw the first secret film when the round mounts — genuine async server
  // work, not derivable render state.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async game bootstrap, not derived state
    start();
  }, [start]);

  // The round ends once every cast member has been uncovered without a hit.
  const maxGuesses = cast.length;

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
        } else {
          const nextWrong = wrong + 1;
          setWrong(nextWrong);
          if (nextWrong >= maxGuesses) await reveal(token);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Guess failed");
      } finally {
        setSubmitting(false);
      }
    },
    [token, submitting, status, guessedIds, wrong, maxGuesses, guessReq, reveal],
  );

  const giveUp = useCallback(() => {
    if (token) reveal(token);
  }, [token, reveal]);

  // One face is shown to start; each wrong guess uncovers the next.
  const revealedCount = computeRevealedCount(wrong, cast.length, status);

  return {
    status,
    cast,
    target,
    error,
    submitting,
    guessedIds,
    wrong,
    ended: status === "won" || status === "lost",
    attemptsLeft: maxGuesses - wrong,
    revealedCount,
    moreCastLeft: revealedCount < cast.length,
    start,
    submitGuess,
    giveUp,
  };
};

/** When the round is over the whole cast is shown; otherwise 1 + wrong guesses. */
const computeRevealedCount = (
  wrong: number,
  total: number,
  status: CastleGameStatus,
): number => {
  if (status === "won" || status === "lost") return total;
  return Math.min(1 + wrong, total);
};
