"use client";

import { type ReactNode } from "react";
import { Lightbulb, Users, CalendarClock, Building2, Check, Loader2 } from "lucide-react";
import { Modal } from "@/components/modal";
import type { Hint, HintType } from "@/lib/types";
import { tmdbImage } from "@/lib/format";
import { cn } from "@/lib/cn";

const OPTIONS: { type: HintType; label: string; desc: string; icon: ReactNode }[] = [
  {
    type: "cast",
    label: "Reveal a cast member",
    desc: "Unmask one of the headline actors.",
    icon: <Users size={18} />,
  },
  {
    type: "decade",
    label: "Reveal the decade",
    desc: "Learn which decade it premiered in.",
    icon: <CalendarClock size={18} />,
  },
  {
    type: "studio",
    label: "Reveal the studio",
    desc: "Show which studio released it.",
    icon: <Building2 size={18} />,
  },
];

type HintModalProps = {
  open: boolean;
  onClose: () => void;
  revealed: Hint[];
  loadingType: HintType | null;
  onReveal: (type: HintType) => void;
};

export function HintModal({ open, onClose, revealed, loadingType, onReveal }: HintModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Take a hint"
      icon={<Lightbulb size={16} className="text-fr-flame" />}
    >
      <p className="text-sm leading-relaxed text-fr-fg-muted">
        Stuck? Peek behind the curtain. Each clue can be revealed once.
      </p>

      <div className="mt-4 flex flex-col gap-2.5">
        {OPTIONS.map((opt) => {
          const found = revealed.find((h) => h.type === opt.type);
          const loading = loadingType === opt.type;
          const photo = found ? tmdbImage(found.imagePath ?? null, "w185") : null;

          return (
            <button
              key={opt.type}
              type="button"
              disabled={!!found || loadingType !== null}
              onClick={() => onReveal(opt.type)}
              className={cn(
                "flex items-center gap-3 border-2 px-3 py-3 text-left transition-colors",
                found
                  ? "border-fr-correct-border bg-fr-correct-bg"
                  : "cursor-pointer border-fr-border-strong bg-white/2 hover:border-fr-flame/60 hover:bg-fr-surface-2",
                loadingType !== null && !found && !loading && "opacity-50",
              )}
            >
              <span
                className={cn(
                  "grid h-10 w-10 shrink-0 place-items-center border-2",
                  found ? "border-fr-correct text-fr-correct" : "border-fr-border-strong text-fr-flame",
                )}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : found ? <Check size={18} /> : opt.icon}
              </span>

              <span className="min-w-0 flex-1">
                {found ? (
                  <>
                    <span className="fr-timecode text-[9px]">{found.label}</span>
                    <span className="flex items-center gap-2 text-sm font-semibold leading-tight text-fr-correct">
                      {photo && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={photo}
                          alt=""
                          className={cn(
                            "h-6 object-contain",
                            found.type === "studio"
                              ? "max-w-[80px] filter-[brightness(0)_invert(1)]"
                              : "w-6 rounded-none border border-fr-correct object-cover",
                          )}
                        />
                      )}
                      {found.value}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="block text-sm font-semibold leading-tight">{opt.label}</span>
                    <span className="block text-xs leading-tight text-fr-fg-muted">{opt.desc}</span>
                  </>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}

/** Compact persistent chip for an already-revealed hint, shown under the input. */
export function HintChip({ hint }: { hint: Hint }) {
  const photo = tmdbImage(hint.imagePath ?? null, "w185");
  return (
    <span className="inline-flex items-center gap-2 border-2 border-fr-flame/40 bg-fr-flame/10 px-2.5 py-1.5">
      {photo && hint.type === "studio" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt="" className="h-4 max-w-[56px] object-contain filter-[brightness(0)_invert(1)]" />
      )}
      {photo && hint.type === "cast" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt="" className="h-5 w-5 border border-fr-flame/50 object-cover object-top" />
      )}
      <span className="fr-timecode text-[8px] text-fr-flame">{hint.label}</span>
      <span className="text-xs font-semibold text-fr-fg">{hint.value}</span>
    </span>
  );
}
