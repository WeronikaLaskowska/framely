/** Shared types for the Framely movie games. */

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
  revenue: number; // USD, 0 when unknown
  rating: number; // vote_average 0–10
  studio: StudioLite | null; // primary production company
  cast: CastLite[]; // top billed
  director: CastLite | null;
  overview: string;
};

/** Difficulty tiers for the poster game. */
export type Difficulty = "easy" | "medium" | "hard";

/** Which stat the Higher or Lower game compares. */
export type HiloMetric = "box-office" | "rating";

/** A single card in the Higher or Lower deck — carries both comparable stats. */
export type HiloCard = {
  id: number;
  title: string;
  year: number | null;
  posterPath: string | null;
  revenue: number; // USD
  rating: number; // vote_average 0–10
};

/** Paid hints the player can unlock in the guess game. */
export type HintType = "cast" | "decade" | "studio";

export type Hint = {
  type: HintType;
  /** Short caption, e.g. "Cast member". */
  label: string;
  /** The revealed value, e.g. "Eddie Murphy" or "2000s". */
  value: string;
  /** Optional TMDB image path (cast headshot or studio logo) for display. */
  imagePath?: string | null;
};

/** Comparison verdict for a single attribute. */
export type Verdict = "correct" | "close" | "wrong";

export type Direction = "up" | "down" | null;

export type AttributeResult = {
  verdict: Verdict;
  /** Hint arrow for numeric attributes: target is higher (up) / lower (down). */
  direction?: Direction;
  /** Human label rendered inside the tile. */
  display: string;
  /** Optional sub-text (e.g. shared actors count). */
  sub?: string;
  /** For cast: ids of the guess's people that also appear in the target. */
  matchedIds?: number[];
};

export type GuessResult = {
  guess: MovieFacts;
  correct: boolean;
  attributes: {
    genre: AttributeResult;
    year: AttributeResult;
    revenue: AttributeResult;
    rating: AttributeResult;
    studio: AttributeResult;
    cast: AttributeResult;
    director: AttributeResult;
  };
};
