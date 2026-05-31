import type { HiloCard, HiloMetric } from "@/models/hilo";
import { formatMoney, formatRating } from "@/lib/format";

export type MetricConfig = {
  key: HiloMetric;
  label: string;
  blurb: string;
  /** Pull the comparable number off a card. */
  value: (c: HiloCard) => number;
  /** Render that number for display. */
  format: (n: number) => string;
};

export const METRICS: Record<HiloMetric, MetricConfig> = {
  "box-office": {
    key: "box-office",
    label: "Box Office",
    blurb: "Which film grossed more worldwide?",
    value: (c) => c.revenue,
    format: (n) => formatMoney(n),
  },
  rating: {
    key: "rating",
    label: "Rating",
    blurb: "Which film has the higher TMDB score?",
    value: (c) => c.rating,
    format: (n) => `${formatRating(n)} / 10`,
  },
};

export const METRIC_ORDER: HiloMetric[] = ["box-office", "rating"];
