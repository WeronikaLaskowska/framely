import { useMutation } from "@tanstack/react-query";
import { reviewGameApi } from "@/api/review-game-api";

export const useStartReviewGameMutation = () =>
  useMutation({ mutationFn: () => reviewGameApi.start() });

export const useSubmitReviewGuessMutation = () =>
  useMutation({
    mutationFn: ({ token, movieId }: { token: string; movieId: number }) =>
      reviewGameApi.guess(token, movieId),
  });

export const useRevealReviewMutation = () =>
  useMutation({ mutationFn: (token: string) => reviewGameApi.reveal(token) });
