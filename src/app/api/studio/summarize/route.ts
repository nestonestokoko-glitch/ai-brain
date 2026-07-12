/**
 * POST /api/studio/summarize
 * Generates a structured summary of a video transcript.
 *
 * Body: { "transcript": string, "title?": string, "author?": string }
 * 200:  { short, detailed, keyTakeaways[], timestamps[{t,label}], actionItems[] }
 * 400:  missing transcript
 * 500:  AI failure
 */
import { NextResponse } from 'next/server';
import { chatCompletion, parseJson } from '@/lib/ai';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const { transcript, title, author } = (body ?? {}) as {
    transcript?: unknown;
    title?: string;
    author?: string;
  };

  if (typeof transcript !== 'string' || transcript.trim().length < 20) {
    return NextResponse.json(
      { error: 'A transcript of at least 20 characters is required.' },
      { status: 400 }
    );
  }

  const ctx = [
    title ? `Video title: ${title}` : null,
    author ? `Channel: ${author}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  const system = `You are a meticulous summarizer for a knowledge app. Given a YouTube video transcript${
    ctx ? `\n${ctx}` : ''
  }, produce a structured summary in JSON with these exact keys:
- "short": a 2-3 sentence plain-language summary.
- "detailed": a thorough 4-8 paragraph summary capturing the main arguments, examples, and conclusions.
- "keyTakeaways": an array of 5-8 concise bullet points (strings).
- "timestamps": an array of 4-8 objects, each {"t": <seconds number>, "label": <short description>}, marking the most important moments. Infer timestamps from the transcript when explicit times are unavailable (estimate by position).
- "actionItems": an array of concrete, actionable steps the viewer can take (strings). If none, return [].
Respond ONLY with the JSON object.`;

  try {
    const raw = await chatCompletion(
      [
        { role: 'system', content: system },
        { role: 'user', content: `Transcript:\n${transcript}` },
      ],
      { json: true, temperature: 0.3 }
    );
    const parsed = parseJson<{
      short: string;
      detailed: string;
      keyTakeaways: string[];
      timestamps: { t: number; label: string }[];
      actionItems: string[];
    }>(raw);
    return NextResponse.json(parsed, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[studio/summarize] failed: ${message}`);
    return NextResponse.json({ error: `Summary failed: ${message}` }, { status: 500 });
  }
}
