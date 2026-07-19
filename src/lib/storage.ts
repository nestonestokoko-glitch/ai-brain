import { promises as fs } from 'fs';
import path from 'path';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import type { ContentObject, SourceType } from './types';

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'content.json');

// --- Local file fallback (demo mode / Supabase unavailable) ---

async function readLocal(): Promise<ContentObject[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeLocal(items: ContentObject[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2));
}

// Local-file fallback used when Supabase is unavailable or the query/insert fails.
async function writeLocalFallback(
  row: Partial<Omit<ContentObject, 'id' | 'created_at'>> & {
    source_url: string;
    source_type: SourceType;
    title: string;
  }
): Promise<ContentObject> {
  const items = await readLocal();
  const record: ContentObject = {
    ...row,
    user_id: row.user_id ?? 'demo',
    summary: row.summary ?? null,
    id: `local_${items.length + 1}_${Date.now()}`,
    created_at: new Date().toISOString(),
  } as ContentObject;
  items.unshift(record);
  await writeLocal(items);
  return record;
}

// Resolves the current user id from the session cookie carried by the
// server-side Supabase client. Falls back to 'demo' only when Supabase
// is not configured (routes that call this are gated by protectApi()).
async function getCurrentUserId(): Promise<string> {
  if (!isSupabaseConfigured) return 'demo';
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? 'demo';
  } catch {
    return 'demo';
  }
}

// --- Supabase-backed API (scoped per user via RLS) ---

export async function listContent(): Promise<ContentObject[]> {
  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('content_objects')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      // RLS already filters to the caller's own rows.
      return (data as ContentObject[]) || [];
    } catch (err) {
      // Table missing / RLS / network error — fall back to the local
      // store so the library still renders instead of erroring out.
      console.error(
        '[storage] Supabase select failed, falling back to local store:',
        err
      );
      return readLocal();
    }
  }
  return readLocal();
}

export async function insertContent(
  row: Partial<Omit<ContentObject, 'id' | 'created_at'>> & {
    source_url: string;
    source_type: SourceType;
    title: string;
  }
): Promise<ContentObject> {
  const userId = await getCurrentUserId();
  const payload = { ...row, user_id: userId };

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('content_objects')
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data as ContentObject;
    } catch (err) {
      // Supabase insert failed — fall back to the local file store so the
      // import still succeeds instead of throwing a hard error to the user.
      console.error(
        '[storage] Supabase insert failed, falling back to local store:',
        err
      );
      return writeLocalFallback(payload);
    }
  }

  return writeLocalFallback(payload);
}
