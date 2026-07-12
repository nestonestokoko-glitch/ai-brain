'use client';

import { VideoData } from './types';

function formatDuration(s: number | null): string | null {
  if (s == null) return null;
  const sec = Math.floor(s);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const ss = sec % 60;
  const mm = h > 0 ? String(m).padStart(2, '0') : String(m);
  const sss = String(ss).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${sss}` : `${mm}:${sss}`;
}

/** The video preview card shown after processing completes. */
export function VideoPreviewCard({ video }: { video: VideoData }) {
  const duration = formatDuration(video.durationSeconds);
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 sm:w-64 sm:shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={video.thumbnailUrl || `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`}
          alt={video.title}
          className="h-full w-full object-cover"
        />
        {duration && (
          <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
            {duration}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <a
          href={video.url}
          target="_blank"
          rel="noreferrer"
          className="line-clamp-2 text-lg font-semibold text-zinc-900 hover:text-blue-600 dark:text-zinc-100"
        >
          {video.title}
        </a>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
          {video.author && <span>{video.author}</span>}
          {video.language && (
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs dark:bg-zinc-800">
              {video.language}
            </span>
          )}
          {video.transcript && (
            <span className="text-xs">{video.transcript.length.toLocaleString()} chars transcript</span>
          )}
        </div>

        {video.chapters && video.chapters.length > 0 && (
          <ul className="mt-3 space-y-1 text-sm text-zinc-600 dark:text-zinc-300">
            {video.chapters.slice(0, 5).map((c, i) => (
              <li key={i} className="flex gap-2">
                <span className="tabular-nums text-zinc-400">
                  {formatDuration(c.start_time)}
                </span>
                <span>{c.title}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
