import Image from "next/image";
import { User } from "lucide-react";
import type { CastLite } from "@/models/movie";
import { tmdbImage } from "@/lib/format";
import { cn } from "@/lib/cn";
import { Timecode } from "@/common/typography/Timecode";

/** "Eddie Murphy" → "E. Murphy" to keep avatar captions compact. */
const shortName = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return name;
  return `${parts[0][0]}. ${parts.slice(1).join(" ")}`;
};

type GuessPersonAvatarProps = {
  person: CastLite | null;
  role: string;
  /** Whether this person also appears in the secret film. */
  matched: boolean;
};

export const GuessPersonAvatar = ({ person, role, matched }: GuessPersonAvatarProps) => {
  const photo = tmdbImage(person?.profilePath ?? null, "w185");
  return (
    <div className="flex w-[60px] shrink-0 flex-col items-center gap-1.5 text-center">
      <Timecode className="w-full truncate text-[8px]">{role}</Timecode>
      <div
        className={cn(
          "relative h-14 w-14 overflow-hidden border-2",
          matched
            ? "border-fr-correct shadow-[0_0_18px_-4px_var(--color-fr-correct)]"
            : "border-fr-border-strong",
        )}
      >
        {photo ? (
          <Image
            src={photo}
            alt={person?.name ?? role}
            fill
            sizes="56px"
            className={cn("object-cover object-top", matched ? "" : "grayscale")}
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-fr-surface-2 text-fr-fg-subtle">
            <User size={18} />
          </div>
        )}
      </div>
      <span
        className={cn(
          "w-full truncate text-[10px] leading-tight",
          matched ? "text-fr-correct" : "text-fr-fg-muted",
        )}
      >
        {person ? shortName(person.name) : "—"}
      </span>
    </div>
  );
};
