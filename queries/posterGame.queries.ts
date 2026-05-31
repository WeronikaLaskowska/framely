import { useMutation } from "@tanstack/react-query";
import { posterGameApi } from "@/api/poster-game-api";

/** Picks a hidden poster and returns its path plus a signed token. */
export const useStartPosterGameMutation = () =>
  useMutation({ mutationFn: () => posterGameApi.start() });

/** Checks a poster guess against the hidden film. */
export const useSubmitPosterGuessMutation = () =>
  useMutation({
    mutationFn: ({ token, movieId }: { token: string; movieId: number }) =>
      posterGameApi.guess(token, movieId),
  });

/** Reveals the hidden film (give up / out of attempts). */
export const useRevealPosterMutation = () =>
  useMutation({ mutationFn: (token: string) => posterGameApi.reveal(token) });
