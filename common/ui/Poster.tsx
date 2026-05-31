import { Film } from "lucide-react";
import { tmdbImage } from "@/lib/format";
import { cn } from "@/lib/cn";

type PosterProps = {
  path: string | null;
  alt: string;
  /** TMDB image size bucket (e.g. "w92", "w185", "w342"). */
  size?: string;
  iconSize?: number;
  className?: string;
};

/**
 * A TMDB poster that fills its (already sized) parent, falling back to a Film
 * icon when the movie has no artwork. Centralises the image/fallback pattern
 * shared by search rows, guess cards and the Higher or Lower board.
 */
export const Poster = ({ path, alt, size = "w342", iconSize = 24, className }: PosterProps) => {
  const src = tmdbImage(path, size);
  if (!src) {
    return (
      <span className="grid h-full w-full place-items-center text-fr-fg-subtle">
        <Film size={iconSize} />
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} loading="lazy" className={cn("h-full w-full object-cover", className)} />
  );
};
