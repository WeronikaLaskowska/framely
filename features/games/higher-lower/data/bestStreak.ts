import type { HiloMetric } from "@/models/hilo";

/** Per-metric best streak, persisted in localStorage. */
const bestKey = (metric: HiloMetric) => `framely.hilo.best.${metric}`;

export const readBest = (metric: HiloMetric): number => {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(bestKey(metric));
  const n = raw ? Number(raw) : 0;
  return Number.isFinite(n) ? n : 0;
};

export const writeBest = (metric: HiloMetric, value: number): void => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(bestKey(metric), String(value));
};
