'use client';

import { useMemo, useState } from 'react';
import Sidebar from '@/components/workspace/Sidebar';
import ToolPanel from '@/components/workspace/ToolPanel';
import Composer from '@/components/workspace/Composer';
import Progress from '@/components/workspace/Progress';
import ChatThread from '@/components/workspace/ChatThread';
import SignOutButton from '@/components/SignOutButton';
import { CloseIcon } from '@/components/workspace/icons';
import type { ChatMessage, Source, SourceType, ToolType } from '@/components/workspace/types';

function isYouTube(url: string) {
  return /youtube\.com|youtu\.be/i.test(url);
}

export default function StudioPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [activeTool, setActiveTool] = useState<ToolType | null>(null);
  const [mobileTools, setMobileTools] = useState(false);

  const updateSource = (id: string, patch: Partial<Source>) =>
    setSources((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const removeSource = (id: string) =>
    setSources((prev) => prev.filter((s) => s.id !== id));

  const readyContext = useMemo(
    () =>
      sources
        .filter((s) => s.status === 'ready' && s.content.trim())
        .map((s) => `### ${s.title}\n${s.content}`)
        .join('\n\n'),
    [sources]
  );

  async function ingestUrl(url: string) {
    const type: SourceType = isYouTube(url) ? 'youtube' : 'website';
    const id = crypto.randomUUID();
    setSources((s) => [
      ...s,
      {
        id,
        type,
        url,
        title: url,
        content: '',
        status: 'processing',
        progress: 10,
        stage: 'Starting…',
      },
    ]);

    try {
      if (type === 'youtube') {
        updateSource(id, { stage: 'Fetching video details', progress: 30 });
        const meta = await fetch('/api/studio/metadata', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        })
          .then((r) => r.json())
          .catch(() => ({}));
        if (meta?.title) updateSource(id, { title: meta.title, author: meta?.author });

        updateSource(id, { stage: 'Retrieving transcript', progress: 60 });
        const trans = await fetch('/api/studio/transcript', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        }).then((r) => r.json());
        if (!trans?.transcript)
          throw new Error(trans?.error || 'No transcript available for this video.');

        updateSource(id, {
          content: trans.transcript,
          status: 'ready',
          progress: 100,
          stage: 'Ready',
        });
      } else {
        updateSource(id, { stage: 'Fetching page', progress: 45 });
        const res = await fetch('/api/ingest/web', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        }).then((r) => r.json());
        if (!res?.text) throw new Error(res?.error || 'Could not read this page.');

        updateSource(id, {
          title: res.title || url,
          content: res.text,
          status: 'ready',
          progress: 100,
          stage: 'Ready',
        });
      }
    } catch (e) {
      updateSource(id, {
        status: 'error',
        progress: 0,
        error: e instanceof Error ? e.message : 'Processing failed.',
      });
    }
  }

  async function ingestPdf(file: File) {
    const id = crypto.randomUUID();
    setSources((s) => [
      ...s,
      {
        id,
        type: 'pdf',
        title: file.name,
        content: '',
        status: 'processing',
        progress: 15,
        stage: 'Uploading PDF',
      },
    ]);

    try {
      const form = new FormData();
      form.append('file', file);
      updateSource(id, { stage: 'Parsing PDF', progress: 55 });
      const res = await fetch('/api/ingest/pdf', { method: 'POST', body: form }).then((r) =>
        r.json()
      );
      if (!res?.text) throw new Error(res?.error || 'Could not extract text from this PDF.');

      updateSource(id, {
        title: res.title || file.name,
        content: res.text,
        status: 'ready',
        progress: 100,
        stage: 'Ready',
      });
    } catch (e) {
      updateSource(id, {
        status: 'error',
        progress: 0,
        error: e instanceof Error ? e.message : 'PDF processing failed.',
      });
    }
  }

  async function sendChat(text: string) {
    const ctx =
      readyContext.length >= 20
        ? readyContext
        : 'No sources have been added yet. The user is chatting without an uploaded knowledge base.';
    const next: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages([...next, { role: 'assistant', content: '' }]);

    try {
      const r = await fetch('/api/studio/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: ctx,
          title: 'Your knowledge base',
          messages: next,
        }),
      });
      const j = await r.json();
      const reply = r.ok ? (j.reply as string) : ((j.error as string) || 'Request failed.');
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: 'assistant', content: reply };
        return copy;
      });
    } catch (e) {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: 'assistant',
          content: `Error: ${e instanceof Error ? e.message : 'failed'}`,
        };
        return copy;
      });
    }
  }

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    setInput('');
    if (/^https?:\/\//i.test(text)) ingestUrl(text);
    else sendChat(text);
  }

  const hasActivity = sources.length > 0 || messages.length > 0;
  const processing = sources.filter((s) => s.status === 'processing').length;

  return (
    <div className="ws-surface ws-app-bg flex h-screen flex-col">
      <header className="flex shrink-0 items-center justify-between border-b border-white/10 bg-white/[0.03] px-5 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <span className="text-[15px] font-semibold tracking-tight text-white">
            AI Brain
          </span>
          <span className="ml-1 hidden rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-zinc-400 sm:inline">
            Workspace
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="ws-btn-ghost py-2"
            onClick={() => {
              setSources([]);
              setMessages([]);
            }}
          >
            New
          </button>
          <button
            type="button"
            className="ws-btn-ghost py-2 lg:hidden"
            onClick={() => setMobileTools(true)}
          >
            Tools
          </button>
          <SignOutButton className="border border-white/10 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-white/[0.06]" />
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="ws-scroll flex-1 overflow-y-auto">
            {!hasActivity ? (
              <div className="mx-auto flex max-w-2xl flex-col items-center px-6 pt-24 text-center ws-animate-rise">
                <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  What do you want to learn today?
                </h1>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-zinc-400">
                  Paste YouTube links, add a website, or upload a PDF. Everything becomes
                  one knowledge base you can summarize, turn into a podcast, chat with, or
                  build into an AI system.
                </p>
              </div>
            ) : (
              <div className="mx-auto w-full max-w-3xl px-4">
                {sources.length > 0 && (
                  <section className="space-y-3 pt-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-semibold text-zinc-200">Knowledge base</h2>
                      <span className="text-xs text-zinc-500">
                        {sources.filter((s) => s.status === 'ready').length} ready
                        {processing > 0
                          ? ` · ${processing} processing`
                          : ''}
                      </span>
                    </div>
                    {sources.map((s) => (
                      <Progress key={s.id} source={s} onRemove={removeSource} />
                    ))}
                  </section>
                )}
                <ChatThread messages={messages} />
              </div>
            )}
          </div>

          <div className="shrink-0 border-t border-white/10 bg-white/[0.02] px-4 py-4 backdrop-blur-xl">
            <div className="mx-auto max-w-3xl">
              <Composer
                value={input}
                onChange={setInput}
                onSend={handleSend}
                onPdf={ingestPdf}
                onWebsite={ingestUrl}
                onYouTubeConfirm={(urls) => urls.forEach((u) => ingestUrl(u))}
              />
            </div>
          </div>
        </main>
      </div>

      {mobileTools && (
        <div className="fixed inset-0 z-40 flex justify-end ws-animate-fade lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileTools(false)}
          />
          <div className="ws-surface ws-app-bg relative h-full w-[88%] max-w-sm border-l border-white/10 shadow-2xl ws-animate-drawer">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <span className="text-sm font-semibold text-white">Tools</span>
              <button
                type="button"
                onClick={() => setMobileTools(false)}
                aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-lg text-zinc-400 transition hover:bg-white/10 hover:text-white"
              >
                <CloseIcon width={16} height={16} />
              </button>
            </div>
            <Sidebar
              sources={sources}
              onSelect={(t) => {
                setActiveTool(t);
                setMobileTools(false);
              }}
            />
          </div>
        </div>
      )}

      {activeTool && (
        <ToolPanel tool={activeTool} sources={sources} onClose={() => setActiveTool(null)} />
      )}
    </div>
  );
}
