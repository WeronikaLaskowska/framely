/**
 * Server-only TheMovieDB client.
 *
 * Uses the v3 API key (query-param auth). Never import this from a client
 * component — the key must stay on the server. Constraint for every pick:
 * only movies released in 1980 or later.
 *
 * Server-only: this module reads process.env.TMDB_API_KEY and must never be
 * imported from a client component. It is used exclusively by route handlers.
 */
import type { CastLite, GenreLite, MovieFacts, MovieLite } from "@/lib/types";

const BASE = "https://api.themoviedb.org/3";
const MIN_DATE = "1980-01-01";

function apiKey(): string {
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    throw new Error(
      "TMDB_API_KEY is not set. Copy .env.local.example to .env.local and add your TMDB v3 key.",
    );
  }
  return key;
}

async function tmdb<T>(
  path: string,
  params: Record<string, string | number> = {},
  revalidate = 60 * 60 * 24,
): Promise<T> {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set("api_key", apiKey());
  url.searchParams.set("language", "en-US");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));

  const res = await fetch(url, { next: { revalidate } });
  if (!res.ok) {
    throw new Error(`TMDB ${path} failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

/* ---------------------------------------------------------------- *
 * Raw TMDB response shapes (only the fields we read)
 * ---------------------------------------------------------------- */
type RawMovie = {
  id: number;
  title: string;
  release_date?: string;
  poster_path: string | null;
  backdrop_path?: string | null;
};
type RawDiscover = { page: number; total_pages: number; results: RawMovie[] };
type RawGenres = { genres: GenreLite[] };
type RawPerson = { id: number; name: string; profile_path: string | null };
type RawDetails = RawMovie & {
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

function yearOf(date?: string): number | null {
  if (!date) return null;
  const y = Number(date.slice(0, 4));
  return Number.isFinite(y) ? y : null;
}

function toLite(m: RawMovie): MovieLite {
  return {
    id: m.id,
    title: m.title,
    year: yearOf(m.release_date),
    posterPath: m.poster_path,
  };
}

/* ---------------------------------------------------------------- *
 * Public API
 * ---------------------------------------------------------------- */

/** Genre id → name lookup, cached for a day. */
export async function getGenreMap(): Promise<Map<number, string>> {
  const data = await tmdb<RawGenres>("/genre/movie/list");
  return new Map(data.genres.map((g) => [g.id, g.name]));
}

/**
 * Discover a pool of well-known movies (>= 1980), ordered by popularity.
 * `requirePoster` keeps entries that have artwork (needed by the poster game).
 */
export async function discoverPopular(
  page: number,
  requirePoster = false,
): Promise<MovieLite[]> {
  const data = await tmdb<RawDiscover>("/discover/movie", {
    sort_by: "popularity.desc",
    "primary_release_date.gte": MIN_DATE,
    "vote_count.gte": 800,
    include_adult: "false",
    page,
  });
  let results = data.results;
  if (requirePoster) results = results.filter((m) => m.poster_path);
  return results.map(toLite);
}

/** How many discover pages we sample from (popularity top ~ 2000 titles). */
export const DISCOVER_PAGE_RANGE = 100;

/** Pick one random popular movie id. */
export async function randomPopularMovie(
  requirePoster = false,
): Promise<MovieLite> {
  const page = 1 + Math.floor(Math.random() * DISCOVER_PAGE_RANGE);
  const pool = await discoverPopular(page, requirePoster);
  if (pool.length === 0) {
    // Fallback to the very first page if a sampled page came back empty.
    const fallback = await discoverPopular(1, requirePoster);
    return fallback[Math.floor(Math.random() * fallback.length)];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Minimum worldwide box office for a movie to be eligible as a secret target. */
export const MIN_TARGET_REVENUE = 50_000_000;

/**
 * Pick a secret target id that is both recent enough (>= 1980) and a real
 * box-office title (>= MIN_TARGET_REVENUE) so the answer is never obscure.
 * TMDB's discover endpoint can't filter on revenue, so we sample popular
 * candidates and verify their facts, retrying a few times before falling back.
 */
export async function pickTargetMovieId(maxAttempts = 8): Promise<number> {
  let fallback: number | null = null;
  for (let i = 0; i < maxAttempts; i++) {
    const candidate = await randomPopularMovie(true);
    if (!candidate) continue;
    fallback ??= candidate.id;
    const facts = await getMovieFacts(candidate.id);
    const recent = (facts.year ?? 0) >= 1980;
    if (recent && facts.revenue >= MIN_TARGET_REVENUE) return facts.id;
  }
  if (fallback !== null) return fallback;
  return (await randomPopularMovie(true)).id;
}

/** Search movies by title (>= 1980), for guess autocomplete. */
export async function searchMovies(query: string): Promise<MovieLite[]> {
  if (!query.trim()) return [];
  const data = await tmdb<RawDiscover>(
    "/search/movie",
    { query, include_adult: "false", page: 1 },
    0,
  );
  return data.results
    .map(toLite)
    .filter((m) => m.year !== null && m.year >= 1980)
    .slice(0, 8);
}

/** Full normalized facts for a movie (genres, revenue, rating, studio, cast). */
export async function getMovieFacts(id: number): Promise<MovieFacts> {
  const d = await tmdb<RawDetails>(`/movie/${id}`, {
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
}
