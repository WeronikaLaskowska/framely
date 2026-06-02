export type HiloMetric = "box-office" | "rating";

export type HiloCard = {
  id: number;
  title: string;
  year: number | null;
  posterPath: string | null;
  revenue: number;
  rating: number;
};
