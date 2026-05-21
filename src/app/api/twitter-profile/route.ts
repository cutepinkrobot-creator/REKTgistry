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
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000); // 9s — under Vercel's 10s limit

  const [twitterRes, registryRes] = await Promise.allSettled([
    fetch(`${SLEEPLESS_BASE}/users/${handle}`, {
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      signal: controller.signal,
    }),
    supabase
      .from('scammer_profiles')
      .select('id, slug, display_name, summary, amount_lost_usd, categories, verified, incident_date')
      .eq('status', 'approved')
      .or(`twitter_handle.ilike.${handle},aliases.cs.{"${handle}"}`)
      .limit(3),
  ]);

  clearTimeout(timeoutId);

  // Detect timeout vs other failures
  const profileTimeout =
    twitterRes.status === 'rejected' &&
    (twitterRes.reason as Error)?.name === 'AbortError';

  // Parse Twitter profile
  let profile = null;
  let profileUnavailable = false;

  if (twitterRes.status === 'fulfilled') {
    if (twitterRes.value.ok) {
      try {
        const res = await twitterRes.value.json();
        // Sleepless: { data: { ...fields }, code: 200 }
        const raw = res?.data ?? res;
        // If the body itself signals an error (e.g. { detail: "..." }), treat as unavailable
        if (raw?.detail || raw?.error || (!raw?.name && !raw?.displayName && !raw?.screen_name && !raw?.userName && !raw?.username)) {
          profileUnavailable = true;
        } else {
          // profile_image_url is often null from this API — fall back to unavatar.io
          const avatarUrl = raw.profile_image_url
            ? raw.profile_image_url.replace('_normal', '_400x400')
            : `https://unavatar.io/twitter/${handle}`;
          // current screen_name may differ from searched handle (renamed accounts)
          const resolvedHandle = raw.screen_name ?? raw.userName ?? raw.username ?? handle;
          profile = {
            name: raw.name ?? raw.displayName ?? resolvedHandle,
            username: resolvedHandle,
            bio: raw.description ?? raw.bio ?? null,
            followers: raw.followers_count ?? raw.followersCount ?? 0,
            following: raw.following_count ?? raw.followingCount ?? raw.friends_count ?? 0,
            tweets: raw.tweet_count ?? raw.tweetsCount ?? raw.statuses_count ?? 0,
            avatar: avatarUrl,
            verified: raw.is_blue_verified ?? raw.isBlueVerified ?? raw.verified ?? false,
            joined: raw.created_at ?? raw.createdAt ?? null,
            location: raw.location ?? null,
            website: (raw.urls?.[0]?.expanded_url) ?? raw.externalUrl ?? null,
          };
        }
      } catch {
        profileUnavailable = true;
      }
    } else {
      // Non-2xx from Sleepless (rate-limited, banned accounts, etc.)
      profileUnavailable = true;
    }
  }

  // Parse registry matches (searched handle)
  let registryMatches =
    registryRes.status === 'fulfilled' && !registryRes.value.error
      ? (registryRes.value.data ?? [])
      : [];

  // If Twitter returned a different current handle (account renamed), also check that handle
  // so registry entries filed under either the old or new handle are both surfaced.
  const currentHandle = profile?.username;
  if (currentHandle && currentHandle.toLowerCase() !== handle.toLowerCase()) {
    const { data: extraData } = await supabase
      .from('scammer_profiles')
      .select('id, slug, display_name, summary, amount_lost_usd, categories, verified, incident_date')
      .eq('status', 'approved')
      .or(`twitter_handle.ilike.${currentHandle},aliases.cs.{"${currentHandle}"}`)
      .limit(3);

    if (extraData?.length) {
      const existingIds = new Set(registryMatches.map((m: { id: string }) => m.id));
      registryMatches = [
        ...registryMatches,
        ...extraData.filter((m: { id: string }) => !existingIds.has(m.id)),
      ];
    }
  }

  return NextResponse.json({ ok: true, profile, profileTimeout, profileUnavailable, registryMatches });
}
