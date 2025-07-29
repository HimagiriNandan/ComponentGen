import React from "react";
import { Loader2 } from "lucide-react";

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 text-primary"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992c0-1.664.678-3.217 1.88-4.248L14.12 2.22a9.003 9.003 0 0112.727 12.727l-1.635 1.635c-.933 1.02-2.486 1.698-4.15 1.698H2.985v4.992c0 1.664.678 3.217 1.88 4.248L14.12 2.22a9.003 9.003 0 01-12.727 12.727l-1.635-1.635c-1.02-1.03-1.698-2.583-1.698-4.248v-4.992z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          Loading workspace...
        </h3>
        <p className="text-muted-foreground">
          Please wait while we load your session data.
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay;