import type { ReactNode } from "react";
import { ErrorState } from "@/common/ui/ErrorState";
import { Loader } from "@/common/ui/Loader";

type QueryWrapperProps = {
  isLoading: boolean;
  /** Either a boolean flag or the error itself — both put it in the error state. */
  isError?: boolean;
  error?: Error | string | null;
  onRetry: () => void;
  retryLabel?: string;
  loadingMessage?: string;
  children: ReactNode;
};

const messageOf = (error: QueryWrapperProps["error"]): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string" && error) return error;
  return "Something went wrong";
};

/**
 * The single gate for any query-backed UI: renders the universal loader while
 * loading, a retryable error card on failure, and otherwise its children. Wrap
 * every screen/section that depends on fetched data with this so loading and
 * error handling lives in one place.
 */
export const QueryWrapper = ({
  isLoading,
  isError,
  error,
  onRetry,
  retryLabel,
  loadingMessage,
  children,
}: QueryWrapperProps) => {
  if (isError || error != null) {
    return <ErrorState message={messageOf(error)} onRetry={onRetry} retryLabel={retryLabel} />;
  }
  if (isLoading) return <Loader message={loadingMessage} />;
  return <>{children}</>;
};
