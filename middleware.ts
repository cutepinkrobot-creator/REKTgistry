import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_SESSION_TOKEN =
  process.env.ADMIN_SESSION_TOKEN || 'rektgistry-admin-2025';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const session = request.cookies.get('admin_session');

    if (!session || session.value !== ADMIN_SESSION_TOKEN) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect cron routes — require x-cron-secret or Authorization header
  if (pathname.startsWith('/api/cron/')) {
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
      const headerSecret = request.headers.get('x-cron-secret');
      const authHeader = request.headers.get('authorization');
      const bearerSecret = authHeader?.replace('Bearer ', '');

      if (headerSecret !== cronSecret && bearerSecret !== cronSecret) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/cron/:path*'],
};
