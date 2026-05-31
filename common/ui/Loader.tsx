import { Film } from "lucide-react";
import { Timecode } from "@/common/typography/Timecode";

export const Loader = ({ message }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center gap-5 py-16 text-fr-fg-muted">
    <span className="relative inline-flex h-14 w-14 items-center justify-center">
      <span className="absolute inset-0 animate-spin rounded-full border-2 border-fr-border-strong border-t-fr-flame" />
      <Film size={20} className="text-fr-flame" />
    </span>
    {message && <Timecode className="text-fr-fg-subtle">{message}</Timecode>}
  </div>
);
