import { apiPost } from "@/api/client";
import type { MovieFacts } from "@/models/movie";
import type { ReviewClue } from "@/models/review";

type StartResponse = { token: string; clues: ReviewClue[] };
type GuessResponse = { correct: boolean; target: MovieFacts | null };

export const reviewGameApi = {
  start: (): Promise<StartResponse> =>
    apiPost<StartResponse>("/api/games/review/start"),

  guess: (token: string, movieId: number): Promise<GuessResponse> =>
    apiPost<GuessResponse>("/api/games/review/guess", { token, movieId }),

  reveal: (token: string): Promise<GuessResponse> =>
    apiPost<GuessResponse>("/api/games/review/guess", { token, reveal: true }),
};
