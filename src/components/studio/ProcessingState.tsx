'use client';

const STEPS = ['Validating link', 'Fetching transcript', 'Analyzing content'];

/** Animated processing state with skeleton loaders and step progress. */
export function ProcessingState() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-3">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600" />
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Preparing your video…
          </p>
        </div>

        <ol className="mt-5 space-y-3">
          {STEPS.map((step, i) => (
            <li key={step} className="flex items-center gap-3 text-sm">
              <span
                className={
                  'h-2 w-2 rounded-full ' +
                  (i === 0
                    ? 'animate-pulse bg-blue-600'
                    : 'bg-zinc-300 dark:bg-zinc-700')
                }
              />
              <span className="text-zinc-600 dark:text-zinc-300">{step}</span>
              {i === 0 && (
                <span className="text-xs text-zinc-400">in progress</span>
              )}
            </li>
          ))}
        </ol>
      </div>

      {/* Skeleton preview card */}
      <div className="flex flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row">
        <div className="aspect-video w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800 sm:w-64 sm:shrink-0" />
        <div className="flex-1 space-y-3 py-2">
          <div className="h-5 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}
