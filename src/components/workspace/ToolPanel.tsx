'use client';

import { useMemo, useState, type ReactElement, type ReactNode } from 'react';
import { TOOLS, type Source, type ToolType, type ChatMessage } from './types';
import {
  SummarizeIcon,
  PodcastIcon,
  ChatIcon,
  BrainIcon,
  CloseIcon,
  SendIcon,
  CheckIcon,
  YouTubeIcon,
  WebsiteIcon,
  PdfIcon,
  Dots,
} from './icons';

const toolIcon: Record<string, (p: { width?: number; height?: number }) => ReactElement> = {
  summarize: SummarizeIcon,
  podcast: PodcastIcon,
  chat: ChatIcon,
  brain: BrainIcon,
};

function SourceIcon({ type }: { type: Source['type'] }) {
  if (type === 'youtube') return <YouTubeIcon width={16} height={16} className="shrink-0 text-red-400" />;
  if (type === 'website') return <WebsiteIcon width={16} height={16} className="shrink-0 text-sky-300" />;
  return <PdfIcon width={16} height={16} className="shrink-0 text-violet-300" />;
}

function Hint({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <p className="max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center text-sm leading-relaxed text-zinc-400">
        {children}
      </p>
    </div>
  );
}

export default function ToolPanel({
  tool,
  sources,
  onClose,
}: {
  tool: ToolType | null;
  sources: Source[];
  onClose: () => void;
}) {
  const meta = TOOLS.find((t) => t.id === tool);
  const readyVideos = useMemo(
    () => sources.filter((s) => s.type === 'youtube' && s.status === 'ready' && s.content.trim().length > 0),
    [sources]
  );
  const allReady = useMemo(
    () => sources.filter((s) => s.status === 'ready' && s.content.trim().length > 0),
    [sources]
  );

  if (!tool || !meta) return null;
  const Icon = toolIcon[meta.icon];

  return (
    <div className="fixed inset-0 z-50 flex justify-end ws-animate-fade">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="ws-surface ws-app-bg relative flex h-full w-full max-w-xl flex-col border-l border-white/10 shadow-2xl ws-animate-drawer">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <span
              className="grid h-10 w-10 place-items-center rounded-xl text-blue-200"
              style={{
                background:
                  'linear-gradient(135deg, rgba(37,99,235,0.3), rgba(79,70,229,0.2))',
                border: '1px solid rgba(96,130,255,0.3)',
              }}
            >
              <Icon width={20} height={20} />
            </span>
            <div>
              <h3 className="text-base font-semibold text-white">{meta.title}</h3>
              <p className="text-xs text-zinc-400">{meta.description}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-lg text-zinc-400 transition hover:bg-white/10 hover:text-white"
          >
            <CloseIcon width={18} height={18} />
          </button>
        </div>

        <div className="ws-scroll flex-1 overflow-y-auto px-6 py-5">
          {tool === 'summarize' || tool === 'podcast' ? (
            <SummarizePodcastPanel tool={tool} videos={readyVideos} />
          ) : (
            <ChatBrainPanel
              tool={tool}
              pool={tool === 'brain' ? allReady : readyVideos}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function SummarizePodcastPanel({
  tool,
  videos,
}: {
  tool: 'summarize' | 'podcast';
  videos: Source[];
}) {
  const isPodcast = tool === 'podcast';
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(videos.map((v) => v.id))
  );
  const [results, setResults] = useState<
    { id: string; title: string; data?: Record<string, unknown>; error?: string }[]
  >([]);
  const [phase, setPhase] = useState<'select' | 'running' | 'done'>('select');
  const [activeId, setActiveId] = useState<string | null>(null);

  if (videos.length === 0) {
    return (
      <Hint>
        Process YouTube videos in the workspace first, then open this to{' '}
        {isPodcast ? 'turn them into podcast material' : 'summarize them'}.
      </Hint>
    );
  }

  const toggle = (id: string) =>
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const allOn = selected.size === videos.length;
  const toggleAll = () => setSelected(allOn ? new Set() : new Set(videos.map((v) => v.id)));
  const chosen = videos.filter((v) => selected.has(v.id));

  async function run() {
    if (!chosen.length) return;
    setPhase('running');
    setResults([]);
    for (const v of chosen) {
      setActiveId(v.id);
      try {
        const r = await fetch(isPodcast ? '/api/studio/podcast' : '/api/studio/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcript: v.content, title: v.title }),
        });
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || 'Request failed.');
        setResults((prev) => [...prev, { id: v.id, title: v.title, data: j }]);
      } catch (e) {
        setResults((prev) => [
          ...prev,
          { id: v.id, title: v.title, error: e instanceof Error ? e.message : 'Failed' },
        ]);
      }
    }
    setActiveId(null);
    setPhase('done');
  }

  return (
    <div className="space-y-5">
      <div className="ws-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-white">
            {isPodcast ? 'Select videos to podcast' : 'Select videos to summarize'}
          </h4>
          <button
            type="button"
            onClick={toggleAll}
            className="text-xs font-medium text-blue-300 transition hover:text-blue-200"
          >
            {allOn ? 'Clear all' : 'Select all'}
          </button>
        </div>
        <div className="space-y-2">
          {videos.map((v) => {
            const on = selected.has(v.id);
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => toggle(v.id)}
                className={
                  'flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ' +
                  (on
                    ? 'border-blue-500/50 bg-blue-500/10'
                    : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]')
                }
              >
                <span
                  className={
                    'grid h-5 w-5 shrink-0 place-items-center rounded-md border ' +
                    (on
                      ? 'border-blue-400 bg-blue-500 text-white'
                      : 'border-white/20 text-transparent')
                  }
                >
                  {on && <CheckIcon width={13} height={13} />}
                </span>
                <YouTubeIcon width={16} height={16} className="shrink-0 text-red-400" />
                <span className="min-w-0 flex-1 truncate text-sm text-zinc-200">{v.title}</span>
                {phase === 'running' && activeId === v.id && (
                  <span className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-white/20 border-t-blue-400" />
                )}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={run}
          disabled={phase === 'running' || !chosen.length}
          className="ws-btn-primary mt-4 w-full py-3"
        >
          {phase === 'running'
            ? 'Processing…'
            : (isPodcast ? 'Create podcast material' : 'Summarize') +
              (chosen.length > 1 ? ` (${chosen.length})` : '')}
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-5">
          <h4 className="text-sm font-semibold text-white">Results</h4>
          {results.map((r) => (
            <div key={r.id} className="ws-card ws-animate-rise p-5">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-blue-300">
                {r.title}
              </p>
              {r.error ? (
                <p className="text-sm text-red-400">{r.error}</p>
              ) : isPodcast ? (
                <PodcastResult data={r.data!} />
              ) : (
                <SummaryResult data={r.data!} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ChatBrainPanel({
  tool,
  pool,
}: {
  tool: 'chat' | 'brain';
  pool: Source[];
}) {
  const isBrain = tool === 'brain';
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(pool.map((s) => s.id))
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [showSources, setShowSources] = useState(true);

  if (pool.length === 0) {
    return (
      <Hint>
        {isBrain
          ? 'Add videos, PDFs, or websites to build an AI system from them.'
          : 'Process YouTube videos in the workspace, then chat with them here.'}
      </Hint>
    );
  }

  const toggle = (id: string) =>
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const allOn = selected.size === pool.length;
  const toggleAll = () => setSelected(allOn ? new Set() : new Set(pool.map((s) => s.id)));
  const chosen = pool.filter((s) => selected.has(s.id));

  async function send() {
    const text = input.trim();
    if (!text || busy || !chosen.length) return;
    const next: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setBusy(true);
    try {
      let endpoint: string;
      let body: unknown;
      if (chosen.length === 1) {
        endpoint = '/api/studio/chat';
        body = {
          transcript: chosen[0].content,
          title: chosen[0].title,
          messages: next,
        };
      } else {
        endpoint = '/api/studio/brain';
        body = {
          videos: chosen.map((s) => ({
            url: s.url,
            title: s.title,
            transcript: s.content,
          })),
          messages: next,
        };
      }
      const r = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Request failed.');
      setMessages([...next, { role: 'assistant', content: j.reply as string }]);
    } catch (e) {
      setMessages([
        ...next,
        {
          role: 'assistant',
          content: `Error: ${e instanceof Error ? e.message : 'failed'}`,
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="ws-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-white">
            {isBrain ? 'Knowledge sources' : 'Videos in context'}
          </h4>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleAll}
              className="text-xs font-medium text-blue-300 transition hover:text-blue-200"
            >
              {allOn ? 'Clear all' : 'Select all'}
            </button>
            <button
              type="button"
              onClick={() => setShowSources((s) => !s)}
              className="text-xs font-medium text-zinc-400 transition hover:text-white"
            >
              {showSources ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        {showSources && (
          <div className="space-y-2">
            {pool.map((s) => {
              const on = selected.has(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggle(s.id)}
                  className={
                    'flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition ' +
                    (on
                      ? 'border-blue-500/50 bg-blue-500/10'
                      : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]')
                  }
                >
                  <span
                    className={
                      'grid h-5 w-5 shrink-0 place-items-center rounded-md border ' +
                      (on
                        ? 'border-blue-400 bg-blue-500 text-white'
                        : 'border-white/20 text-transparent')
                    }
                  >
                    {on && <CheckIcon width={13} height={13} />}
                  </span>
                  <SourceIcon type={s.type} />
                  <span className="min-w-0 flex-1 truncate text-sm text-zinc-200">{s.title}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="ws-card flex min-h-0 flex-1 flex-col p-4">
        <div className="ws-scroll min-h-0 flex-1 space-y-4 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-zinc-400">
              Ask anything about the selected {isBrain ? 'sources' : 'videos'}.
            </p>
          ) : (
            messages.map((m, i) => (
              <div key={i} className="ws-animate-rise">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
                  {m.role === 'user' ? 'You' : isBrain ? 'AI System' : 'Assistant'}
                </p>
                <div
                  className={
                    'whitespace-pre-wrap rounded-2xl px-4 py-3 text-[15px] leading-relaxed ' +
                    (m.role === 'user'
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white'
                      : 'border border-white/10 bg-white/[0.03] text-zinc-100')
                  }
                >
                  {m.content ? m.content : <Dots />}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-3 flex items-end gap-2 border-t border-white/10 pt-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={2}
            placeholder={isBrain ? 'Ask your AI system…' : 'Ask about the video(s)…'}
            className="ws-input resize-none"
          />
          <button
            type="button"
            onClick={send}
            disabled={!input.trim() || busy || !chosen.length}
            className="ws-btn-primary px-5 py-3"
          >
            <SendIcon width={16} height={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryResult({ data }: { data: Record<string, unknown> }) {
  const takeaways = (data.keyTakeaways as string[]) ?? [];
  const timestamps = (data.timestamps as { t: number; label: string }[]) ?? [];
  const actions = (data.actionItems as string[]) ?? [];
  const fmt = (t: number) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="ws-animate-rise space-y-6">
      <section>
        <h4 className="mb-2 text-sm font-semibold text-white">Short summary</h4>
        <p className="text-[15px] leading-relaxed text-zinc-300">{data.short as string}</p>
      </section>
      <section>
        <h4 className="mb-2 text-sm font-semibold text-white">Detailed notes</h4>
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-zinc-300">
          {data.detailed as string}
        </p>
      </section>
      {takeaways.length > 0 && (
        <section>
          <h4 className="mb-2 text-sm font-semibold text-white">Key takeaways</h4>
          <ul className="space-y-1.5">
            {takeaways.map((t, i) => (
              <li key={i} className="flex gap-2 text-[15px] text-zinc-300">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      {timestamps.length > 0 && (
        <section>
          <h4 className="mb-2 text-sm font-semibold text-white">Important moments</h4>
          <ul className="space-y-1.5">
            {timestamps.map((t, i) => (
              <li key={i} className="flex gap-3 text-[15px] text-zinc-300">
                <span className="font-mono text-xs text-blue-300">{fmt(t.t)}</span>
                <span>{t.label}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      {actions.length > 0 && (
        <section>
          <h4 className="mb-2 text-sm font-semibold text-white">Action items</h4>
          <ul className="space-y-1.5">
            {actions.map((a, i) => (
              <li key={i} className="flex gap-2 text-[15px] text-zinc-300">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function PodcastResult({ data }: { data: Record<string, unknown> }) {
  const points = (data.discussionPoints as string[]) ?? [];
  const highlights = (data.highlights as string[]) ?? [];

  return (
    <div className="ws-animate-rise space-y-6">
      <section>
        <h4 className="mb-2 text-sm font-semibold text-white">Episode summary</h4>
        <p className="text-[15px] leading-relaxed text-zinc-300">
          {data.episodeSummary as string}
        </p>
      </section>
      <section>
        <h4 className="mb-2 text-sm font-semibold text-white">Show notes</h4>
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-zinc-300">
          {data.notes as string}
        </p>
      </section>
      {points.length > 0 && (
        <section>
          <h4 className="mb-2 text-sm font-semibold text-white">Discussion points</h4>
          <ul className="space-y-1.5">
            {points.map((p, i) => (
              <li key={i} className="flex gap-2 text-[15px] text-zinc-300">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      {highlights.length > 0 && (
        <section>
          <h4 className="mb-2 text-sm font-semibold text-white">Highlights</h4>
          <ul className="space-y-1.5">
            {highlights.map((h, i) => (
              <li key={i} className="flex gap-2 text-[15px] text-zinc-300">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
