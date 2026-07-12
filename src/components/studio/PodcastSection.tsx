'use client';

import { useEffect, useState } from 'react';
import { SectionCard } from './SectionCard';
import { VideoData, PodcastResult } from './types';

export function PodcastSection({
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
  const [data, setData] = useState<PodcastResult | null>(null);

  const load = async () => {
    if (data) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/studio/podcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: video.transcript, title: video.title }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Podcast generation failed');
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Podcast generation failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <SectionCard title="Podcast Mode" icon="" open={open} onToggle={onToggle} loading={loading} error={error} onRetry={load}>
      {data && (
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-purple-600">Episode summary</h4>
            <p className="mt-2 text-zinc-700 dark:text-zinc-200">{data.episodeSummary}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-purple-600">Show notes</h4>
            <p className="mt-2 whitespace-pre-line text-zinc-700 dark:text-zinc-200">{data.notes}</p>
          </div>

          {data.discussionPoints.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-purple-600">Key discussion points</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-700 dark:text-zinc-200">
                {data.discussionPoints.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          )}

          {data.highlights.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-purple-600">Listening highlights</h4>
              <ul className="mt-2 space-y-2">
                {data.highlights.map((t, i) => (
                  <li
                    key={i}
                    className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm italic text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-200"
                  >
                    “{t}”
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </SectionCard>
  );
}
