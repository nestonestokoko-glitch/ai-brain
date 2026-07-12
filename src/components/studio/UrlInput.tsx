'use client';

import { useState } from 'react';

/** Top input bar — paste a YouTube URL, submit via Enter or button. */
export function UrlInput({
  onSubmit,
  loading,
}: {
  onSubmit: (url: string) => void;
  loading: boolean;
}) {
  const [url, setUrl] = useState('');

  const submit = () => {
    const trimmed = url.trim();
    if (!trimmed || loading) return;
    onSubmit(trimmed);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
          }}
          placeholder="Paste a YouTube link… (https://www.youtube.com/watch?v=…)"
          className="w-full flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        <button 
          onClick={submit} 
          disabled={loading || !url.trim()}
          className="group flex shrink-0 items-center justify-center h-12 px-8 py-2 text-sm font-medium text-white transition-all duration-300 ease-out border-2 rounded-xl bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 border-blue-300 shadow-lg shadow-blue-200/40 hover:scale-105 hover:shadow-blue-300/60 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <span className="flex items-center transition-transform duration-300 group-hover:translate-x-1">
            <span className="mr-2 transition-transform duration-300 group-hover:rotate-12">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </span>
            {loading ? 'Working…' : 'Generate a Video Now'}
          </span>
        </button>
      </div>
      <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
        Try a talk, lecture, podcast, or any video with captions.
      </p>
    </div>
  );
}
