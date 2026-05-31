import { ErrorState } from "@/common/ui/ErrorState";
import { Loader } from "@/common/ui/Loader";

type AsyncBoundaryProps = {
  loading: boolean;
  error?: string | null;
  onRetry: () => void;
  retryLabel?: string;
  loadingMessage?: string;
};

/**
 * The single loading/error gate for every game screen: shows the retryable
 * error card on failure, the universal loader while loading, and otherwise
 * nothing (the screen renders its ready content as a sibling).
 */
export const AsyncBoundary = ({
  loading,
  error,
  onRetry,
  retryLabel,
  loadingMessage,
}: AsyncBoundaryProps) => {
  if (error) return <ErrorState message={error} onRetry={onRetry} retryLabel={retryLabel} />;
  if (loading) return <Loader message={loadingMessage} />;
  return null;
};
