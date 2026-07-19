'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';

// Pill button in the top nav. Shows "Sign in" (linking to /login) when logged
// out, and "OpenAI Studio" (linking to /studio) once the user is signed in.
export function StudioButton() {
  const { user } = useAuth();
  const label = user ? 'OpenAI Studio' : 'Sign in';
  const href = user ? '/studio' : '/login';

  return (
    <Link
      href={href}
      className="group relative inline-flex flex-1 justify-center h-10 shrink-0 items-center overflow-hidden whitespace-nowrap rounded-[40px] border-2 border-black/5 px-4 text-sm font-semibold text-white transition-all duration-300 ease-out hover:scale-105 active:scale-100 sm:flex-none sm:h-11 sm:px-6 sm:text-[17px]"
      style={{
        backgroundColor: 'rgb(110, 70, 30)',
        boxShadow: 'inset 0 -4px 4px 0 rgb(19, 99, 72)',
      }}
    >
      <span className="relative">{label}</span>
    </Link>
  );
}
