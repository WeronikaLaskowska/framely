import { useMutation } from "@tanstack/react-query";
import { posterGameApi } from "@/api/poster-game-api";

export const useStartPosterGameMutation = () =>
  useMutation({ mutationFn: () => posterGameApi.start() });

export const useSubmitPosterGuessMutation = () =>
  useMutation({
    mutationFn: ({ token, movieId }: { token: string; movieId: number }) =>
      posterGameApi.guess(token, movieId),
  });

export const useRevealPosterMutation = () =>
  useMutation({ mutationFn: (token: string) => posterGameApi.reveal(token) });
