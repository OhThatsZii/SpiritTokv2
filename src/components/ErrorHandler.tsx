import React from 'react';
import { Button } from '@/components/ui/button';

interface ErrorHandlerProps {
  error?: Error | null;
  onRetry?: () => void;
  message?: string;
}

const ErrorHandler: React.FC<ErrorHandlerProps> = ({ 
  error, 
  onRetry, 
  message = "Something went wrong" 
}) => {
  if (!error) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {message}
        </h1>
        <p className="text-gray-600 mb-6">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="space-y-3">
          {onRetry && (
            <Button onClick={onRetry} className="w-full">
              Try Again
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="w-full"
          >
            Reload Page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorHandler;