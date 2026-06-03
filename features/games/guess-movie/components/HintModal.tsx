"use client";

import { type ReactNode } from "react";
import { Lightbulb, Users, CalendarClock, Building2, Check, Loader2 } from "lucide-react";
import type { Hint, HintType } from "@/models/hint";
import { tmdbImage } from "@/lib/format";
import { cn } from "@/lib/cn";
import { Modal } from "@/common/ui/Modal";
import { Timecode } from "@/common/typography/Timecode";
import { MutedText } from "@/common/typography/MutedText";

const OPTIONS: { type: HintType; label: string; desc: string; icon: ReactNode }[] = [
  { type: "cast", label: "Reveal a cast member", desc: "Unmask one of the headline actors.", icon: <Users size={18} /> },
  { type: "decade", label: "Reveal the decade", desc: "Learn which decade it premiered in.", icon: <CalendarClock size={18} /> },
  { type: "studio", label: "Reveal the studio", desc: "Show which studio released it.", icon: <Building2 size={18} /> },
];

type HintModalProps = {
  open: boolean;
  onClose: () => void;
  revealed: Hint[];
  loadingType: HintType | null;
  onReveal: (type: HintType) => void;
};

export const HintModal = ({ open, onClose, revealed, loadingType, onReveal }: HintModalProps) => (
  <Modal
    open={open}
    onClose={onClose}
    title="Take a hint"
    icon={<Lightbulb size={16} className="text-fr-flame" />}
  >
    <MutedText className="leading-relaxed">
      Stuck? Peek behind the curtain. Each clue can be revealed once.
    </MutedText>

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
                  <Timecode className="text-[9px]">{found.label}</Timecode>
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
