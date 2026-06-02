import { useQuery } from "@tanstack/react-query";
import { moviesApi } from "@/api/movies-api";
import { queryKeys } from "@/queries/queryKeys";

export const useMovieSearchQuery = (query: string, genre?: number) => {
  const trimmed = query.trim();
  return useQuery({
    queryKey: queryKeys.movies.search(trimmed, genre),
    queryFn: ({ signal }) =>
      moviesApi.search(trimmed, genre, signal).then((res) => res.results),
    enabled: trimmed.length >= 2,
    staleTime: 5 * 60_000,
    placeholderData: (prev) => prev,
  });
};
