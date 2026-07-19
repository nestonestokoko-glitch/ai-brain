import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Allow only same-origin, path-relative redirects (defense against open redirects).
function sanitizeRedirect(target: string | null | undefined): string {
  if (!target || !target.startsWith('/') || target.startsWith('//')) {
    return '/studio';
  }
  return target;
}

/**
 * OAuth callback. Supabase redirects here with a `code` after the user
 * authorizes with Google. We exchange it for a session (which sets the auth
 * cookies on the response) and then send the user to their original
 * destination via the `redirect` query param.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const redirectTo = searchParams.get('redirect') ?? '/studio';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(
        new URL(sanitizeRedirect(redirectTo), origin)
      );
    }
  }

  return NextResponse.redirect(new URL('/login?error=oauth', origin));
}
