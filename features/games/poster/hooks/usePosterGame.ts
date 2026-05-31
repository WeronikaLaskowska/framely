import { useCallback, useState } from "react";
import type { Difficulty } from "@/models/poster";
import type { MovieFacts, MovieLite } from "@/models/movie";
import { tmdbImage } from "@/lib/format";
import { DIFFICULTY, shuffledIndices } from "@/features/games/poster/data/difficulty";
import {
  useRevealPosterMutation,
  useStartPosterGameMutation,
  useSubmitPosterGuessMutation,
} from "@/queries/posterGame.queries";

export type PosterGameStatus = "select" | "loading" | "playing" | "won" | "lost" | "error";

/**
 * Drives a poster-reveal round: loads a hidden poster, tracks wrong guesses
 * (which clear more tiles) and reveals the answer on a win or give-up.
 */
export const usePosterGame = () => {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [status, setStatus] = useState<PosterGameStatus>("select");
  const [token, setToken] = useState<string | null>(null);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [order, setOrder] = useState<number[]>([]);
  const [wrong, setWrong] = useState(0);
  const [guessedIds, setGuessedIds] = useState<number[]>([]);
  const [target, setTarget] = useState<MovieFacts | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { mutateAsync: startReq } = useStartPosterGameMutation();
  const { mutateAsync: guessReq } = useSubmitPosterGuessMutation();
  const { mutateAsync: revealReq } = useRevealPosterMutation();

  const cfg = difficulty ? DIFFICULTY[difficulty] : null;

  const reveal = useCallback(
    async (activeToken: string) => {
      try {
        const { target: revealed } = await revealReq(activeToken);
        setTarget(revealed);
        setStatus("lost");
      } catch {
        /* ignore */
      }
    },
    [revealReq],
  );

  const start = useCallback(
    async (diff: Difficulty) => {
      setDifficulty(diff);
      setStatus("loading");
      setError(null);
      setWrong(0);
      setGuessedIds([]);
      setTarget(null);
      try {
        const { token: fresh, posterPath } = await startReq();
        const url = tmdbImage(posterPath, "w500");
        if (!url) throw new Error("This movie has no poster — try again.");
        const conf = DIFFICULTY[diff];
        setToken(fresh);
        setPosterUrl(url);
        setOrder(shuffledIndices(conf.cols * conf.rows));
        setStatus("playing");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not start game");
        setStatus("error");
      }
    },
    [startReq],
  );

  const submitGuess = useCallback(
    async (movie: MovieLite) => {
      if (!token || !cfg || submitting || status !== "playing") return;
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
          if (nextWrong >= cfg.attempts) await reveal(token);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Guess failed");
      } finally {
        setSubmitting(false);
      }
    },
    [token, cfg, submitting, status, guessedIds, wrong, guessReq, reveal],
  );

  const giveUp = useCallback(() => {
    if (token) reveal(token);
  }, [token, reveal]);

  const replay = useCallback(() => {
    if (difficulty) start(difficulty);
  }, [difficulty, start]);

  const backToSelect = useCallback(() => {
    setStatus("select");
    setDifficulty(null);
    setPosterUrl(null);
    setToken(null);
  }, []);

  return {
    status,
    posterUrl,
    order,
    wrong,
    guessedIds,
    target,
    error,
    submitting,
    cfg,
    ended: status === "won" || status === "lost",
    attemptsLeft: cfg ? cfg.attempts - wrong : 0,
    revealedCount: cfg ? cfg.initialReveal + wrong * cfg.perGuess : 0,
    start,
    submitGuess,
    giveUp,
    replay,
    backToSelect,
  };
};
