import { useQuery } from "@tanstack/react-query";
import { moviesApi } from "@/api/movies-api";
import { queryKeys } from "@/queries/queryKeys";

/**
 * Autocomplete suggestions for a (debounced) title query, optionally locked to
 * a genre. Disabled until the query has at least two characters so we never
 * flood TMDB with single-letter searches.
 */
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
