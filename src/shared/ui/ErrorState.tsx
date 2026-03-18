import { Button } from './Button';
import { Card } from './Card';

type ErrorStateProps = {
  message: string;
  title?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function ErrorState({
  message,
  title = 'Something went wrong',
  actionLabel,
  onAction,
}: ErrorStateProps) {
  return (
    <Card className="border border-red-200 bg-red-50 text-red-700">
      <h2 className="text-sm font-semibold">{title}</h2>
      <p className="mt-1 text-sm">{message}</p>
      {actionLabel && onAction ? (
        <Button className="mt-3" variant="danger" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </Card>
  );
}
