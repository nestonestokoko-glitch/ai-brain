import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { isSupabaseConfigured } from '../supabaseClient';

// Returns a Supabase client bound to the request's cookies. The cookie store
// is read synchronously, and writes are flushed via saveSession() after a
// Server Action mutates the session.
export async function createSupabaseServerClient() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Check your .env.local.');
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — safe to ignore, the session
            // cookie is refreshed by a Server Action / Route Handler instead.
          }
        },
      },
    }
  );
}
