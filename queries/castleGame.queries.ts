import { useMutation } from "@tanstack/react-query";
import { castleGameApi } from "@/api/castle-game-api";

export const useStartCastleGameMutation = () =>
  useMutation({ mutationFn: () => castleGameApi.start() });

export const useSubmitCastleGuessMutation = () =>
  useMutation({
    mutationFn: ({ token, movieId }: { token: string; movieId: number }) =>
      castleGameApi.guess(token, movieId),
  });

export const useRevealCastleMutation = () =>
  useMutation({ mutationFn: (token: string) => castleGameApi.reveal(token) });
