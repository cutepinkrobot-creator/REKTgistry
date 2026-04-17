import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const CHAINABUSE_API = 'https://api.chainabuse.com/graphql';

const CATEGORY_MAP: Record<string, string> = {
  hack: 'other',
  phishing: 'phishing',
  rugpull: 'rug_pull',
  rug_pull: 'rug_pull',
  fraud: 'fake_project',
  scam: 'fake_project',
  fake_project: 'fake_project',
  ponzi: 'fake_project',
  ransomware: 'other',
  theft: 'other',
  other: 'other',
};

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

function mapCategory(raw: string | null | undefined): string {
  if (!raw) return 'other';
  const key = raw.toLowerCase().replace(/[^a-z_]/g, '');
  return CATEGORY_MAP[key] ?? 'other';
}

interface ChainabuseAddress {
  address: string;
  chain: string;
}

interface ChainabuseReport {
  id: string;
  createdAt: string;
  description: string | null;
  addresses: ChainabuseAddress[];
  category: string | null;
  subject: { name?: string } | null;
}

interface ChainabuseEdge {
  node: ChainabuseReport;
}

interface ChainabuseResponse {
  data?: {
    reports?: {
      edges?: ChainabuseEdge[];
    };
  };
  errors?: Array<{ message: string }>;
}

const QUERY = `
query {
  reports(
    first: 20
    orderBy: { field: CREATED_AT, direction: DESC }
  ) {
    edges {
      node {
        id
        createdAt
        description
        addresses {
          address
          chain
        }
        category
        subject {
          ... on Unknown {
            name
          }
        }
      }
    }
  }
}
`.trim();

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let apiResponse: ChainabuseResponse;

  try {
    const res = await fetch(CHAINABUSE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'REKTgistry-bot/1.0',
      },
      body: JSON.stringify({ query: QUERY }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Chainabuse API returned ${res.status}` },
        { status: 502 }
      );
    }

    apiResponse = (await res.json()) as ChainabuseResponse;
  } catch (err) {
    console.error('[chainabuse-sync] Fetch error:', err);
    return NextResponse.json(
      { error: 'Failed to reach Chainabuse API', details: String(err) },
      { status: 502 }
    );
  }

  if (apiResponse.errors && apiResponse.errors.length > 0) {
    const msgs = apiResponse.errors.map((e) => e.message).join('; ');
    console.error('[chainabuse-sync] GraphQL errors:', msgs);
    return NextResponse.json(
      { error: 'Chainabuse GraphQL errors', details: msgs },
      { status: 502 }
    );
  }

  const edges = apiResponse.data?.reports?.edges;
  if (!Array.isArray(edges)) {
    return NextResponse.json(
      { error: 'Unexpected Chainabuse response shape', raw: JSON.stringify(apiResponse).slice(0, 500) },
      { status: 502 }
    );
  }

  const supabase = getSupabase();
  let checked = 0;
  let created = 0;
  let skipped = 0;

  for (const edge of edges) {
    const report = edge?.node;
    if (!report?.id) continue;
    checked++;

    const walletAddresses: string[] = (report.addresses ?? []).map((a) => a.address).filter(Boolean);

    // Check if any wallet address already exists in a profile
    let alreadyExists = false;
    if (walletAddresses.length > 0) {
      const { data: existing } = await supabase
        .from('scammer_profiles')
        .select('id')
        .overlaps('wallet_addresses', walletAddresses)
        .maybeSingle();
      if (existing) {
        alreadyExists = true;
      }
    } else {
      // No addresses — check by slug to avoid duplicates
      const dateStr = report.createdAt
        ? new Date(report.createdAt).toISOString().split('T')[0]
        : 'unknown';
      const slug = `chainabuse-${report.id}-${dateStr}`;
      const { data: existing } = await supabase
        .from('scammer_profiles')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();
      if (existing) alreadyExists = true;
    }

    if (alreadyExists) {
      skipped++;
      continue;
    }

    const firstAddress = report.addresses?.[0];
    const chain = firstAddress?.chain ?? null;
    const subjectName = report.subject?.name;
    const displayName = subjectName
      ? subjectName
      : chain
      ? `Unknown — ${chain} Address`
      : 'Unknown Address';

    const dateStr = report.createdAt
      ? new Date(report.createdAt).toISOString().split('T')[0]
      : 'unknown';
    const slug = `chainabuse-${report.id}-${dateStr}`;

    const summary = report.description
      ? report.description.slice(0, 400)
      : '';

    const category = mapCategory(report.category);

    const { error } = await supabase.from('scammer_profiles').insert({
      display_name: displayName.slice(0, 255),
      slug,
      profile_type: 'person',
      status: 'pending',
      categories: [category],
      summary,
      wallet_addresses: walletAddresses,
      chain,
      incident_date: dateStr === 'unknown' ? null : dateStr,
      verified: false,
      reports_count: 1,
    });

    if (error) {
      console.error('[chainabuse-sync] Insert error:', error.message, { slug });
      skipped++;
    } else {
      created++;
    }
  }

  return NextResponse.json({ checked, new: created, skipped });
}
