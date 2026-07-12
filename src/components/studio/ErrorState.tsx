'use client';

import { Button } from './Card';

/** Friendly top-level error state with a recovery action. */
export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/50 dark:bg-red-950/30">
      <div className="text-4xl"></div>
      <h3 className="mt-3 text-lg font-semibold text-red-800 dark:text-red-200">
        Something went wrong
      </h3>
      <p className="mt-2 text-sm text-red-700 dark:text-red-300">{message}</p>
      <div className="mt-5">
        <Button onClick={onRetry}>Try another video</Button>
      </div>
    </div>
  );
}
