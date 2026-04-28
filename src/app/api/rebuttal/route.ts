import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET — fetch approved rebuttals for a profile
export async function GET(req: NextRequest) {
  const profileId = req.nextUrl.searchParams.get('profile_id');
  if (!profileId) {
    return NextResponse.json({ ok: false, error: 'Missing profile_id' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('rebuttals')
    .select('id, profile_id, name, content, created_at')
    .eq('profile_id', profileId)
    .eq('status', 'approved')
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, rebuttals: data ?? [] });
}

// POST — submit a new rebuttal (goes to pending review)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profile_id, name, email, content } = body;

    if (!profile_id || typeof profile_id !== 'string') {
      return NextResponse.json({ ok: false, error: 'Missing profile_id' }, { status: 400 });
    }
    if (!content || typeof content !== 'string' || content.trim().length < 20) {
      return NextResponse.json({ ok: false, error: 'Rebuttal content too short (min 20 characters)' }, { status: 400 });
    }
    if (content.trim().length > 1000) {
      return NextResponse.json({ ok: false, error: 'Rebuttal content too long (max 1000 characters)' }, { status: 400 });
    }

    // Rate limit — max 3 rebuttals per profile per day (crude check via count)
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from('rebuttals')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', profile_id)
      .gte('created_at', since);

    if ((count ?? 0) >= 3) {
      return NextResponse.json({ ok: false, error: 'Too many rebuttals submitted for this profile recently. Please wait 24 hours.' }, { status: 429 });
    }

    const { error } = await supabase.from('rebuttals').insert({
      profile_id,
      name: name?.trim() || null,
      email: email?.trim() || null,
      content: content.trim(),
      status: 'pending',
    });

    if (error) {
      console.error('Rebuttal insert error:', error);
      return NextResponse.json({ ok: false, error: 'Failed to save rebuttal.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Rebuttal POST error:', err);
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }
}
