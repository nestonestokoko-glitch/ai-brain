'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Image from 'next/image';
import { getBrowserSupabase } from '@/lib/supabase/client';
import './auth-pages.css';

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
    <div className="lqd-auth-content relative">
      <ThemeToggle />

      {/* Sidebar - Sticky, takes 50% width on large screens */}
      <div className="lqd-auth-sidebar">
        {/* Top: Logo and Branding */}
        <div className="flex items-center gap-3">
          <Image
            src="/lodo2.0.png"
            alt="Logo"
            width={40}
            height={40}
            className="object-contain"
            priority
          />
        </div>

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
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-400 px-3 py-1 rounded-full border border-blue-400/20 bg-blue-500/10">
              Welcome to the future of reading
            </span>
            <h2 className="text-4xl font-extrabold tracking-tight text-white leading-tight mt-6">
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
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">YouTube Summarizer</h4>
                <p className="mt-1 text-xs text-zinc-400 leading-relaxed">Paste a YouTube link and get clean, formatted takeaways and key timestamps.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-sm transition duration-300 hover:bg-white/[0.03] hover:border-white/10">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Podcast Transcription</h4>
                <p className="mt-1 text-xs text-zinc-400 leading-relaxed">Transcribe long audio formats into searchable text with key insight extraction.</p>
              </div>
            </div>

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
          {/* Logo visible only on mobile view */}
          <div className="authpg-logo lg:hidden mb-8 justify-center">
            <Image
              src="/lodo2.0.png"
              alt="Logo"
              width={36}
              height={36}
              className="object-contain"
              priority
            />
          </div>

          {/* Brand */}
          <div className="flex flex-col items-center text-center">
            <h1 className="authpg-title">
              {isSignup ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="authpg-subtitle mt-2">
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
          <form onSubmit={handleSubmit} className="authpg-form">
            {isSignup && (
              <div className="authpg-field">
                <label
                  htmlFor="auth-name"
                  className="authpg-label"
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
                  className="authpg-input"
                />
              </div>
            )}

            <div className="authpg-field">
              <label
                htmlFor="auth-email"
                className="authpg-label"
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
                className="authpg-input"
              />
            </div>

            <div className="authpg-field">
              <label
                htmlFor="auth-password"
                className="authpg-label"
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
                className="authpg-input"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="authpg-error"
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
              className="authpg-submit"
            >
              {loading ? (
                <>
                  <svg className="authpg-spin animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

          <p className="authpg-foot">
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
                New here?{' '}
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

          <p className="text-zinc-500 text-center text-xs mt-6">
            By continuing you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
