'use client';

import type { ReactElement } from 'react';
import { TOOLS, type Source, type ToolType } from './types';
import {
  SummarizeIcon,
  PodcastIcon,
  ChatIcon,
  BrainIcon,
  YouTubeIcon,
  WebsiteIcon,
  PdfIcon,
} from './icons';

const toolIcon: Record<string, (p: { width?: number; height?: number; className?: string }) => ReactElement> = {
  summarize: SummarizeIcon,
  podcast: PodcastIcon,
  chat: ChatIcon,
  brain: BrainIcon,
};

function Stat({
  icon: Icon,
  n,
  label,
}: {
  icon: (p: { width?: number; height?: number }) => ReactElement;
  n: number;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] py-2.5">
      <div className="mx-auto grid h-6 w-6 place-items-center text-blue-300">
        <Icon width={16} height={16} />
      </div>
      <div className="mt-1 text-base font-semibold text-white">{n}</div>
      <div className="text-[10px] uppercase tracking-wide text-zinc-500">{label}</div>
    </div>
  );
}

export default function Sidebar({
  sources,
  onSelect,
}: {
  sources: Source[];
  onSelect: (tool: ToolType) => void;
}) {
  const ready = sources.filter((s) => s.status === 'ready' && s.content.trim().length > 0);
  const processing = sources.filter((s) => s.status === 'processing').length;
  const readyVideos = ready.filter((s) => s.type === 'youtube').length;

  const counts = {
    youtube: sources.filter((s) => s.type === 'youtube').length,
    website: sources.filter((s) => s.type === 'website').length,
    pdf: sources.filter((s) => s.type === 'pdf').length,
  };

  return (
    <div className="ws-scroll flex h-full flex-col gap-4 overflow-y-auto p-4">
      <div className="ws-card p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Knowledge base</h2>
          {processing > 0 && (
            <span className="ws-chip !border-blue-500/40 !text-blue-300">{processing} processing</span>
          )}
        </div>
        <p className="mt-1 text-xs text-zinc-500">
          Resources stay available while you work.
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <Stat icon={YouTubeIcon} n={counts.youtube} label="Videos" />
          <Stat icon={WebsiteIcon} n={counts.website} label="Sites" />
          <Stat icon={PdfIcon} n={counts.pdf} label="PDFs" />
        </div>
        {ready.length === 0 && (
          <p className="mt-3 rounded-xl border border-dashed border-white/10 px-3 py-2.5 text-xs text-zinc-500">
            Add YouTube links, a website, or a PDF to get started.
          </p>
        )}
      </div>

      <div className="px-1">
        <h2 className="text-sm font-semibold text-white">Actions</h2>
        <p className="text-xs text-zinc-500">Run on what you have already processed.</p>
      </div>

      <div className="flex flex-col gap-3">
        {TOOLS.map((tool) => {
          const Icon = toolIcon[tool.icon];
          const showCount = tool.id === 'summarize' || tool.id === 'podcast';
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => onSelect(tool.id)}
              className="ws-card group flex items-start gap-3 p-4 text-left transition hover:-translate-y-0.5 hover:border-blue-500/40"
            >
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-blue-200"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(37,99,235,0.25), rgba(79,70,229,0.18))',
                  border: '1px solid rgba(96,130,255,0.25)',
                }}
              >
                <Icon width={20} height={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="text-[15px] font-semibold text-white">{tool.title}</span>
                  <span className="text-zinc-500 transition group-hover:translate-x-0.5 group-hover:text-blue-300">
                    →
                  </span>
                </span>
                <span className="mt-0.5 block text-[13px] leading-snug text-zinc-400">
                  {tool.description}
                </span>
                {showCount && (
                  <span className="mt-1.5 block text-[11px] text-zinc-500">
                    {readyVideos > 0
                      ? `${readyVideos} video${readyVideos !== 1 ? 's' : ''} ready`
                      : 'No videos yet'}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-auto px-1 pt-2 text-[11px] leading-relaxed text-zinc-600">
        Everything you add becomes one shared knowledge base — summarize, podcast,
        chat, or build an AI system without re-pasting links.
      </p>
    </div>
  );
}
