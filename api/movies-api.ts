import { apiGet } from "@/api/client";
import type { MovieLite } from "@/models/movie";

type SearchResponse = { results: MovieLite[] };

export const moviesApi = {
  search: (
    query: string,
    genre: number | undefined,
    signal?: AbortSignal,
  ): Promise<SearchResponse> => {
    const params = new URLSearchParams({ q: query });
    if (genre) params.set("genre", String(genre));
    return apiGet<SearchResponse>(`/api/movies/search?${params}`, { signal });
  },
};
