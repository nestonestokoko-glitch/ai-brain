/**
 * Video preview + transcript helper for the Studio.
 *
 * Combines two reliable, keyless-where-possible sources:
 *   - YouTube oEmbed  → title, channel (author), thumbnail  (NO API key needed)
 *   - Apify transcript → full transcript text + language    (see lib/apify.ts)
 *
 * The YouTube Data API key is absent in this project, so duration and chapters are
 * BEST-EFFORT: we estimate duration from the transcript length and, if the transcript
 * comes back with timestamped segments, we surface a simple chapter list. This avoids
 * a hard dependency on a missing key.
 */

import { fetchYoutubeTranscript } from './apify';

export interface VideoChapter {
  start_time: number;
  title: string;
}

export interface VideoPreview {
  url: string;
  videoId: string;
  title: string;
  author: string | null;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
  transcript: string;
  language: string | null;
  chapters: VideoChapter[];
}

/** Thrown when we can't get a transcript (private video, no captions, etc.). */
export class TranscriptUnavailableError extends Error {}

/**
 * Validate a YouTube URL and extract its video id.
 *
 * Handles the common share/embed forms:
 *   - https://www.youtube.com/watch?v=<id>            (also m.youtube.com)
 *   - https://youtu.be/<id>                            (the standard "Share" short link)
 *   - https://youtube.com/shorts/<id> | /embed/<id> | /v/<id> | /live/<id>
 * Trailing share params (?si=…) and extra path segments are ignored.
 */
export function parseYouTubeUrl(url: string): { videoId: string } | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^(www|m)\./, '');
    const isYouTube = /(^|\.)youtube\.com$/.test(host) || host === 'youtu.be';
    if (!isYouTube) return null;

    // youtu.be/<id> — the id is the first path segment.
    if (host === 'youtu.be') {
      const id = parsed.pathname.slice(1).split('/')[0];
      return id ? { videoId: id } : null;
    }

    // youtube.com/watch?v=<id>
    const v = parsed.searchParams.get('v');
    if (v) return { videoId: v };

    // youtube.com/shorts/<id> | /embed/<id> | /v/<id> | /live/<id>
    const m = parsed.pathname.match(/\/(?:shorts|embed|v|live)\/([^/?]+)/);
    if (m) return { videoId: m[1] };

    return null;
  } catch {
    return null;
  }
}

function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = h > 0 ? String(m).padStart(2, '0') : String(m);
  const ss = String(sec).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function formatTimestamp(totalSeconds: number): string {
  return formatDuration(totalSeconds);
}

/** Best-effort duration: estimate from transcript word count (~150 wpm). */
function estimateDuration(transcript: string): number {
  const words = transcript.trim().split(/\s+/).filter(Boolean).length;
  return Math.round((words / 150) * 60);
}

export async function getVideoMetadata(url: string) {
  const parsed = parseYouTubeUrl(url);
  if (!parsed) {
    throw new Error('Please enter a valid YouTube URL.');
  }
  const { videoId } = parsed;

  // 1) Metadata via oEmbed (keyless). Degrade gracefully if it fails.
  let title = 'Untitled video';
  let author: string | null = null;
  let thumbnailUrl: string | null = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  try {
    const oembed = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    );
    if (oembed.ok) {
      const data = (await oembed.json()) as {
        title?: string;
        author_name?: string;
        thumbnail_url?: string;
      };
      if (data.title) title = data.title;
      if (data.author_name) author = data.author_name;
      if (data.thumbnail_url) thumbnailUrl = data.thumbnail_url;
    }
  } catch (err) {
    console.warn('[video] oEmbed failed, using defaults:', (err as Error).message);
  }

  return {
    url,
    videoId,
    title,
    author,
    thumbnailUrl,
  };
}

export async function getVideoTranscript(url: string) {
  // 2) Transcript via Apify.
  let transcript: string;
  let language: string | null = null;
  let title: string | null = null;
  try {
    const result = await fetchYoutubeTranscript(url);
    if (!result.transcript) {
      throw new TranscriptUnavailableError(
        'We could not retrieve a transcript for this video (it may be private, have no captions, or be region-restricted).'
      );
    }
    transcript = result.transcript;
    language = result.language ?? null;
    title = result.title ?? null;
  } catch (err) {
    if (err instanceof TranscriptUnavailableError) throw err;
    throw new TranscriptUnavailableError(
      'We could not retrieve a transcript for this video right now. Please try again.'
    );
  }

  const durationSeconds = estimateDuration(transcript);
  const chapters: VideoChapter[] = []; // No reliable source without the Data API.

  return {
    transcript,
    language,
    durationSeconds,
    chapters,
    title,
  };
}
