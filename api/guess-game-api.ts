/** Pure HTTP for the guess-the-movie (Spotle) game. */
import { apiPost } from "@/api/client";
import type { GuessResult } from "@/models/guess";
import type { Hint, HintType } from "@/models/hint";
import type { MovieFacts } from "@/models/movie";

type StartResponse = { token: string };
type GuessResponse = { result: GuessResult; target: MovieFacts | null };
type RevealResponse = { target: MovieFacts };
type HintResponse = { hint: Hint };

export const guessGameApi = {
  start: (genre?: number): Promise<StartResponse> =>
    apiPost<StartResponse>("/api/games/guess/start", genre ? { genre } : {}),

  guess: (token: string, movieId: number): Promise<GuessResponse> =>
    apiPost<GuessResponse>("/api/games/guess", { token, movieId }),

  reveal: (token: string): Promise<RevealResponse> =>
    apiPost<RevealResponse>("/api/games/guess", { token, reveal: true }),

  hint: (token: string, type: HintType): Promise<HintResponse> =>
    apiPost<HintResponse>("/api/games/guess/hint", { token, type }),
};
