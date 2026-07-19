import { NextResponse } from 'next/server';
import { listContent } from '@/lib/storage';
import { protectApi } from '@/lib/supabase/server';

export async function GET() {
  const denied = await protectApi();
  if (denied) return denied;

  try {
    const items = await listContent();
    return NextResponse.json({ items }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Library fetch error:', message);
    return NextResponse.json({ error: message, items: [] }, { status: 500 });
  }
}