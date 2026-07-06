import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-16">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-5">
        <AlertTriangle size={32} className="text-error" />
      </div>

      <h3 className="text-lg font-semibold font-heading text-text-primary mb-1">
        {title}
      </h3>

      <p className="text-sm text-text-secondary max-w-sm mb-6">
        {description}
      </p>

      {onRetry && (
        <Button variant="danger" size="md" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}

export { ErrorState };
export type { ErrorStateProps };
