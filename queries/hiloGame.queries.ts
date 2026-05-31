import { useQuery } from "@tanstack/react-query";
import { hiloGameApi } from "@/api/hilo-game-api";
import { queryKeys } from "@/queries/queryKeys";

/**
 * Loads a shuffled deck of well-known films for Higher or Lower. Disabled until
 * the player has chosen a metric; `refetch()` powers the mid-run deck top-up.
 */
export const useHiloDeckQuery = (enabled: boolean) =>
  useQuery({
    queryKey: queryKeys.hiloGame.deck(),
    queryFn: () => hiloGameApi.deck().then((res) => res.deck),
    enabled,
    gcTime: 0,
    staleTime: 0,
  });
