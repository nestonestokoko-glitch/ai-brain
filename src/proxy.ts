import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeJwt } from '@/lib/jwt';

// Routes that don't require authentication.
const PUBLIC_PATHS = ['/login', '/signup'];
const SESSION_COOKIE = 'sb-session';

// Cheap, offline-safe check: is there a valid, unexpired session cookie?
function hasValidSession(request: NextRequest): boolean {
  const raw = request.cookies.get(SESSION_COOKIE)?.value;
  if (!raw) return false;
  try {
    const session = JSON.parse(raw) as { access_token?: string };
    const decoded = decodeJwt(session.access_token ?? '');
    if (!decoded?.sub) return false;
    if (decoded.exp && decoded.exp * 1000 < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === '/') return NextResponse.next();

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  const authed = hasValidSession(request);

  if (!authed && !isPublic) {
    const url = new URL('/login', request.url);
    url.searchParams.set('next', pathname);
    const res = NextResponse.redirect(url);
    res.headers.set('x-auth-debug', 'redirect-unauth');
    return res;
  }

  if (authed && isPublic) {
    const res = NextResponse.redirect(new URL('/studio', request.url));
    res.headers.set('x-auth-debug', 'redirect-auth');
    return res;
  }

  const res = NextResponse.next();
  res.headers.set('x-auth-debug', authed ? 'pass-auth' : 'pass-public');
  return res;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
