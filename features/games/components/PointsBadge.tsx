import { cn } from "@/lib/cn";

type PointsBadgeProps = {
  points?: number | null;
  className?: string;
};

export const PointsBadge = ({ points, className }: PointsBadgeProps) =>
  points != null && points > 0 ? (
    <span
      className={cn(
        "mt-3 inline-flex items-center gap-1.5 bg-fr-flame/15 px-3 py-1 text-sm font-semibold text-fr-flame",
        className,
      )}
    >
      +{points} pts
    </span>
  ) : null;
