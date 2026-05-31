/** Server-only: shared guess resolution for the token-based "name the film"
 *  games (poster, reviews). Verifies the signed token and returns the secret
 *  film's facts on a correct guess or a reveal. */
import type { MovieFacts } from "@/models/movie";
import { getMovieFacts } from "@/lib/server/tmdbFacts";
import { readTargetToken } from "@/lib/server/token";

type GuessOutcome =
  | { ok: true; correct: boolean; target: MovieFacts | null }
  | { ok: false; status: number; error: string };

export const resolveTokenGuess = async (
  token?: string,
  movieId?: number,
  reveal?: boolean,
): Promise<GuessOutcome> => {
  const targetId = token ? readTargetToken(token) : null;
  if (targetId === null) return { ok: false, status: 400, error: "Invalid game token" };

  if (reveal) {
    return { ok: true, correct: false, target: await getMovieFacts(targetId) };
  }

  if (typeof movieId !== "number") {
    return { ok: false, status: 400, error: "movieId is required" };
  }

  const correct = movieId === targetId;
  return { ok: true, correct, target: correct ? await getMovieFacts(targetId) : null };
};
