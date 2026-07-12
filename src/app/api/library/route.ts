import { NextResponse } from 'next/server';
import { listContent } from '@/lib/storage';

export async function GET() {
  try {
    const items = await listContent();
    return NextResponse.json({ items }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Library fetch error:', message);
    return NextResponse.json({ error: message, items: [] }, { status: 500 });
  }
}