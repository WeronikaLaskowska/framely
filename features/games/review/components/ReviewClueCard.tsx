import { Quote, Star } from "lucide-react";
import type { ReviewClue } from "@/models/review";
import { Card } from "@/common/ui/Card";
import { Timecode } from "@/common/typography/Timecode";

type ReviewClueCardProps = { clue: ReviewClue; index: number };

export const ReviewClueCard = ({ clue, index }: ReviewClueCardProps) => (
  <Card className="fr-pop p-5">
    <div className="flex items-center justify-between gap-3">
      <Timecode className="text-fr-flame">
        Review {String(index + 1).padStart(2, "0")}
      </Timecode>
      {clue.rating != null && (
        <span className="inline-flex items-center gap-1 text-xs text-fr-fg-muted">
          <Star size={12} className="text-fr-flame" /> {clue.rating}/10
        </span>
      )}
    </div>

    <div className="mt-3 flex gap-3">
      <Quote size={18} className="mt-0.5 shrink-0 text-fr-border-strong" aria-hidden />
      <p className="whitespace-pre-line text-sm leading-relaxed text-fr-fg-muted">
        {clue.content}
      </p>
    </div>

    <p className="mt-3 text-right text-xs text-fr-fg-subtle">— {clue.author}</p>
  </Card>
);
