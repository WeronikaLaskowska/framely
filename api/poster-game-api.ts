import { apiPost } from "@/api/client";
import type { MovieFacts } from "@/models/movie";

type StartResponse = { token: string; posterPath: string | null };
type GuessResponse = { correct: boolean; target: MovieFacts | null };

export const posterGameApi = {
  start: (): Promise<StartResponse> =>
    apiPost<StartResponse>("/api/games/poster/start"),

  guess: (token: string, movieId: number): Promise<GuessResponse> =>
    apiPost<GuessResponse>("/api/games/poster/guess", { token, movieId }),

  reveal: (token: string): Promise<GuessResponse> =>
    apiPost<GuessResponse>("/api/games/poster/guess", { token, reveal: true }),
};
