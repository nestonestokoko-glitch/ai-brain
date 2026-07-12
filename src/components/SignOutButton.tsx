'use client';

import { signOut } from '@/app/actions/auth';

export default function SignOutButton({
  className = '',
}: {
  className?: string;
}) {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className={
          'rounded-lg px-4 py-2 text-sm font-medium transition-colors ' +
          className
        }
      >
        Sign out
      </button>
    </form>
  );
}
