import { NextResponse } from 'next/server';
import { protectApi } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const denied = await protectApi();
  if (denied) return denied;


  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Expected a multipart form upload.' }, { status: 400 });
  }

  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No PDF file provided.' }, { status: 400 });
  }
  if (file.type && !file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
    return NextResponse.json({ error: 'Please upload a PDF file.' }, { status: 415 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const pdfParse = (await import('pdf-parse')).default;
    const parsed = await pdfParse(buffer);
    const text = (parsed.text as string | undefined)?.trim();
    if (!text) {
      return NextResponse.json(
        { error: 'No extractable text was found in this PDF.' },
        { status: 422 }
      );
    }
    return NextResponse.json(
      { title: file.name, text: text.slice(0, 120000) },
      { status: 200 }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: `Failed to parse PDF: ${msg}` }, { status: 500 });
  }
}
