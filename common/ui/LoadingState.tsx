import { Loader2 } from "lucide-react";

/** Inline "working…" row with a spinner, used while a round is being set up. */
export const LoadingState = ({ message }: { message: string }) => (
  <div className="mt-10 flex items-center gap-3 text-fr-fg-muted">
    <Loader2 className="animate-spin" size={18} /> {message}
  </div>
);
