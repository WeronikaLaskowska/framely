import { useMutation } from "@tanstack/react-query";
import { castleGameApi } from "@/api/castle-game-api";

/** Picks a hidden film and returns its reveal-ordered cast plus a token. */
export const useStartCastleGameMutation = () =>
  useMutation({ mutationFn: () => castleGameApi.start() });

/** Checks a guess against the cast's film. */
export const useSubmitCastleGuessMutation = () =>
  useMutation({
    mutationFn: ({ token, movieId }: { token: string; movieId: number }) =>
      castleGameApi.guess(token, movieId),
  });

/** Reveals the hidden film (give up / out of attempts). */
export const useRevealCastleMutation = () =>
  useMutation({ mutationFn: (token: string) => castleGameApi.reveal(token) });
