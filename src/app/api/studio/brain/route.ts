/**
 * POST /api/studio/brain
 * Answers questions across MULTIPLE videos (an "AI Brain" built from several transcripts).
 * Conversation history is sent by the client (no server-side state).
 *
 * Body: {
 *   "videos": [{ "url": string, "title": string, "transcript": string }],
 *   "messages?": [{ role, content }]
 * }
 * 200:  { reply: string }
 * 400:  missing/invalid videos or messages
 * 500:  AI failure
 */
import { NextResponse } from 'next/server';
import { chatCompletion, type ChatMessage } from '@/lib/ai';
import { protectApi } from '@/lib/supabase/server';

interface BrainVideo {
  url?: string;
  title?: string;
  transcript?: string;
}

export async function POST(request: Request) {
  const denied = await protectApi();
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const { videos, messages } = (body ?? {}) as {
    videos?: unknown;
    messages?: unknown;
  };

  if (!Array.isArray(videos) || videos.length === 0) {
    return NextResponse.json({ error: 'At least one video is required.' }, { status: 400 });
  }

  const cleanedVideos: BrainVideo[] = videos
    .filter(
      (v): v is BrainVideo =>
        !!v && typeof (v as BrainVideo).transcript === 'string' && (v as BrainVideo).transcript!.length >= 20
    )
    .map((v) => ({
      url: typeof v.url === 'string' ? v.url : undefined,
      title: typeof v.title === 'string' ? v.title : undefined,
      transcript: v.transcript as string,
    }));

  if (cleanedVideos.length === 0) {
    return NextResponse.json({ error: 'No videos with a usable transcript were provided.' }, { status: 400 });
  }

  const cleanedMessages: ChatMessage[] = Array.isArray(messages)
    ? messages
        .filter(
          (m): m is ChatMessage =>
            !!m &&
            typeof (m as ChatMessage).content === 'string' &&
            ((m as ChatMessage).role === 'user' || (m as ChatMessage).role === 'assistant')
        )
        .map((m) => ({ role: m.role, content: m.content }))
    : [];

  if (cleanedMessages.length === 0) {
    return NextResponse.json({ error: 'At least one message is required.' }, { status: 400 });
  }

  // Build a labelled knowledge base from all transcripts.
  const knowledge = cleanedVideos
    .map(
      (v, i) =>
        `### Video ${i + 1}${v.title ? `: ${v.title}` : ''}${
          v.url ? ` (${v.url})` : ''
        }\n${v.transcript}`
    )
    .join('\n\n');

  const system = `You are the user's "AI Brain" — an assistant that reasons across a collection of ${
    cleanedVideos.length
  } YouTube video(s). Use ONLY the transcripts below as your source. When comparing or synthesizing, reference which video(s) an idea comes from (e.g. "In Video 1..."). If something isn't covered, say so. Be insightful and well-structured.`;

  const full: ChatMessage[] = [
    { role: 'system', content: `${system}\n\n--- KNOWLEDGE BASE START ---\n${knowledge}\n--- KNOWLEDGE BASE END ---` },
    ...cleanedMessages,
  ];

  try {
    const reply = await chatCompletion(full, { temperature: 0.4, maxTokens: 1200 });
    return NextResponse.json({ reply }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[studio/brain] failed: ${message}`);
    return NextResponse.json({ error: `AI Brain failed: ${message}` }, { status: 500 });
  }
}
