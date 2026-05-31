/** Comparison result models for the guess-the-movie (Spotle) game. */
import type { MovieFacts } from "@/models/movie";

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
