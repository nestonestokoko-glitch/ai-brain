'use client';

import { ReactNode } from 'react';

/** Collapsible section wrapper with header, loading state, and error/retry. */
export function SectionCard({
  title,
  icon,
  open,
  onToggle,
  loading,
  error,
  onRetry,
  children,
}: {
  title: string;
  icon: string;
  open: boolean;
  onToggle: () => void;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-6 py-4 text-left"
      >
        <span className="flex items-center gap-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          <span className="text-xl">{icon}</span>
          {title}
        </span>
        <span className="text-zinc-400 transition-transform" style={{ transform: open ? 'rotate(180deg)' : 'none' }}>
          ▾
        </span>
      </button>

      {open && (
        <div className="border-t border-zinc-200 px-6 py-5 dark:border-zinc-800">
          {loading && (
            <div className="flex items-center gap-3 py-6 text-sm text-zinc-500">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600" />
              Working…
            </div>
          )}

          {!loading && error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
              <p>{error}</p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="mt-2 font-medium underline underline-offset-2"
                >
                  Try again
                </button>
              )}
            </div>
          )}

          {!loading && !error && children}
        </div>
      )}
    </div>
  );
}
