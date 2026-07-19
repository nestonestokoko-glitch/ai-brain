import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { User } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http')
);

/**
 * Server-side Supabase client for Server Components, Route Handlers, and proxy.
 * Cookies are read from / written to the Next.js request so sessions stay in
 * sync across the request lifecycle.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl!, supabaseAnonKey!, {
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
          // The `setAll` call can throw when cookies are read-only
          // (e.g. inside a Server Component render). Session refresh in that
          // case is handled by proxy.ts / Route Handlers, which own the response.
        }
      },
    },
  });
}

/** Reads the authenticated user from the request's session cookie. */
export async function getServerUser(): Promise<User | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

/**
 * Guard for API Route Handlers. Returns `null` when the request is allowed
 * (either authenticated, or Supabase isn't configured yet in dev), or a 401
 * `Response` when the caller is not signed in.
 */
export async function protectApi(): Promise<Response | null> {
  if (!isSupabaseConfigured) return null;
  const user = await getServerUser();
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }
  return null;
}
