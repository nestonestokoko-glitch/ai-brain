'use client';

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import { getBrowserSupabase } from '@/lib/supabase/client';
import './auth-pages.css';

type Mode = 'signin' | 'signup';

function friendlyError(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  if (/invalid login credentials/i.test(message)) {
    return 'Incorrect email or password.';
  }
  if (/already registered|user already exists/i.test(message)) {
    return 'An account with this email already exists. Try signing in.';
  }
  if (/email not confirmed/i.test(message)) {
    return 'Please confirm your email, or turn off email confirmation in Supabase.';
  }
  if (/invalid format|valid email/i.test(message)) {
    return 'Enter a valid email address.';
  }
  if (/password.*(6|weak|short)/i.test(message)) {
    return 'Password must be at least 6 characters.';
  }
  if (/signups not allowed|email.*disabled/i.test(message)) {
    return 'Email sign-ups are disabled. Enable them in Supabase.';
  }
  return message || 'Something went wrong. Please try again.';
}

export default function AuthForm({
  mode,
  redirect,
}: {
  mode: Mode;
  redirect: string;
}) {
  const isSignup = mode === 'signup';
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Preserve the destination across the sign in ⇄ sign up switch.
  const otherHref =
    (isSignup ? '/signin' : '/signup') +
    (redirect && redirect !== '/studio'
      ? `?redirect=${encodeURIComponent(redirect)}`
      : '');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (isSignup && !fullName.trim()) {
      setError('Enter your name to create an account.');
      return;
    }

    setLoading(true);
    try {
      const supabase = getBrowserSupabase();

      if (mode === 'signin') {
        const { error: authErr } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (authErr) throw authErr;
        window.location.assign(redirect);
        return;
      }

      // Create the account server-side (auto-confirmed, no email sent).
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
          fullName: fullName.trim(),
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(json.error || 'Could not create account.');

      // Account exists and is confirmed → sign in to establish the session.
      const { error: authErr } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (authErr) throw authErr;
      window.location.assign(redirect);
      return;
    } catch (err) {
      setLoading(false);
      setError(friendlyError(err));
    }
  }

  return (
    <div className="lqd-auth-content">
      {/* Sidebar - Sticky, takes 50% width on large screens */}
      <div className="lqd-auth-sidebar">
        {/* Middle: Feature Highlights with premium animations and styling */}
        <div className="relative my-auto py-10 flex flex-col gap-8">
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background: 'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.18) 0%, transparent 60%)',
              filter: 'blur(50px)',
            }}
          />

          <div>
            <h2 className="text-4xl font-extrabold tracking-tight text-black leading-tight mt-6">
              Turn hours of content<br />
              into minutes of reading.
            </h2>
            <p className="mt-4 text-sm text-zinc-400 leading-relaxed max-w-sm">
              Connect YouTube videos, podcasts, and articles to extract key insights instantly, organized into your personal searchable knowledge library.
            </p>
          </div>

          {/* Feature items */}
          <div className="flex flex-col gap-4 mt-2">


            <div className="flex items-start gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-sm transition duration-300 hover:bg-white/[0.03] hover:border-white/10">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Interactive personal library</h4>
                <p className="mt-1 text-xs text-zinc-400 leading-relaxed">Organize, structure, and explore all summaries with semantic-based fast search.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="text-xs text-zinc-500 tracking-wide">
          © 2026 Premium Knowledge Hub.
        </div>
      </div>

      {/* Content Area - Forms */}
      <div className="lqd-auth-content-area">
        <div className="authpg-card">
          <h1 className="authpg-title text-black">
            {isSignup ? 'Sign up for an account' : 'Sign in to your account'}
          </h1>
          <p className="authpg-subtitle">
            {isSignup
              ? 'Create your account to build your searchable knowledge base.'
              : 'Welcome back. Sign in to pick up where you left off.'}
          </p>

          <form className="authpg-form" onSubmit={handleSubmit}>
            {isSignup && (
              <div className="authpg-field">
                <label className="authpg-label" htmlFor="authpg-name">
                  Full name
                </label>
                <input
                  id="authpg-name"
                  className="authpg-input"
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ada Lovelace"
                />
              </div>
            )}

            <div className="authpg-field">
              <label className="authpg-label" htmlFor="authpg-email">
                Email address
              </label>
              <input
                id="authpg-email"
                className="authpg-input"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@johndoe.com"
              />
            </div>

            <div className="authpg-field">
              <label className="authpg-label" htmlFor="authpg-password">
                Password
              </label>
              <input
                id="authpg-password"
                className="authpg-input"
                type="password"
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="authpg-error" role="alert">
                {error}
              </p>
            )}

            <button className="authpg-submit" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <svg
                    className="authpg-spin animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      opacity="0.25"
                    />
                    <path
                      d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
                      fill="currentColor"
                    />
                  </svg>
                  <span>Please wait…</span>
                </>
              ) : (
                <span>{isSignup ? 'Sign Up' : 'Sign In'}</span>
              )}
            </button>
          </form>

          <p className="authpg-foot">
            {isSignup ? (
              <>
                Already have an account?{' '}
                <a href={otherHref}>Sign in</a>
              </>
            ) : (
              <>
                New here?{' '}
                <a href={otherHref}>Create an account</a>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
