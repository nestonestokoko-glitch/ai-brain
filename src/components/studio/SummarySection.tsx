'use client';

import { useEffect, useState } from 'react';
import { SectionCard } from './SectionCard';
import { VideoData, SummaryResult } from './types';

export function SummarySection({
  video,
  open,
  onToggle,
}: {
  video: VideoData;
  open: boolean;
  onToggle: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SummaryResult | null>(null);

  const load = async () => {
    if (data) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/studio/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: video.transcript, title: video.title, author: video.author }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Summary failed');
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Summary failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <SectionCard title="Summary" icon="" open={open} onToggle={onToggle} loading={loading} error={error} onRetry={load}>
      {data && (
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-blue-600">Short</h4>
            <p className="mt-2 text-zinc-700 dark:text-zinc-200">{data.short}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-blue-600">Detailed</h4>
            <p className="mt-2 whitespace-pre-line text-zinc-700 dark:text-zinc-200">{data.detailed}</p>
          </div>

          {data.keyTakeaways.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-blue-600">Key takeaways</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-700 dark:text-zinc-200">
                {data.keyTakeaways.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          )}

          {data.timestamps.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-blue-600">Important timestamps</h4>
              <ul className="mt-2 space-y-1 text-sm">
                {data.timestamps.map((ts, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="tabular-nums text-zinc-400">
                      {Math.floor(ts.t / 60)}:{String(ts.t % 60).padStart(2, '0')}
                    </span>
                    <span className="text-zinc-700 dark:text-zinc-200">{ts.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.actionItems.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-blue-600">Action items</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-700 dark:text-zinc-200">
                {data.actionItems.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </SectionCard>
  );
}
