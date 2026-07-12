/**
 * POST /api/youtube/transcript
 *
 * Fetches a YouTube transcript via Apify and returns it as clean JSON.
 *
 * ── Request ──────────────────────────────────────────────────────────────────
 *   Content-Type: application/json
 *   Body:        { "url": "https://www.youtube.com/watch?v=..." }
 *
 * ── Response (200) ───────────────────────────────────────────────────────────
 *   {
 *     "url": "https://www.youtube.com/watch?v=...",
 *     "title": "Video title" | null,
 *     "transcript": "full transcript text",
 *     "language": "en" | null
 *   }
 *
 * ── Errors ───────────────────────────────────────────────────────────────────
 *   400  missing / invalid / non-YouTube URL, or malformed JSON body
 *   500  Apify token missing, actor run failed, or no transcript produced
 *
 * ── How to test (from the project root, with `npm run dev` running) ────────────
 *   curl -X POST http://localhost:3000/api/youtube/transcript \
 *     -H "Content-Type: application/json" \
 *     -d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
 */

import { NextResponse } from 'next/server';
import { fetchYoutubeTranscript } from '@/lib/apify';
import { requireUser } from '@/lib/session';

/** Loose check that the URL points at YouTube. We don't extract the ID here. */
function isValidYouTubeUrl(url: unknown): url is string {
  if (typeof url !== 'string' || !url.trim()) return false;
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === 'http:' ||
      parsed.protocol === 'https:'
    ) &&
      /(^|\.)youtube\.com$|^youtu\.be$/.test(parsed.hostname);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const { response } = await requireUser();
  if (response) return response;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const url = (body as { url?: unknown })?.url;

  if (!isValidYouTubeUrl(url)) {
    return NextResponse.json(
      { error: 'A valid YouTube URL is required (e.g. https://www.youtube.com/watch?v=...).' },
      { status: 400 }
    );
  }

  try {
    console.log(`[api/youtube/transcript] Received request for url=${url}`);
    const result = await fetchYoutubeTranscript(url);
    console.log(`[api/youtube/transcript] Success for url=${url}`);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[api/youtube/transcript] Failed for url=${url}: ${message}`);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
