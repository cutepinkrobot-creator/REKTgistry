'use client';

import { useEffect, useState, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getProfiles, ScammerProfile } from '@/lib/supabase';

const PAGE_SIZE = 24;

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'rug_pull', label: 'Rug Pull' },
  { value: 'phishing', label: 'Phishing' },
  { value: 'fake_project', label: 'Fake Project' },
  { value: 'exit_scam', label: 'Exit Scam' },
  { value: 'pump_and_dump', label: 'Pump & Dump' },
  { value: 'social_engineering', label: 'Social Engineering' },
  { value: 'hack', label: 'Hack / Exploit' },
  { value: 'other', label: 'Other' },
];

const SORT_OPTIONS = [
  { value: 'reports_count', label: 'Most Reported' },
  { value: 'amount', label: 'Highest Loss' },
];

function formatUsd(n: number | null): string {
  if (!n) return '—';
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

function getInitial(name: string): string {
  return name?.charAt(0)?.toUpperCase() ?? '?';
}

function CategoryBadge({ cat }: { cat: string }) {
  const label = cat.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <span
      style={{
        fontSize: '10px',
        fontWeight: 600,
        padding: '2px 7px',
        borderRadius: '4px',
        backgroundColor: 'rgba(204,255,0,0.08)',
        color: '#99cc00',
        border: '1px solid rgba(100,130,0,0.35)',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </span>
  );
}

function ProfileCard({ profile }: { profile: ScammerProfile }) {
  const isPerson = profile.profile_type === 'person';
  const lossStr = formatUsd(profile.amount_lost_usd);

  return (
    <Link href={`/profile/${profile.slug}`} className="h-full block" style={{ textDecoration: 'none' }}>
      <div
        className="group dark-side-card rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 cursor-pointer relative overflow-hidden h-full flex flex-col"
        style={{ border: '1px solid var(--darkside-border)', minHeight: '180px' }}
      >
        <div
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{ background: 'radial-gradient(ellipse at top left, rgba(100,130,0,0.07) 0%, transparent 65%)' }}
        />

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <div
            className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded"
            style={{
              backgroundColor: 'rgba(55,70,0,0.3)',
              color: '#ccff00',
              border: '1px solid rgba(100,130,0,0.5)',
              letterSpacing: '0.08em',
            }}
          >
            ◈ {profile.verified ? 'VERIFIED' : 'REPORTED'}
          </div>
          <div
            className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded"
            style={{
              backgroundColor: 'rgba(136,153,187,0.1)',
              color: '#8899bb',
              border: '1px solid rgba(136,153,187,0.2)',
            }}
          >
            {isPerson ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/><path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"/></svg>
            )}
            {isPerson ? 'Person' : 'Project'}
          </div>
        </div>

        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{
                backgroundColor: 'rgba(55,70,0,0.35)',
                color: 'var(--text-card)',
                border: '1px solid rgba(100,130,0,0.45)',
              }}
            >
              {getInitial(profile.display_name)}
            </div>
            <div>
              <span className="font-semibold text-sm" style={{ color: 'var(--text-card)' }}>
                {profile.display_name}
              </span>
              {profile.twitter_handle && (
                <div className="text-xs mt-0.5" style={{ color: '#5a6080' }}>
                  @{profile.twitter_handle}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium flex-shrink-0" style={{ color: 'var(--text-card)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            {profile.reports_count ?? 0}
          </div>
        </div>

        {profile.summary && (
          <p
            className="text-xs mb-3 flex-1"
            style={{
              color: 'var(--text-secondary)',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {profile.summary}
          </p>
        )}

        {profile.categories?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {profile.categories.slice(0, 3).map((cat) => (
              <CategoryBadge key={cat} cat={cat} />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-2" style={{ borderTop: '1px solid rgba(100,130,0,0.15)' }}>
          <span className="text-xs font-bold" style={{ color: lossStr === '—' ? '#5a6080' : '#ccff00' }}>
            {lossStr !== '—' ? `${lossStr} lost` : 'Amount unknown'}
          </span>
          <div className="flex items-center gap-2">
            {profile.chain && (
              <span className="text-xs" style={{ color: '#5a6080' }}>{profile.chain}</span>
            )}
            {profile.incident_date && (
              <span className="text-xs" style={{ color: '#5a6080' }}>
                {new Date(profile.incident_date).getFullYear()}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div
      className="rounded-xl p-5 animate-pulse"
      style={{ border: '1px solid rgba(100,130,0,0.15)', background: 'var(--bg-card)', minHeight: '180px' }}
    >
      <div className="flex gap-2 mb-3">
        <div className="h-5 w-20 rounded" style={{ background: 'rgba(204,255,0,0.06)' }} />
        <div className="h-5 w-14 rounded" style={{ background: 'rgba(204,255,0,0.06)' }} />
      </div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-full" style={{ background: 'rgba(204,255,0,0.06)' }} />
        <div className="space-y-1">
          <div className="h-4 w-28 rounded" style={{ background: 'rgba(204,255,0,0.06)' }} />
          <div className="h-3 w-16 rounded" style={{ background: 'rgba(204,255,0,0.04)' }} />
        </div>
      </div>
      <div className="h-3 w-full rounded mb-1" style={{ background: 'rgba(204,255,0,0.04)' }} />
      <div className="h-3 w-3/4 rounded" style={{ background: 'rgba(204,255,0,0.04)' }} />
    </div>
  );
}

function DirectoryInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get('q') ?? '';
  const type = searchParams.get('type') ?? '';
  const category = searchParams.get('category') ?? '';
  const sort = searchParams.get('sort') ?? 'reports_count';
  const pageParam = parseInt(searchParams.get('page') ?? '1', 10);

  const [profiles, setProfiles] = useState<ScammerProfile[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(q);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getProfiles({
      page: pageParam,
      pageSize: PAGE_SIZE,
      search: q,
      category,
      sortBy: sort,
      profileType: type,
    }).then(({ data, count }) => {
      if (cancelled) return;
      setProfiles(data ?? []);
      setTotal(count ?? 0);
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [q, type, category, sort, pageParam]);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v) params.set(k, v);
        else params.delete(k);
      });
      if (!('page' in updates)) params.delete('page');
      router.push(`/directory?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearchChange = (val: string) => {
    setSearchInput(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateParams({ q: val });
    }, 400);
  };

  const totalPages = total ? Math.ceil(total / PAGE_SIZE) : 1;

  const activeStyle = {
    backgroundColor: 'var(--accent)',
    color: 'white',
    border: '1px solid transparent',
  };
  const inactiveStyle = {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--darkside-border)',
    color: 'var(--text-secondary)',
  };

  return (
    <main className="min-h-screen" style={{ paddingTop: '72px' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-black sw-title mb-1" style={{ color: 'var(--text-primary)' }}>
            Scammer Directory
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {total !== null
              ? `${total.toLocaleString()} alleged reports in the registry`
              : '12,860+ alleged reports in the registry'}
          </p>
        </div>

        {/* Type tabs */}
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          {[
            { value: '', label: 'All', icon: null },
            { value: 'person', label: 'People', icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
            { value: 'project', label: 'Projects', icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/><path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"/></svg> },
            { value: 'hack', label: 'Hacks & Exploits', icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg> },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => updateParams({ type: tab.value })}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
              style={type === tab.value ? activeStyle : inactiveStyle}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search + sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <svg
              xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--text-secondary)' }} aria-hidden="true"
            >
              <path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>
            </svg>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search name, wallet, handle..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg placeholder-gray-600 outline-none text-sm transition-colors"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--darkside-border)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
          <select
            value={sort}
            onChange={(e) => updateParams({ sort: e.target.value })}
            className="px-3 py-2.5 rounded-lg text-sm font-semibold outline-none"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--darkside-border)',
              color: 'var(--text-secondary)',
              minWidth: '150px',
            }}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Category chips */}
        <div className="flex items-center gap-2 flex-wrap mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-secondary)', flexShrink: 0 }} aria-hidden="true"><path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"/></svg>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => updateParams({ category: cat.value })}
              className="text-xs px-3 py-1.5 rounded-full transition-colors font-semibold"
              style={category === cat.value ? activeStyle : inactiveStyle}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Profile grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {loading
            ? Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} />)
            : profiles.length > 0
              ? profiles.map((p) => <ProfileCard key={p.id} profile={p} />)
              : (
                <div className="col-span-3 text-center py-16" style={{ color: 'var(--text-secondary)' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
                  <p className="font-semibold">No results found</p>
                  <p className="text-sm mt-1">Try adjusting your search or filters</p>
                </div>
              )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
            <button
              disabled={pageParam <= 1}
              onClick={() => updateParams({ page: String(pageParam - 1) })}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-40"
              style={inactiveStyle}
            >
              ← Prev
            </button>

            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let p: number;
              if (totalPages <= 7) {
                p = i + 1;
              } else if (pageParam <= 4) {
                p = i + 1;
              } else if (pageParam >= totalPages - 3) {
                p = totalPages - 6 + i;
              } else {
                p = pageParam - 3 + i;
              }
              return (
                <button
                  key={p}
                  onClick={() => updateParams({ page: String(p) })}
                  className="px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                  style={p === pageParam ? activeStyle : inactiveStyle}
                >
                  {p}
                </button>
              );
            })}

            <button
              disabled={pageParam >= totalPages}
              onClick={() => updateParams({ page: String(pageParam + 1) })}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-40"
              style={inactiveStyle}
            >
              Next →
            </button>

            <span className="text-xs ml-2" style={{ color: 'var(--text-secondary)' }}>
              Page {pageParam} of {totalPages.toLocaleString()}
            </span>
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 text-center">
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            Know a scammer not listed here?
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/submit"
              className="px-5 py-2.5 rounded-lg text-sm font-bold transition-colors"
              style={{ backgroundColor: '#ccff00', color: '#0b0c10' }}
            >
              + Report a Scammer
            </Link>
            <Link
              href="/directory?feature=1"
              className="px-5 py-2.5 rounded-lg text-sm font-semibold"
              style={{
                border: '1px solid rgba(245,158,11,0.4)',
                color: '#f59e0b',
                backgroundColor: 'transparent',
              }}
            >
              ★ Feature a Profile
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}

export default function DirectoryPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen" style={{ paddingTop: '72px' }}>
        <div className="max-w-7xl mx-auto px-4 py-8 text-center" style={{ color: 'var(--text-secondary)' }}>
          Loading directory...
        </div>
      </main>
    }>
      <DirectoryInner />
    </Suspense>
  );
}
