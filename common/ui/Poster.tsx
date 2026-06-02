import { Film } from "lucide-react";
import { tmdbImage } from "@/lib/format";
import { cn } from "@/lib/cn";

type PosterProps = {
  path: string | null;
  alt: string;
  size?: string;
  iconSize?: number;
  className?: string;
};

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
