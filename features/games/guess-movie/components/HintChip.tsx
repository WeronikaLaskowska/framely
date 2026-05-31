import type { Hint } from "@/models/hint";
import { tmdbImage } from "@/lib/format";
import { Timecode } from "@/common/typography/Timecode";

export const HintChip = ({ hint }: { hint: Hint }) => {
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
      <Timecode className="text-[8px] text-fr-flame">{hint.label}</Timecode>
      <span className="text-xs font-semibold text-fr-fg">{hint.value}</span>
    </span>
  );
};
