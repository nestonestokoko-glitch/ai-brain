import { createClient } from '@supabase/supabase-js';

/**
 * Server-side sign-up that creates an already-confirmed user with the
 * service-role key. This bypasses Supabase's confirmation email entirely, so
 * no email is ever sent (no magic link, no OTP, no rate limits). The client
 * then signs in with the password to establish the session.
 *
 * The service-role key is read only on the server and never exposed to the
 * browser.
 */
export async function POST(request: Request) {
  let body: { email?: string; password?: string; fullName?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const email = body.email?.trim() ?? '';
  const password = body.password ?? '';
  const fullName = body.fullName?.trim() ?? '';

  if (!email || !password) {
    return Response.json({ error: 'Enter your email and password.' }, { status: 400 });
  }
  if (password.length < 6) {
    return Response.json(
      { error: 'Password must be at least 6 characters.' },
      { status: 400 }
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return Response.json(
      { error: 'Auth is not configured on the server.' },
      { status: 500 }
    );
  }

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // mark as confirmed → no confirmation email
    user_metadata: fullName ? { full_name: fullName } : undefined,
  });

  if (error) {
    const message = error.message || 'Could not create account.';
    if (/already been registered|already exists|duplicate/i.test(message)) {
      return Response.json(
        { error: 'An account with this email already exists. Try signing in.' },
        { status: 409 }
      );
    }
    return Response.json({ error: message }, { status: 400 });
  }

  return Response.json({ ok: true });
}
