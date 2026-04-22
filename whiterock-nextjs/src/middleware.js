import { NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/login', '/forgot-password'];

const ROLE_PREFIXES = {
  super_admin:      ['/super-admin', '/leads', '/loan-pipeline', '/lenders', '/documents', '/tasks', '/reports'],
  tele_agent:       ['/tele-agent', '/leads', '/tasks', '/loan-pipeline'],
  accounts_manager: ['/accounts-manager', '/leads', '/loan-pipeline', '/lenders', '/documents'],
  team_lead:        ['/team-lead', '/leads', '/tasks', '/reports'],
};

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Check for access token cookie
  const accessToken = request.cookies.get('access_token')?.value;
  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Decode role from JWT payload (no signature verify — backend handles that)
  try {
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const role    = payload.role;
    const allowed = ROLE_PREFIXES[role] || [];

    // Redirect root to role dashboard
    if (pathname === '/') {
      const roleHome = allowed[0] || '/login';
      return NextResponse.redirect(new URL(roleHome, request.url));
    }

    // Guard role-specific paths
    const isAllowed = allowed.some((p) => pathname.startsWith(p));
    if (!isAllowed) {
      return NextResponse.redirect(new URL(allowed[0] || '/login', request.url));
    }
  } catch {
    // Malformed token — send to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/).*)'],
};
