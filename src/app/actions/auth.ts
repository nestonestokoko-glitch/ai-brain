'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSession, clearSession } from '@/lib/session';

export interface AuthState {
  error?: string;
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Turn raw Supabase auth errors into clear, user-friendly messages.
function friendlyAuthError(error: { message: string; status?: number }): string {
  const msg = error.message.toLowerCase();

  if (msg.includes('rate limit') || msg.includes('email send')) {
    return 'Our email service is busy right now. Please wait a few minutes and try again — or sign in if you already have an account.';
  }
  if (msg.includes('email not confirmed') || msg.includes('not confirmed')) {
    return 'Please confirm your email address before signing in. Check your inbox for the confirmation link.';
  }
  if (msg.includes('invalid login') || msg.includes('invalid credentials')) {
    return 'Incorrect email or password. Please try again.';
  }
  if (msg.includes('user already registered') || msg.includes('already been registered')) {
    return 'An account with this email already exists. Try signing in instead.';
  }
  if (msg.includes('weak password') || msg.includes('password should')) {
    return 'Please choose a stronger password (at least 6 characters).';
  }
  if (msg.includes('signup is disabled') || msg.includes('sign-ups not allowed')) {
    return 'Sign-ups are currently disabled. Please contact support.';
  }
  return error.message;
}

// Only allow redirects to local, relative paths.
function safeRedirect(target?: string): string {
  if (target && target.startsWith('/') && !target.startsWith('//')) {
    return target;
  }
  return '/studio';
}

export async function signIn(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const next = String(formData.get('next') ?? '');

  if (!EMAIL_RE.test(email)) {
    return { error: 'Please enter a valid email address.' };
  }
  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters.' };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: friendlyAuthError(error) };
  }

  await createSession();
  redirect(safeRedirect(next));
}

export async function signUp(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const next = String(formData.get('next') ?? '');

  if (name.length < 2) {
    return { error: 'Please enter your name.' };
  }
  if (!EMAIL_RE.test(email)) {
    return { error: 'Please enter a valid email address.' };
  }
  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters.' };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  });

  if (error) {
    return { error: friendlyAuthError(error) };
  }

  // Email confirmation disabled -> user is logged in immediately.
  if (data.session) {
    await createSession();
    redirect(safeRedirect(next));
  }

  return {
    message:
      'Account created. Check your email to confirm your address, then sign in.',
  };
}

export async function signOut(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  await clearSession();
  redirect('/login');
}
