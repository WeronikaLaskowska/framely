/** Server-only: full normalized facts for a single movie. */
import type { CastLite, MovieFacts } from "@/models/movie";
import { type RawDetails, tmdbFetch, yearOf } from "@/lib/server/tmdbClient";

/** Genres, revenue, rating, studio, top-billed cast and director for a movie. */
export const getMovieFacts = async (id: number): Promise<MovieFacts> => {
  const d = await tmdbFetch<RawDetails>(`/movie/${id}`, {
    append_to_response: "credits",
  });
  const cast: CastLite[] = (d.credits?.cast ?? [])
    .sort((a, b) => a.order - b.order)
    .slice(0, 5)
    .map((c) => ({ id: c.id, name: c.name, profilePath: c.profile_path }));
  const directorRaw = (d.credits?.crew ?? []).find((c) => c.job === "Director");
  const director: CastLite | null = directorRaw
    ? { id: directorRaw.id, name: directorRaw.name, profilePath: directorRaw.profile_path }
    : null;
  const company = d.production_companies?.[0];
  const studio = company
    ? { id: company.id, name: company.name, logoPath: company.logo_path ?? null }
    : null;
  return {
    id: d.id,
    title: d.title,
    year: yearOf(d.release_date),
    posterPath: d.poster_path,
    backdropPath: d.backdrop_path ?? null,
    genres: d.genres ?? [],
    revenue: d.revenue ?? 0,
    rating: d.vote_average ?? 0,
    studio,
    cast,
    director,
    overview: d.overview ?? "",
  };
};
