import type { HiloMetric } from "@/models/hilo";
import { METRICS, METRIC_ORDER } from "@/features/games/higher-lower/data/metrics";
import { readBest } from "@/features/games/higher-lower/data/bestStreak";
import { GamePicker } from "@/features/games/components/GamePicker";

/** Box-office vs rating selection grid shown before a run. */
export const HiloMetricPicker = ({
  onSelect,
}: {
  onSelect: (metric: HiloMetric) => void;
}) => (
  <GamePicker
    caption="Pick a stat to compare"
    columns={2}
    onSelect={onSelect}
    options={METRIC_ORDER.map((m) => {
      const c = METRICS[m];
      return { id: m, label: c.label, blurb: c.blurb, footer: `Best streak: ${readBest(m)}` };
    })}
  />
);
