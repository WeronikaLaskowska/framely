import { useMutation } from "@tanstack/react-query";
import { guessGameApi } from "@/api/guess-game-api";
import type { HintType } from "@/models/hint";

export const useStartGuessGameMutation = (genre?: number) =>
  useMutation({ mutationFn: () => guessGameApi.start(genre) });

export const useSubmitGuessMutation = () =>
  useMutation({
    mutationFn: ({ token, movieId }: { token: string; movieId: number }) =>
      guessGameApi.guess(token, movieId),
  });

export const useRevealTargetMutation = () =>
  useMutation({ mutationFn: (token: string) => guessGameApi.reveal(token) });

export const useRevealHintMutation = () =>
  useMutation({
    mutationFn: ({ token, type }: { token: string; type: HintType }) =>
      guessGameApi.hint(token, type),
  });
