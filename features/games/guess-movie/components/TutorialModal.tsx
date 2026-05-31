"use client";

import { GraduationCap } from "lucide-react";
import { Modal } from "@/common/ui/Modal";

const LEGEND = [
  { cls: "fr-tile--correct", title: "Green — exact", body: "The attribute matches the secret film exactly." },
  { cls: "fr-tile--close", title: "Amber — close", body: "Within range: year ±5, rating ±0.5, or box office in the ballpark." },
  { cls: "fr-tile--wrong", title: "Grey — cold", body: "No match. Numeric tiles show ↑ / ↓ toward the secret value." },
];

const RULES = [
  "Name any film to compare it against the secret one.",
  "Each genre you share turns green; the rest stay grey.",
  "Matching cast members and the director light up green.",
  "You have 8 guesses. Hints unlock after your 5th guess.",
];

export const TutorialModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => (
  <Modal
    open={open}
    onClose={onClose}
    title="How to play"
    icon={<GraduationCap size={16} className="text-fr-flame" />}
  >
    <p className="text-sm leading-relaxed text-fr-fg-muted">
      A secret movie is drawn each round. Guess films to reveal how they
      compare — colour tells you how warm you are.
    </p>

    <div className="mt-4 flex flex-col gap-2">
      {LEGEND.map((l) => (
        <div key={l.title} className="flex items-center gap-3">
          <span className={`fr-tile ${l.cls} h-9 w-9 shrink-0`} aria-hidden />
          <div>
            <p className="text-sm font-semibold leading-tight">{l.title}</p>
            <p className="text-xs leading-tight text-fr-fg-muted">{l.body}</p>
          </div>
        </div>
      ))}
    </div>

    <ul className="mt-5 flex flex-col gap-2 border-t-2 border-fr-border pt-4">
      {RULES.map((r) => (
        <li key={r} className="flex gap-2 text-sm text-fr-fg-muted">
          <span className="text-fr-flame">▸</span>
          {r}
        </li>
      ))}
    </ul>
  </Modal>
);
