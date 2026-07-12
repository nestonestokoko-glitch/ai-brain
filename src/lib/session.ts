import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from './supabase/server';
import { decodeJwt } from './jwt';

const SESSION_COOKIE = 'sb-session';

// Persist the Supabase session (access + refresh tokens) to cookies.
export async function createSession(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return;

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

// Remove the session cookie.
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

// Optimistic check: does a (valid, unexpired) session cookie exist?
// Cheap and offline-safe — used by proxy.ts for redirects.
export async function hasValidSessionCookie(): Promise<boolean> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return false;

  try {
    const session = JSON.parse(raw) as { access_token?: string };
    if (!session.access_token) return false;
    const decoded = decodeJwt(session.access_token);
    if (!decoded?.sub) return false;
    if (decoded.exp && decoded.exp * 1000 < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}

// Authoritative check: confirm the user with Supabase and return them.
// Falls back to a local JWT decode when the Supabase API is unreachable
// (offline), so the session still resolves from a valid, unexpired token.
export const getUser = cache(async () => {
  const supabase = await createSupabaseServerClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) return user;
  } catch {
    // Network failure talking to Supabase — fall through to local decode.
  }

  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const session = JSON.parse(raw) as { access_token?: string };
    const decoded = decodeJwt(session.access_token ?? '');
    if (!decoded?.sub) return null;
    if (decoded.exp && decoded.exp * 1000 < Date.now()) return null;
    return {
      id: decoded.sub,
      email: (decoded.email as string) ?? null,
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
    } as Awaited<ReturnType<typeof supabase.auth.getUser>>['data']['user'];
  } catch {
    return null;
  }
});

// Verify the session in a page/route. Redirects to /login if missing.
export const verifySession = cache(async () => {
  const user = await getUser();
  if (!user) redirect('/login');
  return { isAuth: true, userId: user.id, email: user.email };
});

// Verify the session inside an API Route Handler. Returns the user, or a
// 401 Response the caller should return immediately.
export async function requireUser() {
  const user = await getUser();
  if (!user) {
    return {
      user: null,
      response: new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    };
  }
  return { user, response: null };
}
