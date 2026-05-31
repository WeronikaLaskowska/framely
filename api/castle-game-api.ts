/** Pure HTTP for the guess-by-cast (Castle) game. */
import { apiPost } from "@/api/client";
import type { CastLite, MovieFacts } from "@/models/movie";

type StartResponse = { token: string; cast: CastLite[] };
type GuessResponse = { correct: boolean; target: MovieFacts | null };

export const castleGameApi = {
  start: (): Promise<StartResponse> =>
    apiPost<StartResponse>("/api/games/castle/start"),

  guess: (token: string, movieId: number): Promise<GuessResponse> =>
    apiPost<GuessResponse>("/api/games/castle/guess", { token, movieId }),

  reveal: (token: string): Promise<GuessResponse> =>
    apiPost<GuessResponse>("/api/games/castle/guess", { token, reveal: true }),
};
