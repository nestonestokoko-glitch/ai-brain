/**
 * POST /api/studio/chat
 * Answers questions about a single video, given its transcript and the conversation so far.
 * Conversation history is sent by the client (no server-side state).
 *
 * Body: { "transcript": string, "title?": string, "messages": [{role, content}] }
 * 200:  { reply: string }
 * 400:  missing transcript or messages
 * 500:  AI failure
 */
import { NextResponse } from 'next/server';
import { chatCompletion, type ChatMessage } from '@/lib/ai';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const { transcript, title, messages } = (body ?? {}) as {
    transcript?: unknown;
    title?: string;
    messages?: unknown;
  };

  if (typeof transcript !== 'string' || transcript.trim().length < 20) {
    return NextResponse.json({ error: 'A transcript is required.' }, { status: 400 });
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'At least one message is required.' }, { status: 400 });
  }

  const cleaned: ChatMessage[] = messages
    .filter(
      (m): m is ChatMessage =>
        !!m &&
        typeof (m as ChatMessage).content === 'string' &&
        ((m as ChatMessage).role === 'user' || (m as ChatMessage).role === 'assistant')
    )
    .map((m) => ({ role: m.role, content: m.content }));

  if (cleaned.length === 0) {
    return NextResponse.json({ error: 'No valid messages provided.' }, { status: 400 });
  }

  const system = `You are "Chat with Video", an assistant that answers questions about a YouTube video${
    title ? ` titled "${title}"` : ''
  }. Use ONLY the provided transcript as your knowledge source. If the answer isn't in the transcript, say so honestly. Be concise, specific, and cite moments from the video when relevant.`;

  const full: ChatMessage[] = [
    {
      role: 'system',
      content: `${system}\n\n--- TRANSCRIPT START ---\n${transcript}\n--- TRANSCRIPT END ---`,
    },
    ...cleaned,
  ];

  try {
    const reply = await chatCompletion(full, { temperature: 0.3 });
    return NextResponse.json({ reply }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[studio/chat] failed: ${message}`);
    return NextResponse.json({ error: `Chat failed: ${message}` }, { status: 500 });
  }
}
