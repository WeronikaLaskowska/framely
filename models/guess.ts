import type { MovieFacts } from "@/models/movie";

export type Verdict = "correct" | "close" | "wrong";

export type Direction = "up" | "down" | null;

export type AttributeResult = {
  verdict: Verdict;
  direction?: Direction;
  display: string;
  sub?: string;
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
