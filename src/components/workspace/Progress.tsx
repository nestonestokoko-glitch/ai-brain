import type { Source } from './types';
import { YouTubeIcon, WebsiteIcon, PdfIcon, CloseIcon, CheckIcon } from './icons';

function SourceIcon({ type }: { type: Source['type'] }) {
  const cls =
    'shrink-0 ' +
    (type === 'youtube'
      ? 'text-red-400'
      : type === 'website'
        ? 'text-sky-300'
        : 'text-violet-300');
  if (type === 'youtube') return <YouTubeIcon width={16} height={16} className={cls} />;
  if (type === 'website') return <WebsiteIcon width={16} height={16} className={cls} />;
  return <PdfIcon width={16} height={16} className={cls} />;
}

function Spinner() {
  return (
    <span
      className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-blue-400"
      aria-hidden
    />
  );
}

export default function Progress({
  source,
  onRemove,
}: {
  source: Source;
  onRemove?: (id: string) => void;
}) {
  const { status, stage, progress } = source;

  return (
    <div className="ws-card ws-animate-rise p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          {status === 'processing' && <Spinner />}
          {status === 'ready' && (
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
              <CheckIcon width={12} height={12} />
            </span>
          )}
          {status === 'error' && (
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-red-500/15 text-red-400">
              <CloseIcon width={12} height={12} />
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-zinc-100">{source.title}</p>
            <p className="truncate text-xs text-zinc-500">
              {status === 'error'
                ? source.error ?? 'Something went wrong.'
                : stage ?? (status === 'ready' ? 'Ready' : 'Processing…')}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <SourceIcon type={source.type} />
          {onRemove && status !== 'processing' && (
            <button
              type="button"
              onClick={() => onRemove(source.id)}
              aria-label="Remove source"
              className="grid h-6 w-6 place-items-center rounded-md text-zinc-500 transition hover:bg-white/10 hover:text-zinc-200"
            >
              <CloseIcon width={13} height={13} />
            </button>
          )}
        </div>
      </div>

      {status === 'processing' && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="ws-shimmer h-full rounded-full transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {status === 'ready' && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full w-full rounded-full"
            style={{ backgroundImage: 'linear-gradient(90deg, #3b82f6, #6366f1)' }}
          />
        </div>
      )}
    </div>
  );
}
