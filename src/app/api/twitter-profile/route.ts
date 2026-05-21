import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SLEEPLESS_BASE = 'https://sleeplessagent.ai/api/twitter';
const TWITTER_V2_BASE = 'https://api.twitter.com/2/users/by/username';
const SYNDICATION_BASE = 'https://cdn.syndication.twimg.com/widgets/followbutton/info.json';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Wraps a fetch with a hard timeout
function fetchWithTimeout(url: string, init: RequestInit, ms: number): Promise<Response> {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { ...init, signal: ctrl.signal }).finally(() => clearTimeout(id));
}

type Profile = {
  name: string;
  username: string;
  bio: string | null;
  followers: number;
  following: number;
  tweets: number;
  avatar: string | null;
  verified: boolean;
  joined: string | null;
  location: string | null;
  website: string | null;
  isStub: boolean;
};

function avatarUrl(url: string | null | undefined, fallbackHandle: string): string {
  if (!url) return `https://unavatar.io/twitter/${fallbackHandle}`;
  return url.replace('_normal', '_400x400');
}

export async function GET(req: NextRequest) {
  const handle = req.nextUrl.searchParams.get('handle')?.replace('@', '').trim();
  if (!handle) {
    return NextResponse.json({ ok: false, error: 'Missing handle' }, { status: 400 });
  }

  const supabase = getSupabase();

  // Registry check runs in parallel with profile lookups — it's fast (Supabase)
  const registryPromise = supabase
    .from('scammer_profiles')
    .select('id, slug, display_name, summary, amount_lost_usd, categories, verified, incident_date')
    .eq('status', 'approved')
    .or(`twitter_handle.ilike.${handle},aliases.cs.{"${handle}"}`)
    .limit(3);

  let profile: Profile | null = null;

  // ── Source 1: Twitter API v2 (official, free tier, most reliable) ──────────
  const twitterBearer = process.env.TWITTER_BEARER_TOKEN;
  if (!profile && twitterBearer) {
    try {
      const res = await fetchWithTimeout(
        `${TWITTER_V2_BASE}/${encodeURIComponent(handle)}?user.fields=description,profile_image_url,public_metrics,verified_type,location,entities,created_at`,
        { headers: { Authorization: `Bearer ${twitterBearer}` } },
        6000
      );
      if (res.ok) {
        const json = await res.json();
        const d = json?.data;
        if (d?.username) {
          profile = {
            name: d.name ?? d.username,
            username: d.username,
            bio: d.description ?? null,
            followers: d.public_metrics?.followers_count ?? 0,
            following: d.public_metrics?.following_count ?? 0,
            tweets: d.public_metrics?.tweet_count ?? 0,
            avatar: avatarUrl(d.profile_image_url, handle),
            verified: d.verified_type === 'blue' || d.verified_type === 'business',
            joined: d.created_at ?? null,
            location: d.location ?? null,
            website: d.entities?.url?.urls?.[0]?.expanded_url ?? null,
            isStub: false,
          };
        }
      }
    } catch { /* next source */ }
  }

  // ── Source 2: Sleepless Agent API ─────────────────────────────────────────
  const sleeplessKey = process.env.SLEEPLESS_API_KEY;
  if (!profile && sleeplessKey) {
    try {
      const res = await fetchWithTimeout(
        `${SLEEPLESS_BASE}/users/${handle}`,
        { headers: { Authorization: `Bearer ${sleeplessKey}`, 'Content-Type': 'application/json' } },
        8000
      );
      if (res.ok) {
        const json = await res.json();
        const raw = json?.data ?? json;
        if (raw && !raw.detail && !raw.error && (raw.name || raw.displayName || raw.screen_name || raw.userName || raw.username)) {
          const resolvedHandle = raw.screen_name ?? raw.userName ?? raw.username ?? handle;
          profile = {
            name: raw.name ?? raw.displayName ?? resolvedHandle,
            username: resolvedHandle,
            bio: raw.description ?? raw.bio ?? null,
            followers: raw.followers_count ?? raw.followersCount ?? 0,
            following: raw.following_count ?? raw.followingCount ?? raw.friends_count ?? 0,
            tweets: raw.tweet_count ?? raw.tweetsCount ?? raw.statuses_count ?? 0,
            avatar: avatarUrl(raw.profile_image_url_https ?? raw.profile_image_url, handle),
            verified: raw.is_blue_verified ?? raw.isBlueVerified ?? raw.verified ?? false,
            joined: raw.created_at ?? raw.createdAt ?? null,
            location: raw.location ?? null,
            website: raw.urls?.[0]?.expanded_url ?? raw.externalUrl ?? null,
            isStub: false,
          };
        }
      }
    } catch { /* next source */ }
  }

  // ── Source 3: Twitter syndication (no auth, often empty but worth trying) ──
  if (!profile) {
    try {
      const res = await fetchWithTimeout(
        `${SYNDICATION_BASE}?screen_names=${encodeURIComponent(handle)}`,
        { headers: { 'User-Agent': 'Mozilla/5.0' } },
        4000
      );
      if (res.ok) {
        const text = await res.text();
        if (text && text !== '[]' && text.length > 2) {
          const arr = JSON.parse(text);
          const raw = Array.isArray(arr) ? arr[0] : null;
          if (raw?.screen_name) {
            profile = {
              name: raw.name ?? raw.screen_name,
              username: raw.screen_name,
              bio: raw.description ?? null,
              followers: raw.followers_count ?? 0,
              following: raw.friends_count ?? 0,
              tweets: raw.statuses_count ?? 0,
              avatar: avatarUrl(raw.profile_image_url_https ?? raw.profile_image_url, handle),
              verified: raw.verified ?? false,
              joined: raw.created_at ?? null,
              location: raw.location ?? null,
              website: null,
              isStub: false,
            };
          }
        }
      }
    } catch { /* stub fallback */ }
  }

  // ── Stub: always render something ─────────────────────────────────────────
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

  // Resolve registry results
  const registryRes = await registryPromise;
  let registryMatches = registryRes.error ? [] : (registryRes.data ?? []);

  // If account was renamed, also check the current handle against the registry
  if (!profile.isStub && profile.username.toLowerCase() !== handle.toLowerCase()) {
    const { data: extraData } = await supabase
      .from('scammer_profiles')
      .select('id, slug, display_name, summary, amount_lost_usd, categories, verified, incident_date')
      .eq('status', 'approved')
      .or(`twitter_handle.ilike.${profile.username},aliases.cs.{"${profile.username}"}`)
      .limit(3);
    if (extraData?.length) {
      const seen = new Set(registryMatches.map((m: { id: string }) => m.id));
      registryMatches = [...registryMatches, ...extraData.filter((m: { id: string }) => !seen.has(m.id))];
    }
  }

  return NextResponse.json({ ok: true, profile, registryMatches });
}
