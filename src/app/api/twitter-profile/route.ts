import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SLEEPLESS_BASE = 'https://sleeplessagent.ai/api/twitter';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET(req: NextRequest) {
  const handle = req.nextUrl.searchParams.get('handle')?.replace('@', '').trim();
  if (!handle) {
    return NextResponse.json({ ok: false, error: 'Missing handle' }, { status: 400 });
  }

  const apiKey = process.env.SLEEPLESS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: 'API not configured' }, { status: 500 });
  }

  // Fetch Twitter profile + check registry in parallel
  const supabase = getSupabase();
  const [twitterRes, registryRes] = await Promise.allSettled([
    fetch(`${SLEEPLESS_BASE}/users/${handle}`, {
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    }),
    supabase
      .from('scammer_profiles')
      .select('id, slug, display_name, summary, amount_lost_usd, categories, verified, incident_date')
      .eq('status', 'approved')
      .or(`twitter_handle.ilike.${handle},aliases.cs.{"${handle}"}`)
      .limit(3),
  ]);

  // Parse Twitter profile
  let profile = null;
  if (twitterRes.status === 'fulfilled' && twitterRes.value.ok) {
    try {
      const res = await twitterRes.value.json();
      // Sleepless wraps response in { data: { ... } } or { data: { user: { ... } } }
      const d = res?.data ?? res;
      const raw = d?.user ?? d;
      profile = {
        name: raw.name ?? raw.displayName ?? raw.full_name ?? handle,
        username: raw.userName ?? raw.username ?? raw.screen_name ?? handle,
        bio: raw.description ?? raw.bio ?? null,
        followers: raw.followersCount ?? raw.followers_count ?? raw.followers ?? 0,
        following: raw.followingCount ?? raw.friends_count ?? raw.following ?? 0,
        tweets: raw.tweetsCount ?? raw.statuses_count ?? raw.tweets ?? 0,
        avatar: raw.profilePicture ?? raw.profile_image_url_https ?? raw.profile_image_url ?? null,
        verified: raw.isBlueVerified ?? raw.isVerified ?? raw.verified ?? false,
        joined: raw.createdAt ?? raw.created_at ?? null,
        location: raw.location ?? null,
        website: raw.externalUrl ?? raw.url ?? null,
      };
    } catch {
      profile = null;
    }
  }

  // Parse registry matches
  const registryMatches =
    registryRes.status === 'fulfilled' && !registryRes.value.error
      ? (registryRes.value.data ?? [])
      : [];

  return NextResponse.json({ ok: true, profile, registryMatches });
}
