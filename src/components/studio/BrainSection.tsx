'use client';

import { useState } from 'react';
import { SectionCard } from './SectionCard';
import { TypingDots } from './TypingDots';
import { Button } from './Card';
import { VideoData, ChatMsg, BrainVideo } from './types';

/**
 * Create AI Brain: start from the current video, add more YouTube URLs, then
 * chat across ALL of their transcripts.
 */
export function BrainSection({
  video,
  open,
  onToggle,
}: {
  video: VideoData;
  open: boolean;
  onToggle: () => void;
}) {
  const [urls, setUrls] = useState('');
  const [videos, setVideos] = useState<BrainVideo[]>([
    { url: video.url, title: video.title, transcript: video.transcript },
  ]);
  const [building, setBuilding] = useState(false);
  const [buildError, setBuildError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const build = async () => {
    setBuilding(true);
    setBuildError(null);
    const list = urls
      .split(/[\n,]/)
      .map((u) => u.trim())
      .filter(Boolean);

    try {
      const collected: BrainVideo[] = [
        { url: video.url, title: video.title, transcript: video.transcript },
      ];
      for (const u of list) {
        const res = await fetch('/api/studio/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: u }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(`${u}: ${json.error || 'failed'}`);
        collected.push({ url: json.url, title: json.title, transcript: json.transcript });
      }
      setVideos(collected);
      setReady(true);
    } catch (err) {
      setBuildError(err instanceof Error ? err.message : 'Failed to build AI Brain');
    } finally {
      setBuilding(false);
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text || chatLoading) return;
    setChatError(null);
    const next = [...messages, { role: 'user' as const, content: text }];
    setMessages(next);
    setInput('');
    setChatLoading(true);
    try {
      const res = await fetch('/api/studio/brain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videos, messages: next }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'AI Brain failed');
      setMessages([...next, { role: 'assistant', content: json.reply }]);
    } catch (err) {
      setChatError(err instanceof Error ? err.message : 'AI Brain failed');
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <SectionCard title="Create AI Brain" icon="" open={open} onToggle={onToggle}>
      <div className="space-y-5">
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Add more YouTube links (one per line) to build a combined knowledge base, then ask
          questions across all of them — “What are the common ideas?”, “Compare video 1 and 3.”
        </p>

        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-800 dark:bg-zinc-800/40">
          <p className="font-medium text-zinc-700 dark:text-zinc-200">In this brain ({videos.length}):</p>
          <ul className="mt-1 list-disc pl-5 text-zinc-500 dark:text-zinc-400">
            {videos.map((v, i) => (
              <li key={i} className="truncate">{v.title}</li>
            ))}
          </ul>
        </div>

        <textarea
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          rows={3}
          placeholder={'https://www.youtube.com/watch?v=…\nhttps://youtu.be/…'}
          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />

        <div className="flex items-center gap-3">
          <Button onClick={build} disabled={building}>
            {building ? 'Building…' : ready ? 'Rebuild brain' : 'Create AI Brain'}
          </Button>
          {ready && <span className="text-sm text-green-600">Brain ready — ask below.</span>}
        </div>

        {buildError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
            {buildError}
          </div>
        )}

        {ready && (
          <div className="space-y-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <div className="space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={'flex ' + (m.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div
                    className={
                      'max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm ' +
                      (m.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'border border-zinc-200 bg-zinc-50 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100')
                    }
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <TypingDots label={`thinking across ${videos.length} videos…`} />
              )}
            </div>

            {chatError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                {chatError}
              </div>
            )}

            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Ask across all videos…"
                className="flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
              <button
                onClick={send}
                disabled={chatLoading || !input.trim()}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
