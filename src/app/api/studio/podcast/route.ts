/**
 * POST /api/studio/podcast
 * Turns a video transcript into "podcast mode" material.
 *
 * Body: { "transcript": string, "title?": string }
 * 200:  { notes, episodeSummary, discussionPoints[], highlights[] }
 * 400:  missing transcript
 * 500:  AI failure
 */
import { NextResponse } from 'next/server';
import { chatCompletion, parseJson } from '@/lib/ai';
import { requireUser } from '@/lib/session';

export async function POST(request: Request) {
  const { response } = await requireUser();
  if (response) return response;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const { transcript, title } = (body ?? {}) as { transcript?: unknown; title?: string };

  if (typeof transcript !== 'string' || transcript.trim().length < 20) {
    return NextResponse.json(
      { error: 'A transcript of at least 20 characters is required.' },
      { status: 400 }
    );
  }

  const system = `You convert educational YouTube videos into podcast-style material. Given a transcript${
    title ? `\nVideo title: ${title}` : ''
  }, respond with JSON using these exact keys:
- "notes": a casual, conversational set of show notes a host would glance at (3-5 short paragraphs, string).
- "episodeSummary": a one-paragraph episode description suitable for a podcast app (string).
- "discussionPoints": an array of 5-7 talking points a host could riff on (strings).
- "highlights": an array of 4-6 standout quotes or moments worth highlighting (strings).
Respond ONLY with the JSON object.`;

  try {
    const raw = await chatCompletion(
      [
        { role: 'system', content: system },
        { role: 'user', content: `Transcript:\n${transcript}` },
      ],
      { json: true, temperature: 0.5 }
    );
    const parsed = parseJson<{
      notes: string;
      episodeSummary: string;
      discussionPoints: string[];
      highlights: string[];
    }>(raw);
    return NextResponse.json(parsed, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[studio/podcast] failed: ${message}`);
    return NextResponse.json({ error: `Podcast generation failed: ${message}` }, { status: 500 });
  }
}
