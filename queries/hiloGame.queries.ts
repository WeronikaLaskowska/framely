import { useQuery } from "@tanstack/react-query";
import { hiloGameApi } from "@/api/hilo-game-api";
import { queryKeys } from "@/queries/queryKeys";

export const useHiloDeckQuery = (enabled: boolean) =>
  useQuery({
    queryKey: queryKeys.hiloGame.deck(),
    queryFn: () => hiloGameApi.deck().then((res) => res.deck),
    enabled,
    gcTime: 0,
    staleTime: 0,
  });
