import { Button } from "@/common/ui/Button";
import { Card } from "@/common/ui/Card";

type ErrorStateProps = {
  message: string;
  onRetry: () => void;
  retryLabel?: string;
};

export const ErrorState = ({
  message,
  onRetry,
  retryLabel = "Try again",
}: ErrorStateProps) => (
  <Card className="mt-10 p-6">
    <p className="text-fr-close">{message}</p>
    <Button variant="ghost" onClick={onRetry} className="mt-4 px-5 py-2.5 text-sm">
      {retryLabel}
    </Button>
  </Card>
);
