'use client';

import { useState, type FormEvent } from 'react';
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
    <div className="authpg-page">
      <div className="authpg-card">
        <div className="authpg-logo">
          <div className="authpg-logo-box">S</div>
          <span>Second Brain AI</span>
        </div>

        <h1 className="authpg-title">
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
                  className="authpg-spin"
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
              New to Second Brain AI?{' '}
              <a href={otherHref}>Create an account</a>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
