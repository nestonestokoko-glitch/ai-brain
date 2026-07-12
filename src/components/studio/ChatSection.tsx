'use client';

import { useEffect, useRef, useState } from 'react';
import { SectionCard } from './SectionCard';
import { VideoData, ChatMsg } from './types';

export function ChatSection({
  video,
  open,
  onToggle,
}: {
  video: VideoData;
  open: boolean;
  onToggle: () => void;
}) {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typing, setTyping] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setError(null);
    const next = [...messages, { role: 'user' as const, content: text }];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/studio/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: video.transcript, title: video.title, messages: next }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Chat failed');
      const reply = json.reply as string;

      // Typewriter effect for a live, ChatGPT-like feel.
      setTyping('');
      for (let i = 0; i < reply.length; i++) {
        await new Promise((r) => setTimeout(r, 8));
        setTyping(reply.slice(0, i + 1));
      }
      setMessages([...next, { role: 'assistant', content: reply }]);
      setTyping('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chat failed');
    } finally {
      setLoading(false);
    }
  };

  const retryLast = () => {
    // Re-send the last user message.
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUser) {
      setMessages(messages.filter((_, i) => i < messages.length - (typing ? 0 : 1)));
      setInput(lastUser.content);
      setError(null);
    }
  };

  return (
    <SectionCard title="Chat With Video" icon="" open={open} onToggle={onToggle} error={error} onRetry={retryLast}>
      <div className="flex h-[28rem] flex-col">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto pr-1">
          {messages.length === 0 && !typing && (
            <div className="flex h-full items-center justify-center text-center text-sm text-zinc-500">
              Ask anything about this video — “What’s the main idea?”, “Explain this simply”, “Give me actionable advice.”
            </div>
          )}

          {messages.map((m, i) => (
            <Bubble key={i} role={m.role} content={m.content} />
          ))}
          {typing && <Bubble role="assistant" content={typing} />}
          {loading && !typing && (
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600" />
              thinking…
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Ask a follow-up question…"
            className="flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </SectionCard>
  );
}

function Bubble({ role, content }: { role: ChatMsg['role']; content: string }) {
  const isUser = role === 'user';
  return (
    <div className={'flex ' + (isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={
          'max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm ' +
          (isUser
            ? 'bg-blue-600 text-white'
            : 'border border-zinc-200 bg-zinc-50 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100')
        }
      >
        {content}
      </div>
    </div>
  );
}
