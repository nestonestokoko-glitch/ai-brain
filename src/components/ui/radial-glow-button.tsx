'use client';

import type { ButtonHTMLAttributes } from 'react';

// A button with a soft radial blue glow behind/on it. Adapted to this
// project's dark blue/black workspace theme. Accepts standard button
// props (onClick, disabled, type, etc.) plus children.
export function RadialGlowButton({
  className = '',
  style,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={
        'relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-5 py-2.5 text-sm font-semibold text-white outline-none transition disabled:cursor-not-allowed disabled:opacity-50 ' +
        className
      }
      style={{
        background:
          'radial-gradient(130% 130% at 50% -10%, rgba(96,165,250,0.5) 0%, rgba(59,130,246,0.25) 40%, rgba(10,14,28,0.95) 100%)',
        boxShadow:
          '0 10px 34px -10px rgba(37,99,235,0.7), inset 0 1px 0 0 rgba(255,255,255,0.15)',
        ...style,
      }}
    >
      {children}
    </button>
  );
}
