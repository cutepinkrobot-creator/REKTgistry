import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const RSS_URL = 'https://zachxbt.substack.com/feed';

const INCIDENT_KEYWORDS = [
  'stolen', 'hack', 'hacked', 'drained', 'exploit', 'exploited',
  'scam', 'phishing', 'rug', 'fraud', 'lost', 'million', 'billion',
];

const PROJECT_KEYWORDS = [
  'exchange', 'protocol', 'network', 'bridge', 'dao', 'defi',
];

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

function isAuthorized(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;

  const xCronSecret = request.headers.get('x-cron-secret');
  if (xCronSecret === cronSecret) return true;

  const authHeader = request.headers.get('authorization');
  if (authHeader === `Bearer ${cronSecret}`) return true;

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

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractAmount(text: string): number | null {
  // Match patterns like $5M, $5 million, $5 billion, $5,000,000
  const patterns = [
    /\$(\d+(?:\.\d+)?)\s*billion/i,
    /\$(\d+(?:\.\d+)?)\s*B\b/,
    /\$(\d+(?:\.\d+)?)\s*million/i,
    /\$(\d+(?:\.\d+)?)\s*M\b/,
    /\$(\d+(?:,\d{3})*(?:\.\d+)?)/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const num = parseFloat(match[1].replace(/,/g, ''));
      if (pattern.source.includes('billion')) return num * 1_000_000_000;
      if (pattern.source.includes('million') || pattern.source.endsWith('M\\b'))
        return num * 1_000_000;
      return num;
    }
  }
  return null;
}

function parseRssItems(xml: string): Array<{
  title: string;
  description: string;
  link: string;
  pubDate: string;
}> {
  const items: Array<{ title: string; description: string; link: string; pubDate: string }> = [];

  const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);
  for (const itemMatch of itemMatches) {
    const item = itemMatch[1];

    const titleMatch = item.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) ||
      item.match(/<title>([\s\S]*?)<\/title>/);
    const descMatch =
      item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) ||
      item.match(/<description>([\s\S]*?)<\/description>/);
    const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/) ||
      item.match(/<link\s[^>]*href="([^"]+)"/);
    const pubDateMatch = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/);

    if (titleMatch && pubDateMatch) {
      items.push({
        title: titleMatch[1].trim(),
        description: descMatch ? descMatch[1].trim() : '',
        link: linkMatch ? linkMatch[1].trim() : '',
        pubDate: pubDateMatch[1].trim(),
      });
    }
  }
  return items;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = await fetch(RSS_URL, {
      headers: { 'User-Agent': 'REKTgistry-bot/1.0' },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch RSS: ${response.status}` },
        { status: 502 }
      );
    }

    const xml = await response.text();
    const items = parseRssItems(xml);

    const cutoff = Date.now() - 48 * 60 * 60 * 1000;

    const supabase = getSupabase();
    let checked = 0;
    let created = 0;
    let skipped = 0;
    const postTitles: string[] = [];

    for (const item of items) {
      const pubMs = new Date(item.pubDate).getTime();
      if (isNaN(pubMs) || pubMs < cutoff) continue;

      checked++;
      const titleLower = item.title.toLowerCase();
      const descLower = item.description.toLowerCase();
      const combinedText = `${item.title} ${item.description}`;

      const hasKeyword = INCIDENT_KEYWORDS.some(
        (kw) => titleLower.includes(kw) || descLower.includes(kw)
      );
      if (!hasKeyword) {
        skipped++;
        continue;
      }

      const slug = slugify(item.title);
      if (!slug) {
        skipped++;
        continue;
      }

      // Check if slug already exists
      const { data: existing } = await supabase
        .from('scammer_profiles')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      if (existing) {
        skipped++;
        continue;
      }

      const isProject = PROJECT_KEYWORDS.some((kw) => titleLower.includes(kw));
      const plainDescription = stripHtml(item.description).slice(0, 400);
      const amountLost = extractAmount(combinedText);
      const incidentDate = new Date(item.pubDate).toISOString().split('T')[0];

      const { error } = await supabase.from('scammer_profiles').insert({
        display_name: item.title.slice(0, 255),
        slug,
        profile_type: isProject ? 'project' : 'person',
        status: 'pending',
        categories: ['other'],
        summary: plainDescription,
        amount_lost_usd: amountLost,
        incident_date: incidentDate,
        verified: false,
        reports_count: 1,
        website: item.link || null,
      });

      if (error) {
        console.error('[zachxbt-rss] Insert error:', error.message, { slug });
        skipped++;
      } else {
        created++;
        postTitles.push(item.title);
      }
    }

    return NextResponse.json({
      checked,
      new: created,
      skipped,
      posts: postTitles,
    });
  } catch (err) {
    console.error('[zachxbt-rss] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal server error', details: String(err) },
      { status: 500 }
    );
  }
}
