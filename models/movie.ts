export type GenreLite = { id: number; name: string };

export type CastLite = { id: number; name: string; profilePath: string | null };

export type StudioLite = { id: number; name: string; logoPath: string | null };

export type MovieLite = {
  id: number;
  title: string;
  year: number | null;
  posterPath: string | null;
};

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
