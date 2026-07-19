import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// App routes that require an authenticated session.
const PROTECTED_PREFIXES = ['/studio', '/library'];

// Where to land after a successful sign-in when no explicit destination is given.
const DEFAULT_APP_ROUTE = '/studio';

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

// Allow only same-origin, path-relative redirects (defense against open redirects).
export function sanitizeRedirect(target: string | null | undefined): string {
  if (!target || !target.startsWith('/') || target.startsWith('//')) {
    return DEFAULT_APP_ROUTE;
  }
  return target;
}

/**
 * Refreshes the Supabase session on every request and reads the current user.
 * Mirrors the canonical @supabase/ssr proxy setup: refreshed cookies are
 * written back to BOTH the request (so downstream Server Components see them)
 * and the response (so the browser keeps the session).
 */
async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!supabaseUrl || !supabaseAnonKey) {
    return { response, user: null as User | null };
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user };
}

export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const { pathname, searchParams } = request.nextUrl;

  // Unauthenticated user hitting a protected route → send to login,
  // carrying the intended destination so we can return after auth.
  if (isProtected(pathname) && !user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Already signed in but sitting on the login page → go straight to the app.
  if (pathname === '/login' && user) {
    const target = sanitizeRedirect(searchParams.get('redirect'));
    return NextResponse.redirect(new URL(target, request.url));
  }

  return response;
}

export const config = {
  // Run on all page routes, but skip API routes (protected in handlers),
  // static assets, and the OAuth callback under /auth.
  matcher: [
    '/((?!api|_next/static|_next/image|auth|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm|ico|json|woff2?)$).*)',
  ],
};
