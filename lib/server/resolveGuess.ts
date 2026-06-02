import type { GuessResult } from "@/models/guess";
import type { MovieFacts } from "@/models/movie";
import { compareFacts } from "@/lib/server/compare";
import { getMovieFacts } from "@/lib/server/tmdbFacts";
import { readTargetToken } from "@/lib/server/token";

export type GuessBody = {
  token?: string;
  movieId?: number;
  reveal?: boolean;
};

/** Runtime-validate an untrusted request body into a {@link GuessBody}. */
export const parseGuessBody = (raw: unknown): GuessBody => {
  const body = (raw ?? {}) as Record<string, unknown>;
  return {
    token: typeof body.token === "string" ? body.token : undefined,
    movieId: typeof body.movieId === "number" ? body.movieId : undefined,
    reveal: typeof body.reveal === "boolean" ? body.reveal : undefined,
  };
};

type Failure = { ok: false; status: number; error: string };
const INVALID_TOKEN: Failure = { ok: false, status: 400, error: "Invalid game token" };
const MISSING_MOVIE_ID: Failure = { ok: false, status: 400, error: "movieId is required" };

type TokenGuessOutcome =
  | { ok: true; correct: boolean; target: MovieFacts | null }
  | Failure;


export const resolveTokenGuess = async ({
  token,
  movieId,
  reveal,
}: GuessBody): Promise<TokenGuessOutcome> => {
  const targetId = token ? readTargetToken(token) : null;
  if (targetId === null) return INVALID_TOKEN;

  if (reveal) {
    return { ok: true, correct: false, target: await getMovieFacts(targetId) };
  }
  if (typeof movieId !== "number") return MISSING_MOVIE_ID;

  const correct = movieId === targetId;
  return { ok: true, correct, target: correct ? await getMovieFacts(targetId) : null };
};

type CompareGuessOutcome =
  | { ok: true; reveal: true; target: MovieFacts }
  | { ok: true; reveal: false; result: GuessResult; target: MovieFacts | null }
  | Failure;


export const resolveCompareGuess = async ({
  token,
  movieId,
  reveal,
}: GuessBody): Promise<CompareGuessOutcome> => {
  const targetId = token ? readTargetToken(token) : null;
  if (targetId === null) return INVALID_TOKEN;

  const target = await getMovieFacts(targetId);
  if (reveal) return { ok: true, reveal: true, target };

  if (typeof movieId !== "number") return MISSING_MOVIE_ID;

  const result = compareFacts(await getMovieFacts(movieId), target);
  return { ok: true, reveal: false, result, target: result.correct ? target : null };
};
