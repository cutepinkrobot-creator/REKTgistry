import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ── Monitored accounts ────────────────────────────────────────────────────────
const MONITORED_ACCOUNTS = [
  { username: 'Jeremybtc',  label: '@jeremybtc' },
  { username: 'mastrXYZ',   label: '@mastrXYZ' },
];

const TWITTER_API = 'https://api.twitter.com/2';

// Keywords that suggest an incident worth drafting
const INCIDENT_KEYWORDS = [
  'stolen', 'hack', 'hacked', 'drained', 'exploit', 'exploited',
  'scam', 'phishing', 'rug', 'fraud', 'lost', 'million', 'billion',
  'alert', 'warning', 'breach', 'compromised', 'attack', 'theft',
  'exit scam', 'ponzi', 'rug pull',
];

const PROJECT_KEYWORDS = [
  'exchange', 'protocol', 'network', 'bridge', 'dao', 'defi', 'finance',
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function getSupabase() {
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key  = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  if (request.headers.get('x-cron-secret') === secret) return true;
  if (request.headers.get('authorization') === `Bearer ${secret}`) return true;
  return false;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100);
}

function extractAmount(text: string): number | null {
  const patterns: [RegExp, number][] = [
    [/\$(\d+(?:\.\d+)?)\s*billion/i,  1_000_000_000],
    [/\$(\d+(?:\.\d+)?)\s*B\b/,       1_000_000_000],
    [/\$(\d+(?:\.\d+)?)\s*million/i,  1_000_000],
    [/\$(\d+(?:\.\d+)?)\s*M\b/,       1_000_000],
    [/\$(\d+(?:,\d{3})*(?:\.\d+)?)/,  1],
  ];
  for (const [pattern, multiplier] of patterns) {
    const match = text.match(pattern);
    if (match) return parseFloat(match[1].replace(/,/g, '')) * multiplier;
  }
  return null;
}

/**
 * Try to extract a meaningful entity name from a tweet.
 * Looks for patterns like "XXX Protocol", "XXX Exchange", dollar signs near names, etc.
 * Falls back to first 60 chars of tweet.
 */
function extractEntityName(text: string): string {
  // Pattern: "Alert: <name> has been" / "<name> hacked for"
  const alertMatch = text.match(/(?:alert|breaking)[:\s]+([A-Z][A-Za-z0-9 _\-\.]{2,50}?)(?:\s+(?:has been|was|hacked|drained|exploited|lost|scam))/i);
  if (alertMatch) return alertMatch[1].trim();

  // Proper-noun word followed by Protocol/Exchange/Finance/Network/Labs/DAO
  const projectMatch = text.match(/\b([A-Z][A-Za-z0-9]+(?:\s[A-Z][A-Za-z0-9]+){0,3})\s+(?:Protocol|Exchange|Finance|Network|Labs|DAO|Bridge|Fund|Capital)/i);
  if (projectMatch) return projectMatch[1].trim() + ' ' + text.match(/Protocol|Exchange|Finance|Network|Labs|DAO|Bridge|Fund|Capital/i)?.[0];

  // @handle mention at start
  const handleMatch = text.match(/^@([A-Za-z0-9_]+)/);
  if (handleMatch) return '@' + handleMatch[1];

  // Fallback: first 60 chars, trimmed at word boundary
  const fallback = text.slice(0, 60).replace(/\s+\S*$/, '');
  return fallback || text.slice(0, 40);
}

// ── Twitter API helpers ───────────────────────────────────────────────────────
async function getUserIds(
  usernames: string[],
  bearerToken: string,
): Promise<Record<string, string>> {
  const url = `${TWITTER_API}/users/by?usernames=${usernames.join(',')}&user.fields=id,username`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${bearerToken}` },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Twitter users/by failed ${res.status}: ${body}`);
  }
  const json = await res.json();
  const map: Record<string, string> = {};
  for (const u of json.data ?? []) map[u.username.toLowerCase()] = u.id;
  return map;
}

async function getUserTweets(
  userId: string,
  bearerToken: string,
  sinceHours = 6,
): Promise<Array<{ id: string; text: string; created_at: string }>> {
  const startTime = new Date(Date.now() - sinceHours * 60 * 60 * 1000).toISOString();
  const params = new URLSearchParams({
    'tweet.fields': 'created_at,text',
    max_results: '20',
    exclude: 'retweets,replies',
    start_time: startTime,
  });
  const url = `${TWITTER_API}/users/${userId}/tweets?${params}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${bearerToken}` },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Twitter users/:id/tweets failed ${res.status}: ${body}`);
  }
  const json = await res.json();
  return json.data ?? [];
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const bearerToken = process.env.TWITTER_BEARER_TOKEN;
  if (!bearerToken) {
    return NextResponse.json({ error: 'TWITTER_BEARER_TOKEN not configured' }, { status: 503 });
  }

  const supabase = getSupabase();
  const summary: Record<string, { checked: number; created: number; skipped: number; tweets: string[] }> = {};

  try {
    // Resolve usernames → IDs (single batched request)
    const usernames = MONITORED_ACCOUNTS.map(a => a.username);
    const userIdMap = await getUserIds(usernames, bearerToken);

    for (const account of MONITORED_ACCOUNTS) {
      const userId = userIdMap[account.username.toLowerCase()];
      summary[account.label] = { checked: 0, created: 0, skipped: 0, tweets: [] };

      if (!userId) {
        summary[account.label].skipped++;
        continue;
      }

      const tweets = await getUserTweets(userId, bearerToken, 6);

      for (const tweet of tweets) {
        summary[account.label].checked++;
        const textLower = tweet.text.toLowerCase();

        // Must contain at least one incident keyword
        const hasKeyword = INCIDENT_KEYWORDS.some(kw => textLower.includes(kw));
        if (!hasKeyword) {
          summary[account.label].skipped++;
          continue;
        }

        const tweetUrl = `https://x.com/${account.username}/status/${tweet.id}`;

        // Deduplicate by tweet URL stored in `website`
        const { data: existing } = await supabase
          .from('scammer_profiles')
          .select('id')
          .eq('website', tweetUrl)
          .maybeSingle();

        if (existing) {
          summary[account.label].skipped++;
          continue;
        }

        const entityName = extractEntityName(tweet.text);
        const slug = slugify(`${entityName}-${new Date(tweet.created_at).toISOString().slice(0, 10)}`);

        if (!slug) {
          summary[account.label].skipped++;
          continue;
        }

        // Also check if slug already exists
        const { data: slugExists } = await supabase
          .from('scammer_profiles')
          .select('id')
          .eq('slug', slug)
          .maybeSingle();

        const finalSlug = slugExists ? `${slug}-${tweet.id.slice(-6)}` : slug;

        const isProject = PROJECT_KEYWORDS.some(kw => textLower.includes(kw));
        const amountLost = extractAmount(tweet.text);
        const incidentDate = new Date(tweet.created_at).toISOString().split('T')[0];

        const { error } = await supabase.from('scammer_profiles').insert({
          display_name: entityName.slice(0, 255),
          slug: finalSlug,
          profile_type: isProject ? 'project' : 'person',
          status: 'pending',
          categories: ['other'],
          summary: tweet.text.slice(0, 500),
          amount_lost_usd: amountLost,
          incident_date: incidentDate,
          verified: false,
          reports_count: 1,
          website: tweetUrl,
        });

        if (error) {
          console.error('[twitter-monitor] Insert error:', error.message, { slug: finalSlug });
          summary[account.label].skipped++;
        } else {
          summary[account.label].created++;
          summary[account.label].tweets.push(`${entityName} — ${tweet.text.slice(0, 80)}…`);
        }
      }
    }

    return NextResponse.json({ ok: true, summary });
  } catch (err) {
    console.error('[twitter-monitor] Error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
