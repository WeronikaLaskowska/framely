import type { ReactNode } from "react";
import { ErrorState } from "@/common/ui/ErrorState";
import { Loader } from "@/common/ui/Loader";

type QueryWrapperProps = {
  isLoading: boolean;
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
