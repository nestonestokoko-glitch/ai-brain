'use client';

import { useActionState } from 'react';
import { signIn, signUp, type AuthState } from '@/app/actions/auth';
import Link from 'next/link';

type Mode = 'signin' | 'signup';

const initial: AuthState = {};

export default function AuthForm({ mode, next }: { mode: Mode; next: string }) {
  const action = mode === 'signin' ? signIn : signUp;
  const [state, formAction, pending] = useActionState(action, initial);
  const isSignUp = mode === 'signup';

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={next} />

      {isSignUp && (
        <Field label="Name" htmlFor="name">
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Ada Lovelace"
            className={inputClass}
          />
        </Field>
      )}

      <Field label="Email" htmlFor="email">
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={inputClass}
        />
      </Field>

      <Field label="Password" htmlFor="password">
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={isSignUp ? 'new-password' : 'current-password'}
          placeholder="••••••••"
          className={inputClass}
        />
      </Field>

      {state?.error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </div>
      )}

      {state?.message && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
        style={{ backgroundImage: 'linear-gradient(90deg, #2563eb, #9333ea)' }}
      >
        {pending ? 'Please wait…' : isSignUp ? 'Create account' : 'Sign in'}
      </button>

      <p className="text-center text-sm text-zinc-400">
        {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
        <Link
          href={isSignUp ? '/login' : '/signup'}
          className="font-medium text-blue-400 hover:text-blue-300"
        >
          {isSignUp ? 'Sign in' : 'Sign up'}
        </Link>
      </p>
    </form>
  );
}

const inputClass =
  'w-full rounded-xl border border-zinc-700 bg-zinc-900/70 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30';

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-zinc-300">
        {label}
      </label>
      {children}
    </div>
  );
}
