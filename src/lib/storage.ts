import { promises as fs } from 'fs';
import path from 'path';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import type { ContentObject, SourceType } from './types';

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'content.json');

// --- Local file fallback (demo mode, no Supabase needed) ---

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

// Local-file fallback used when Supabase is unavailable or the insert fails.
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

// --- Public API ---

export async function listContent(): Promise<ContentObject[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('content_objects')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      // Table missing / RLS / network error — fall back to the local store
      // so the library still renders instead of erroring out.
      console.error(
        '[storage] Supabase select failed, falling back to local store:',
        error.message
      );
      return readLocal();
    }
    return (data as ContentObject[]) || [];
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
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('content_objects')
      .insert(row)
      .select()
      .single();
    if (error) {
      // Supabase insert failed (e.g. the table doesn't exist yet, or an RLS
      // / network error). Fall back to the local file store so the import
      // still succeeds instead of throwing a hard error to the user.
      console.error(
        '[storage] Supabase insert failed, falling back to local store:',
        error.message
      );
      return writeLocalFallback(row);
    }
    return data as ContentObject;
  }

  return writeLocalFallback(row);
}
