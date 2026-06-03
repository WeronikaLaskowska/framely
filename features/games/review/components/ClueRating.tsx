import { Star } from "lucide-react";

type ClueRatingProps = {
  rating: number;
};

export const ClueRating = ({ rating }: ClueRatingProps) => (
  <span className="inline-flex items-center gap-1 text-xs text-fr-fg-muted">
    <Star size={12} className="text-fr-flame" /> {rating}/10
  </span>
);
