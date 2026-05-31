import { useMutation } from "@tanstack/react-query";
import { guessGameApi } from "@/api/guess-game-api";
import type { HintType } from "@/models/hint";

/** Draws a fresh secret film and returns a signed game token. */
export const useStartGuessGameMutation = (genre?: number) =>
  useMutation({ mutationFn: () => guessGameApi.start(genre) });

/** Submits a guess and returns the per-attribute comparison. */
export const useSubmitGuessMutation = () =>
  useMutation({
    mutationFn: ({ token, movieId }: { token: string; movieId: number }) =>
      guessGameApi.guess(token, movieId),
  });

/** Reveals the secret film (give up / out of guesses). */
export const useRevealTargetMutation = () =>
  useMutation({ mutationFn: (token: string) => guessGameApi.reveal(token) });

/** Unlocks a single paid hint about the secret film. */
export const useRevealHintMutation = () =>
  useMutation({
    mutationFn: ({ token, type }: { token: string; type: HintType }) =>
      guessGameApi.hint(token, type),
  });
