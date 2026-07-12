/**
 * Server-side Apify client for fetching YouTube transcripts.
 *
 * This module is the ONLY place that talks to Apify. It is meant to be imported
 * from route handlers / server code — never from client components — because it
 * relies on APIFY_TOKEN, which must stay server-side.
 *
 * ── Configuration (all via environment variables) ────────────────────────────
 *   APIFY_TOKEN            Your Apify API token.
 *                          Get it from: https://console.apify.com/settings/integrations
 *                          Put it in `.env.local` (already done for this project).
 *                          NEVER prefix it with NEXT_PUBLIC_ and NEVER send it to the browser.
 *
 *   APIFY_YOUTUBE_ACTOR_ID The Actor that scrapes the transcript.
 *                          Default: akash9078/youtube-transcript-scraper
 *                          Override it in `.env.local` to use a different actor.
 *
 * ── How it works ─────────────────────────────────────────────────────────────
 *   1. call() runs the actor and waits for it to finish (bounded by waitSecs).
 *   2. The actor writes its output to a default dataset.
 *   3. We read that dataset and return the first row we can normalise.
 */

import { ApifyClient } from 'apify-client';

/** Actor output normalised into the shape our app cares about. */
export interface TranscriptResult {
  url: string;
  title: string | null;
  transcript: string | null;
  language: string | null;
}

/** How long we wait for the actor run to finish, in seconds. */
const ACTOR_WAIT_SECS = 120;

function getToken(): string | undefined {
  return process.env.APIFY_TOKEN;
}

function getActorId(): string {
  // Falls back to the default transcript actor if the env var is missing.
  return process.env.APIFY_YOUTUBE_ACTOR_ID || 'akash9078/youtube-transcript-scraper';
}

/** Lazily create a single shared client (token is read at call time). */
function getClient(): ApifyClient {
  const token = getToken();
  if (!token) {
    throw new Error(
      'APIFY_TOKEN is not set. Add it to .env.local (see src/lib/apify.ts for details).'
    );
  }
  return new ApifyClient({ token });
}

/**
 * Best-effort extraction of plain transcript text from a single actor output row.
 * Different transcript actors return different shapes, so we check the common
 * field names and fall back to joining caption segments if needed.
 */
function extractTranscriptText(row: Record<string, unknown>): string | null {
  if (typeof row.transcript === 'string' && row.transcript.trim()) {
    return row.transcript.trim();
  }
  if (typeof row.text === 'string' && row.text.trim()) {
    return row.text.trim();
  }
  if (typeof row.captions === 'string' && row.captions.trim()) {
    return row.captions.trim();
  }

  // Some actors return an array of segments, e.g. [{ text }, { text }].
  const segments = row.segments ?? row.captionsSegments ?? row.subtitles;
  if (Array.isArray(segments)) {
    const joined = segments
      .map((s) => (typeof s === 'string' ? s : (s as { text?: unknown })?.text))
      .filter((t): t is string => typeof t === 'string' && Boolean(t.trim()))
      .join(' ')
      .trim();
    if (joined) return joined;
  }

  return null;
}

function extractString(row: Record<string, unknown>, ...keys: string[]): string | null {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return null;
}

/**
 * Run the configured Apify YouTube transcript actor for a single video URL and
 * return the normalised result.
 *
 * @param url The YouTube watch / short / youtu.be URL.
 * @throws Error if the token is missing, the actor fails, or no transcript is found.
 */
export async function fetchYoutubeTranscript(url: string): Promise<TranscriptResult> {
  const client = getClient();
  const actorId = getActorId();

  console.log(`[apify] Starting actor "${actorId}" for url=${url}`);

  // The akash9078/youtube-transcript-scraper actor expects `videoUrl`
  // (not `url`). Adjust the input key here if you switch actors.
  const run = await client.actor(actorId).call(
    { videoUrl: url },
    { waitSecs: ACTOR_WAIT_SECS }
  );

  console.log(
    `[apify] Actor run finished: runId=${run.id} status=${run.status} datasetId=${run.defaultDatasetId}`
  );

  if (run.status !== 'SUCCEEDED') {
    throw new Error(`Apify actor run did not succeed (status: ${run.status}).`);
  }

  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  console.log(`[apify] Dataset returned ${items.length} row(s).`);

  if (!items.length) {
    throw new Error('Apify actor finished but returned no data.');
  }

  // Normalise the first row. Many transcript actors emit exactly one row per run.
  const row = items[0] as Record<string, unknown>;

  const transcript = extractTranscriptText(row);
  if (!transcript) {
    throw new Error('Apify actor output did not contain a usable transcript.');
  }

  return {
    url,
    title: extractString(row, 'title', 'videoTitle', 'video_title', 'name'),
    transcript,
    language: extractString(row, 'language', 'lang', 'languageCode', 'langCode'),
  };
}
