/**
 * Server-only TheMovieDB core client. Holds the v3 key auth, the shared fetch
 * helper, raw response shapes and the discover query that every higher-level
 * module builds on. Never import this from a client component — the key must
 * stay on the server.
 */
import type { GenreLite, MovieLite } from "@/models/movie";

export const BASE = "https://api.themoviedb.org/3";
export const MIN_DATE = "1980-01-01";

/**
 * Familiarity floor for the movie pool. `vote_count` is the best proxy for how
 * widely seen a film is — raising it trims obscure titles. Genre pools are
 * naturally smaller, so they use a lower floor to keep enough variety.
 */
export const MIN_VOTE_COUNT = 2500;
export const GENRE_MIN_VOTE_COUNT = 1000;

/** How many top-popularity discover pages we sample from (~20 titles/page). */
export const DISCOVER_PAGE_RANGE = 40;

/** Minimum worldwide box office for a movie to be eligible as a secret target. */
export const MIN_TARGET_REVENUE = 50_000_000;

const apiKey = (): string => {
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    throw new Error(
      "TMDB_API_KEY is not set. Copy .env.local.example to .env.local and add your TMDB v3 key.",
    );
  }
  return key;
};

export const tmdbFetch = async <T>(
  path: string,
  params: Record<string, string | number> = {},
  revalidate = 60 * 60 * 24,
): Promise<T> => {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set("api_key", apiKey());
  url.searchParams.set("language", "en-US");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));

  const res = await fetch(url, { next: { revalidate } });
  if (!res.ok) {
    throw new Error(`TMDB ${path} failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
};

/* Raw TMDB response shapes (only the fields we read). */
export type RawMovie = {
  id: number;
  title: string;
  release_date?: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  popularity?: number;
  genre_ids?: number[];
};
export type RawDiscover = { page: number; total_pages: number; results: RawMovie[] };
type RawGenres = { genres: GenreLite[] };
export type RawPerson = { id: number; name: string; profile_path: string | null };
export type RawDetails = RawMovie & {
  genres: GenreLite[];
  revenue: number;
  vote_average: number;
  overview: string;
  production_companies: { id: number; name: string; logo_path: string | null }[];
  credits?: {
    cast: (RawPerson & { order: number })[];
    crew: (RawPerson & { job: string })[];
  };
};

export const yearOf = (date?: string): number | null => {
  if (!date) return null;
  const y = Number(date.slice(0, 4));
  return Number.isFinite(y) ? y : null;
};

export const toLite = (m: RawMovie): MovieLite => ({
  id: m.id,
  title: m.title,
  year: yearOf(m.release_date),
  posterPath: m.poster_path,
});

/** Genre id → name lookup, cached for a day. */
export const getGenreMap = async (): Promise<Map<number, string>> => {
  const data = await tmdbFetch<RawGenres>("/genre/movie/list");
  return new Map(data.genres.map((g) => [g.id, g.name]));
};

/** Raw discover query for well-known movies (>= 1980), optionally by genre. */
export const rawDiscover = (page: number, genre?: number): Promise<RawDiscover> => {
  const params: Record<string, string | number> = {
    sort_by: "popularity.desc",
    "primary_release_date.gte": MIN_DATE,
    "vote_count.gte": genre ? GENRE_MIN_VOTE_COUNT : MIN_VOTE_COUNT,
    include_adult: "false",
    page,
  };
  if (genre) params.with_genres = genre;
  return tmdbFetch<RawDiscover>("/discover/movie", params);
};
