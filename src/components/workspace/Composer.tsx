'use client';

import { useRef, useState } from 'react';
import { RadialGlowButton } from '@/components/ui/radial-glow-button';
import {
  YouTubeIcon,
  WebsiteIcon,
  PdfIcon,
  CloseIcon,
  CheckIcon,
} from './icons';

function isYouTubeUrl(url: string) {
  return /youtube\.com|youtu\.be/i.test(url);
}

function parseYouTubeLinks(text: string): string[] {
  return text
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .filter(isYouTubeUrl);
}

type Mode = 'chat' | 'youtube' | 'website';

export default function Composer({
  value,
  onChange,
  onSend,
  onPdf,
  onWebsite,
  onYouTubeConfirm,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onPdf: (file: File) => void;
  onWebsite: (url: string) => void;
  onYouTubeConfirm: (urls: string[]) => void;
  disabled?: boolean;
}) {
  const [mode, setMode] = useState<Mode>('chat');
  const [ytText, setYtText] = useState('');
  const [web, setWeb] = useState('');
  const [ytError, setYtError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const canSend = !disabled && value.trim().length > 0;
  const ytLinks = parseYouTubeLinks(ytText);
  const canConfirm = ytLinks.length > 0;
  const canAddWeb = web.trim().length > 0;

  function confirmYouTube() {
    const links = parseYouTubeLinks(ytText);
    if (!links.length) {
      setYtError('Paste at least one YouTube link to continue.');
      return;
    }
    setYtError('');
    onYouTubeConfirm(links);
    setYtText('');
    setMode('chat');
  }

  function addWebsite() {
    const u = web.trim();
    if (!u) return;
    onWebsite(u);
    setWeb('');
    setMode('chat');
  }

  const pill = (active: boolean) =>
    'ws-btn-ghost py-2' + (active ? ' border-blue-500/50 bg-blue-500/10 text-white' : '');

  return (
    <div className="ws-card p-3">
      {mode === 'youtube' && (
        <div className="mb-3 ws-animate-rise">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-200">
              YouTube links
            </label>
            <button
              type="button"
              onClick={() => setMode('chat')}
              aria-label="Close"
              className="grid h-7 w-7 place-items-center rounded-lg text-zinc-400 transition hover:bg-white/10 hover:text-white"
            >
              <CloseIcon width={16} height={16} />
            </button>
          </div>
          <textarea
            value={ytText}
            onChange={(e) => {
              setYtText(e.target.value);
              setYtError('');
            }}
            rows={4}
            placeholder={'https://youtube.com/watch?v=abc\nhttps://youtu.be/xyz'}
            className="ws-input resize-none"
            autoFocus
          />
          {ytError && <p className="mt-1.5 text-xs text-red-400">{ytError}</p>}
          {ytText.trim() && !ytError && (
            <p className="mt-1.5 text-xs text-zinc-400">
              {ytLinks.length} link{ytLinks.length !== 1 ? 's' : ''} ready to process —
              all ingested in the background.
            </p>
          )}
        </div>
      )}

      {mode === 'website' && (
        <div className="mb-3 flex items-center gap-2 ws-animate-rise">
          <input
            type="url"
            value={web}
            onChange={(e) => setWeb(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addWebsite()}
            placeholder="https://example.com/article"
            className="ws-input flex-1 py-2.5"
            autoFocus
          />
          <button
            type="button"
            onClick={addWebsite}
            disabled={!canAddWeb}
            className="ws-btn-primary px-4 py-2.5"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setMode('chat')}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-xl text-zinc-400 transition hover:bg-white/10 hover:text-white"
          >
            <CloseIcon width={16} height={16} />
          </button>
        </div>
      )}

      {mode === 'chat' && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (canSend) onSend();
            }
          }}
          rows={3}
          placeholder="Ask anything, or add sources below to build your knowledge base."
          className="w-full resize-none bg-transparent px-2 py-2 text-[15px] leading-relaxed text-zinc-100 placeholder-zinc-500 outline-none"
        />
      )}

      <div className="mt-2 flex items-center justify-between gap-2 border-t border-white/10 pt-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMode(mode === 'youtube' ? 'chat' : 'youtube')}
            className={pill(mode === 'youtube')}
          >
            <YouTubeIcon width={16} height={16} /> YouTube
          </button>
          <button
            type="button"
            onClick={() => setMode(mode === 'website' ? 'chat' : 'website')}
            className={pill(mode === 'website')}
          >
            <WebsiteIcon width={16} height={16} /> Website
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="ws-btn-ghost py-2"
          >
            <PdfIcon width={16} height={16} /> PDF
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onPdf(f);
              e.target.value = '';
            }}
          />
        </div>

        {mode === 'chat' && (
          <RadialGlowButton type="button" onClick={onSend} disabled={!canSend}>
            Send
          </RadialGlowButton>
        )}
        {mode === 'youtube' && (
          <button
            type="button"
            onClick={confirmYouTube}
            disabled={!canConfirm}
            className="ws-btn-primary px-5 py-2"
          >
            <CheckIcon width={16} height={16} /> Confirm
          </button>
        )}
        {mode === 'website' && (
          <button
            type="button"
            onClick={addWebsite}
            disabled={!canAddWeb}
            className="ws-btn-primary px-5 py-2"
          >
            Add link
          </button>
        )}
      </div>
    </div>
  );
}
