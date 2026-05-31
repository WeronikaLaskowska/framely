/** Models for the Higher or Lower streak game. */

/** Which stat the Higher or Lower game compares. */
export type HiloMetric = "box-office" | "rating";

/** A single card in the Higher or Lower deck — carries both comparable stats. */
export type HiloCard = {
  id: number;
  title: string;
  year: number | null;
  posterPath: string | null;
  revenue: number;
  rating: number;
};
