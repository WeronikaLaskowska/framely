/** Core movie domain models shared across every game. */

export type GenreLite = { id: number; name: string };

/** A person (cast member or director) with an optional headshot. */
export type CastLite = { id: number; name: string; profilePath: string | null };

/** A production company with an optional logo. */
export type StudioLite = { id: number; name: string; logoPath: string | null };

/** A search/list result — light, used for autocomplete. */
export type MovieLite = {
  id: number;
  title: string;
  year: number | null;
  posterPath: string | null;
};

/** Full movie facts used by the guess-the-movie game. */
export type MovieFacts = {
  id: number;
  title: string;
  year: number | null;
  posterPath: string | null;
  backdropPath: string | null;
  genres: GenreLite[];
  revenue: number;
  rating: number;
  studio: StudioLite | null;
  cast: CastLite[];
  director: CastLite | null;
  overview: string;
};
