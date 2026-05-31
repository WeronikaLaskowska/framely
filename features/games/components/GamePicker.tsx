import type { ReactNode } from "react";
import { Card } from "@/common/ui/Card";
import { DisplayHeading } from "@/common/typography/DisplayHeading";
import { Counter } from "@/common/typography/Counter";
import { Timecode } from "@/common/typography/Timecode";

export type PickerOption<T extends string> = {
  id: T;
  label: string;
  blurb: string;
  /** Small footer line (e.g. "5×6 tiles" or "Best streak: 3"). */
  footer: ReactNode;
};

type GamePickerProps<T extends string> = {
  /** Timecode caption above the grid. */
  caption: string;
  options: PickerOption<T>[];
  columns: 2 | 3;
  onSelect: (id: T) => void;
};

const COLUMNS = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3" } as const;

/** Shared pre-round selection grid (poster difficulty, Higher/Lower stat, …). */
export function GamePicker<T extends string>({
  caption,
  options,
  columns,
  onSelect,
}: GamePickerProps<T>) {
  return (
    <div className="mt-8">
      <Timecode>{caption}</Timecode>
      <div className={`mt-3 grid gap-4 ${COLUMNS[columns]}`}>
        {options.map((opt) => (
          <Card
            as="button"
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.id)}
            className="group cursor-pointer p-6 text-left transition-transform hover:-translate-y-1"
          >
            <DisplayHeading as="h3" className="text-2xl">
              {opt.label}
            </DisplayHeading>
            <p className="mt-2 text-sm text-fr-fg-muted">{opt.blurb}</p>
            <Counter className="mt-4 block">{opt.footer}</Counter>
          </Card>
        ))}
      </div>
    </div>
  );
}
