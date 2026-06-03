import { Button } from "@/common/ui/Button";
import { Card } from "@/common/ui/Card";

type ErrorStateProps = {
  message?: string | null;
  onRetry?: () => void;
  retryLabel?: string;
  variant?: "card" | "inline";
};

export const ErrorState = ({
  message,
  onRetry,
  retryLabel = "Try again",
  variant = "card",
}: ErrorStateProps) => {
  if (!message) return null;

  if (variant === "inline") {
    return <span className="text-sm text-fr-close">{message}</span>;
  }

  return (
    <Card className="mt-10 p-6">
      <p className="text-fr-close">{message}</p>
      {onRetry && (
        <Button variant="ghost" onClick={onRetry} className="mt-4 px-5 py-2.5 text-sm">
          {retryLabel}
        </Button>
      )}
    </Card>
  );
};
