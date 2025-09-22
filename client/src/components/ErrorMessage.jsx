const ErrorMessage = ({ message, onRetry, onDismiss }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mx-auto max-w-2xl">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800 mb-2">
            Something went wrong
          </h3>
          <p className="text-sm text-red-700 mb-4">
            {message || 'An unexpected error occurred. Please try again.'}
          </p>
          <div className="flex space-x-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="bg-white text-red-600 border border-red-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-50 transition-colors"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;