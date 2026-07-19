import { NextResponse } from 'next/server';
import { getVideoTranscript, TranscriptUnavailableError } from '@/lib/video';
import { protectApi } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const denied = await protectApi();
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const url = (body as { url?: unknown })?.url;
  if (typeof url !== 'string' || !url.trim()) {
    return NextResponse.json({ error: 'A YouTube URL is required.' }, { status: 400 });
  }

  try {
    console.log(`[studio/transcript] Fetching transcript for url=${url}`);
    const transcriptData = await getVideoTranscript(url);
    console.log(`[studio/transcript] OK len=${transcriptData.transcript.length}`);
    return NextResponse.json(transcriptData, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (err instanceof TranscriptUnavailableError) {
      console.warn(`[studio/transcript] transcript unavailable: ${message}`);
      return NextResponse.json({ error: message }, { status: 422 });
    }
    console.error(`[studio/transcript] failed: ${message}`);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
