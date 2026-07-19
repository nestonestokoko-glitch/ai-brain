import { NextResponse } from 'next/server';
import { getVideoMetadata } from '@/lib/video';
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
    console.log(`[studio/metadata] Fetching metadata for url=${url}`);
    const metadata = await getVideoMetadata(url);
    console.log(`[studio/metadata] OK title="${metadata.title?.slice(0, 50)}"`);
    return NextResponse.json(metadata, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.toLowerCase().includes('valid youtube')) {
      console.warn(`[studio/metadata] rejected url=${JSON.stringify(url)}: ${message}`);
      return NextResponse.json({ error: message }, { status: 400 });
    }
    console.error(`[studio/metadata] failed: ${message}`);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
