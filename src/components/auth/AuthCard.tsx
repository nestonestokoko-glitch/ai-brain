'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { getBrowserSupabase } from '@/lib/supabase/client';
import { SparkIcon } from '@/components/workspace/icons';

type Mode = 'signin' | 'signup';

function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const current = (document.documentElement.getAttribute('data-auth-theme') ||
      'dark') as 'light' | 'dark';
    setTheme(current);
  }, []);

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-auth-theme', next);
    try {
      localStorage.setItem('auth-theme', next);
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle color theme"
      className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
    >
      {theme === 'dark' ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
}

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

export default function AuthCard({ redirect }: { redirect: string }) {
  const [mode, setMode] = useState<Mode>('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (mode === 'signup' && !fullName.trim()) {
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
        // Session is established client-side; reload so the server picks up the
        // fresh cookie and renders the app without a flash.
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

  const isSignup = mode === 'signup';

  return (
    <div className="auth-root relative flex min-h-screen items-center justify-center px-4 py-10">
      <ThemeToggle />

      <div className="auth-card ws-animate-rise w-full max-w-md rounded-3xl border p-8 sm:p-10">
        {/* Brand */}
        <div className="flex flex-col items-center text-center">
          <span
            className="grid h-12 w-12 place-items-center rounded-2xl text-white shadow-[0_10px_30px_-8px_rgba(37,99,235,0.7)]"
            style={{ backgroundImage: 'linear-gradient(135deg,#2563eb,#4f46e5)' }}
          >
            <SparkIcon width={22} height={22} />
          </span>
          <p className="mt-4 text-sm font-semibold tracking-tight text-white">
            Second Brain AI
          </p>
          <h1 className="auth-title mt-4 text-3xl font-bold tracking-tight">
            {isSignup ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="auth-muted mt-2 max-w-sm text-sm leading-relaxed">
            {isSignup
              ? 'Sign up to turn YouTube videos, articles, and PDFs into your own searchable knowledge base.'
              : 'Sign in to pick up where you left off.'}
          </p>
        </div>

        {/* Mode switch */}
        <div className="mt-8 grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError(null);
              setInfo(null);
            }}
            className={`rounded-lg py-2 text-sm font-medium transition ${
              !isSignup
                ? 'bg-white/[0.08] text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
              setInfo(null);
            }}
            className={`rounded-lg py-2 text-sm font-medium transition ${
              isSignup
                ? 'bg-white/[0.08] text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {isSignup && (
            <div>
              <label
                htmlFor="auth-name"
                className="mb-1.5 block text-sm font-medium text-zinc-300"
              >
                Name
              </label>
              <input
                id="auth-name"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ada Lovelace"
                className="auth-input"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="auth-email"
              className="mb-1.5 block text-sm font-medium text-zinc-300"
            >
              Email
            </label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="auth-input"
            />
          </div>

          <div>
            <label
              htmlFor="auth-password"
              className="mb-1.5 block text-sm font-medium text-zinc-300"
            >
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="auth-input"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300"
            >
              {error}
            </p>
          )}
          {info && (
            <p
              role="status"
              className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3 text-sm text-emerald-300"
            >
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="auth-submit group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[15px] font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
                </svg>
                <span>Please wait…</span>
              </>
            ) : (
              <span>{isSignup ? 'Create Account' : 'Sign In'}</span>
            )}
          </button>
        </form>

        <p className="auth-muted mt-6 text-center text-sm">
          {isSignup ? (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                  setInfo(null);
                }}
                className="font-medium text-blue-400 underline-offset-2 hover:underline"
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              New to Second Brain AI?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                  setInfo(null);
                }}
                className="font-medium text-blue-400 underline-offset-2 hover:underline"
              >
                Create an account
              </button>
            </>
          )}
        </p>

        <p className="auth-muted mt-6 text-center text-xs">
          By continuing you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
