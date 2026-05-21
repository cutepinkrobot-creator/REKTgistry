import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SLEEPLESS_BASE = 'https://sleeplessagent.ai/api/twitter';
const SYNDICATION_BASE = 'https://cdn.syndication.twimg.com/widgets/followbutton/info.json';

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

  // Helper: parse a raw object from any source into our profile shape
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function parseRaw(raw: Record<string, any>, fallbackHandle: string) {
    const resolvedHandle = raw.screen_name ?? raw.userName ?? raw.username ?? fallbackHandle;
    const avatarUrl =
      (raw.profile_image_url_https ?? raw.profile_image_url)
        ? (raw.profile_image_url_https ?? raw.profile_image_url).replace('_normal', '_400x400')
        : `https://unavatar.io/twitter/${fallbackHandle}`;
    return {
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
      isStub: false,
    };
  }

  let profile: ReturnType<typeof parseRaw> | null = null;

  // ── Source 1: Sleepless API ──────────────────────────────────────────────
  if (twitterRes.status === 'fulfilled' && twitterRes.value.ok) {
    try {
      const res = await twitterRes.value.json();
      const raw = res?.data ?? res;
      // Sleepless returns { detail: "..." } on error even with 200
      if (raw && !raw.detail && !raw.error && (raw.name || raw.displayName || raw.screen_name || raw.userName || raw.username)) {
        profile = parseRaw(raw, handle);
      }
    } catch { /* fall through to next source */ }
  }

  // ── Source 2: Twitter syndication API (no auth needed) ───────────────────
  if (!profile) {
    try {
      const synRes = await fetch(
        `${SYNDICATION_BASE}?screen_names=${encodeURIComponent(handle)}`,
        {
          headers: { 'User-Agent': 'Mozilla/5.0' },
          signal: AbortSignal.timeout ? AbortSignal.timeout(6000) : undefined,
        }
      );
      if (synRes.ok) {
        const synData = await synRes.json();
        // Returns an array; first element is the matching user
        const raw = Array.isArray(synData) ? synData[0] : null;
        if (raw?.screen_name) {
          profile = parseRaw(raw, handle);
        }
      }
    } catch { /* fall through to stub */ }
  }

  // ── Stub: show avatar + handle so there's always something rendered ───────
  if (!profile) {
    profile = {
      name: handle,
      username: handle,
      bio: null,
      followers: 0,
      following: 0,
      tweets: 0,
      avatar: `https://unavatar.io/twitter/${handle}`,
      verified: false,
      joined: null,
      location: null,
      website: null,
      isStub: true,
    };
  }

  const profileUnavailable = profile.isStub;

  // Parse registry matches (searched handle)
  let registryMatches =
    registryRes.status === 'fulfilled' && !registryRes.value.error
      ? (registryRes.value.data ?? [])
      : [];

  // If Twitter returned a different current handle (account renamed), also check that handle
  // so registry entries filed under either the old or new handle are both surfaced.
  const currentHandle = profile.username;
  if (!profile.isStub && currentHandle.toLowerCase() !== handle.toLowerCase()) {
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
