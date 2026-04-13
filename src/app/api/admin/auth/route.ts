import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const ADMIN_SESSION_TOKEN =
  process.env.ADMIN_SESSION_TOKEN || 'rektgistry-admin-2025';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!ADMIN_PASSWORD || body.password !== ADMIN_PASSWORD) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set('admin_session', ADMIN_SESSION_TOKEN, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      secure: process.env.NODE_ENV === 'production',
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 });
  }
}
