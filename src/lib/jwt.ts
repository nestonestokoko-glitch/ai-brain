// Minimal JWT decoder (no verification). Used for optimistic, offline
// session checks in proxy.ts — real verification happens in session.ts
// via supabase.auth.getUser().

export interface DecodedJwt {
  sub?: string;
  email?: string;
  exp?: number;
  [key: string]: unknown;
}

export function decodeJwt(token: string): DecodedJwt | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const payload = parts[1];
  // base64url decode (browser + node compatible)
  const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    '='
  );

  try {
    const decoded =
      typeof atob === 'function'
        ? atob(padded)
        : Buffer.from(padded, 'base64').toString('binary');
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}
