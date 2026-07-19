'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BentoItem {
  title: string;
  /** Short text shown under the title on the grid card. */
  description?: string;
  /** Longer text shown in the expanded overlay. Falls back to description. */
  content?: string;
  icon?: React.ReactNode;
  /** Bento sizing, e.g. "md:col-span-2". */
  className?: string;
}

export function ExpandableBentoGrid({
  items,
  className,
}: {
  items: BentoItem[];
  className?: string;
}) {
  const [active, setActive] = React.useState<number | null>(null);
  const activeItem = active !== null ? items[active] : null;

  // Close on Escape for accessibility.
  React.useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setActive(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  return (
    <>
      <div className={cn('grid grid-cols-2 gap-4 md:grid-cols-3', className)}>
        {items.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Expand ${item.title}`}
            className={cn(
              'ws-card ws-reveal group flex flex-col items-start gap-3 p-6 text-left transition hover:border-blue-500/40 hover:shadow-[0_18px_50px_-18px_rgba(37,99,235,0.6)]',
              item.className
            )}
          >
            {item.icon && (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                {item.icon}
              </div>
            )}
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            {item.description && (
              <p className="text-sm text-zinc-400">{item.description}</p>
            )}
            <span className="mt-auto text-xs font-medium text-blue-300 opacity-0 transition group-hover:opacity-100">
              Click to expand →
            </span>
          </button>
        ))}
      </div>

      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm ws-animate-fade" />
          <div
            className="ws-card relative z-10 w-full max-w-lg p-8 ws-animate-rise"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg text-zinc-400 transition hover:bg-white/10 hover:text-white"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
            {activeItem.icon && (
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                {activeItem.icon}
              </div>
            )}
            <h3 className="pr-8 text-2xl font-semibold text-white">
              {activeItem.title}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-zinc-300">
              {activeItem.content ?? activeItem.description}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default ExpandableBentoGrid;
