import { useMutation } from "@tanstack/react-query";
import { reviewGameApi } from "@/api/review-game-api";

/** Picks a hidden film and returns its title-redacted reviews plus a token. */
export const useStartReviewGameMutation = () =>
  useMutation({ mutationFn: () => reviewGameApi.start() });

/** Checks a guess against the reviewed film. */
export const useSubmitReviewGuessMutation = () =>
  useMutation({
    mutationFn: ({ token, movieId }: { token: string; movieId: number }) =>
      reviewGameApi.guess(token, movieId),
  });

/** Reveals the hidden film (give up / out of attempts). */
export const useRevealReviewMutation = () =>
  useMutation({ mutationFn: (token: string) => reviewGameApi.reveal(token) });
