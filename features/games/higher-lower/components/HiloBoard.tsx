import { ArrowDown, ArrowUp } from "lucide-react";
import type { HiloCard } from "@/models/hilo";
import type { MetricConfig } from "@/features/games/higher-lower/data/metrics";
import { Button } from "@/common/ui/Button";
import { Caption } from "@/common/typography/Caption";
import { HiloPanel } from "@/features/games/higher-lower/components/HiloPanel";

type HiloBoardProps = {
  cfg: MetricConfig;
  current: HiloCard;
  next: HiloCard;
  revealed: boolean;
  lastCorrect: boolean | null;
  onGuess: (higher: boolean) => void;
};

export const HiloBoard = ({
  cfg,
  current,
  next,
  revealed,
  lastCorrect,
  onGuess,
}: HiloBoardProps) => (
  <div className="mt-8">
    <Caption className="tracking-[0.25em]">Comparing {cfg.label}</Caption>
    <div className="mt-4 grid grid-cols-2 gap-4 md:gap-6">
      <HiloPanel card={current} caption="known" valueText={cfg.format(cfg.value(current))} />
      <HiloPanel
        card={next}
        caption="unknown"
        valueText={revealed ? cfg.format(cfg.value(next)) : null}
        outcome={revealed ? lastCorrect : null}
      >
        {!revealed && (
          <div className="mt-3 flex flex-col gap-2">
            <Button
              variant="ember"
              onClick={() => onGuess(true)}
              className="w-full cursor-pointer px-4 py-3 text-sm"
            >
              <ArrowUp size={16} /> Higher
            </Button>
            <Button
              variant="ghost"
              onClick={() => onGuess(false)}
              className="w-full cursor-pointer px-4 py-3 text-sm"
            >
              <ArrowDown size={16} /> Lower
            </Button>
          </div>
        )}
      </HiloPanel>
    </div>
  </div>
);
