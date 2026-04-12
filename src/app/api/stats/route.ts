import { NextResponse } from 'next/server';
import { getTotalStats } from '@/lib/supabase';

// In-memory cache (resets on cold start, but persists across requests in the same instance)
let cache: { data: StatsData; timestamp: number } | null = null;
// Force cache bust on next request
cache = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

interface StatsData {
  totalLostUsd: number;         // Our DB: total losses across our profiles
  totalHackEvents: number;      // Our DB: total profile count
  industryLostUsd: number;      // SlowMist: total industry losses all-time
  industryHackEvents: number;   // SlowMist: total industry hack events
  phishingDomains: number;      // MetaMask eth-phishing-detect: blacklisted domains
  scamDomains: number;          // ScamSniffer: confirmed scam domains
  lastUpdated: string;          // ISO timestamp
  sources: string[];            // Which sources responded successfully
}

async function fetchSlowMistStats(): Promise<{ lostUsd: number; events: number } | null> {
  try {
    const res = await fetch('https://hacked.slowmist.io/', {
      next: { revalidate: 3600 },
      headers: { 'User-Agent': 'REKTgistry/1.0 (web3 scam registry)' },
    });
    if (!res.ok) return null;
    const html = await res.text();

    // Extract total lost: "$ 37,365,543,142.24"
    const lostMatch = html.match(/\$\s*([\d,]+\.[\d]+)/);
    // Extract event count: "Total hack events 2046"
    const eventsMatch = html.match(/Total hack events\s*([\d,]+)/);

    if (!lostMatch || !eventsMatch) return null;

    const lostUsd = parseFloat(lostMatch[1].replace(/,/g, ''));
    const events = parseInt(eventsMatch[1].replace(/,/g, ''), 10);
    return { lostUsd, events };
  } catch {
    return null;
  }
}

async function fetchMetaMaskPhishingCount(): Promise<number | null> {
  try {
    const res = await fetch(
      'https://raw.githubusercontent.com/MetaMask/eth-phishing-detect/main/src/config.json',
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    // blacklist + fuzzylist (high-confidence phishing)
    const count =
      (Array.isArray(data.blacklist) ? data.blacklist.length : 0) +
      (Array.isArray(data.fuzzylist) ? data.fuzzylist.length : 0);
    return count;
  } catch {
    return null;
  }
}

async function fetchScamSnifferCount(): Promise<number | null> {
  try {
    const res = await fetch(
      'https://raw.githubusercontent.com/scamsniffer/scam-database/main/blacklist/domains.json',
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) ? data.length : null;
  } catch {
    return null;
  }
}

export async function GET() {
  // Serve from cache if fresh
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        'X-Cache': 'HIT',
      },
    });
  }

  // Fetch all sources in parallel
  const [slowMist, metamaskCount, scamSnifferCount, supabaseStats] = await Promise.all([
    fetchSlowMistStats(),
    fetchMetaMaskPhishingCount(),
    fetchScamSnifferCount(),
    getTotalStats().catch(() => null),
  ]);

  const sources: string[] = [];
  if (supabaseStats) sources.push('REKTgistry Database');
  if (slowMist) sources.push('SlowMist Hacked');
  if (metamaskCount !== null) sources.push('MetaMask eth-phishing-detect');
  if (scamSnifferCount !== null) sources.push('ScamSniffer');

  const data: StatsData = {
    totalLostUsd: supabaseStats?.totalLost ?? 0,
    totalHackEvents: supabaseStats?.count ?? 0,
    industryLostUsd: slowMist?.lostUsd ?? 0,
    industryHackEvents: slowMist?.events ?? 0,
    phishingDomains: metamaskCount ?? 0,
    scamDomains: scamSnifferCount ?? 0,
    lastUpdated: new Date().toISOString(),
    sources,
  };

  // Update cache
  cache = { data, timestamp: Date.now() };

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      'X-Cache': 'MISS',
    },
  });
}
