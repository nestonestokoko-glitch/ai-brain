import { NextResponse } from 'next/server';
import { getYouTubeVideoData } from '@/lib/youtube';
import { insertContent } from '@/lib/storage';
import { requireUser } from '@/lib/session';

export async function POST(request: Request) {
  const { response } = await requireUser();
  if (response) return response;
  const { url } = await request.json();

  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const videoData = await getYouTubeVideoData(url);

    const record = await insertContent({
      source_url: url,
      source_type: 'youtube',
      title: videoData.title,
      description: videoData.description,
      author: videoData.author,
      duration_seconds: videoData.duration_seconds,
      transcript: videoData.transcript,
      metadata: {
        video_id: videoData.videoId,
        published_at: videoData.published_at,
        thumbnail_url: videoData.thumbnail_url,
        chapters: videoData.chapters,
        segments: videoData.segments,
      },
    });

    return NextResponse.json({
      success: true,
      content_id: record.id,
      data: record,
    });
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    // This is a server-side failure (e.g. storage/DB), not a client input
    // problem — return 500 so the client shows the real message.
    return NextResponse.json({ error }, { status: 500 });
  }
}