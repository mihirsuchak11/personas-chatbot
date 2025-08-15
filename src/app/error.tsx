"use client";

import { useEffect } from "react";

/**
 * Props for the Error component
 * @interface ErrorProps
 * @property {Error} error - The error object that was thrown
 * @property {() => void} reset - Function to reset the error boundary and retry rendering
 */
interface ErrorProps {
  error: Error;
  reset: () => void;
}

/**
 * Global error handling component for the application
 * Displays when an error occurs in the app and provides a way to recover
 * @param {ErrorProps} props - Component props
 * @returns {JSX.Element} Error component
 */
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold text-red-500">
          Something went wrong!
        </h2>
        <p className="text-zinc-400 max-w-md mx-auto">
          {error.message || "An unexpected error occurred"}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 
            text-white transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
