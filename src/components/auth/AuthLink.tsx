'use client';

import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { useAuth } from './AuthProvider';

/**
 * A link that requires authentication. When the user is signed in it behaves
 * like a normal <Link>. When they are not, it points at the login page
 * with a `redirect` param so they return to `href` after signing in.
 */
export function AuthLink({
  href,
  className,
  children,
  onClick,
  style,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
}) {
  const { user } = useAuth();
  const target = user
    ? href
    : `/login?redirect=${encodeURIComponent(href)}`;

  return (
    <Link href={target} className={className} onClick={onClick} style={style}>
      {children}
    </Link>
  );
}
