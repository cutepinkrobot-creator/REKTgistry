import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

const ADMIN_SESSION_TOKEN =
  process.env.ADMIN_SESSION_TOKEN || 'rektgistry-admin-2025';

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;
  return session === ADMIN_SESSION_TOKEN;
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...fields } = body;

    if (!id) {
      return NextResponse.json({ ok: false, error: 'Missing id' }, { status: 400 });
    }

    // Always stamp the updated_at
    const updatePayload = {
      ...fields,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('scammer_profiles')
      .update(updatePayload)
      .eq('id', id);

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 });
  }
}
