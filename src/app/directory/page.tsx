'use client';
import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { allProfiles, formatUsd, formatDate, type ProfileType, type ScamCategory } from '@/lib/data';

const CATEGORIES: ScamCategory[] = ['Rug Pull', 'Phishing', 'Fake Project', 'Exit Scam', 'Pump & Dump', 'Social Engineering', 'Other'];
const TYPES: ProfileType[] = ['Person', 'Project', 'Exchange'];
const PER_PAGE = 12;

function DirectoryContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQ);
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [catFilter, setCatFilter] = useState<string>('All');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return allProfiles.filter((p) => {
      const matchQ = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.aliases?.some(a => a.toLowerCase().includes(query.toLowerCase()));
      const matchType = typeFilter === 'All' || p.type === typeFilter;
      const matchCat = catFilter === 'All' || p.category.includes(catFilter as ScamCategory);
      return matchQ && matchType && matchCat;
    });
  }, [query, typeFilter, catFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '10px', color: '#5a6080', letterSpacing: '0.2em', marginBottom: '6px' }}>◈ DIRECTORY</div>
        <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '32px', fontWeight: 900, color: '#e2e8f0', marginBottom: '4px' }}>Scammer Directory</h1>
        <p style={{ fontSize: '14px', color: '#5a6080' }}>12,860 alleged reports in the registry</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          placeholder="name, wallet, handle..."
          style={{ flex: 1, background: '#14161e', border: '1px solid #1f2133', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#e2e8f0', outline: 'none', fontFamily: "'Exo 2', sans-serif" }}
        />
        {/* Type filter */}
        <div className="flex gap-1">
          {['All', ...TYPES].map((t) => (
            <button
              key={t}
              onClick={() => { setTypeFilter(t); setPage(1); }}
              style={{
                fontFamily: 'Orbitron, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em',
                padding: '8px 12px', borderRadius: '6px', border: '1px solid',
                borderColor: typeFilter === t ? '#ccff00' : '#1f2133',
                background: typeFilter === t ? 'rgba(204,255,0,0.08)' : '#14161e',
                color: typeFilter === t ? '#ccff00' : '#5a6080',
                cursor: 'pointer',
              }}
            >
              {t}
            </button>
          ))}
        </div>
        {/* Category filter */}
        <select
          value={catFilter}
          onChange={(e) => { setCatFilter(e.target.value); setPage(1); }}
          style={{ background: '#14161e', border: '1px solid #1f2133', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#94a3b8', outline: 'none', fontFamily: "'Exo 2', sans-serif" }}
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Results count */}
      <p style={{ fontSize: '12px', color: '#5a6080', marginBottom: '16px' }}>
        Showing {paged.length} of {filtered.length} results
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {paged.map((profile) => (
          <div key={profile.id} className="rounded-xl p-4 flex flex-col gap-2 transition-opacity hover:opacity-80" style={{ background: '#14161e', border: '1px solid #1f2133' }}>
            <div className="flex items-center justify-between">
              <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,80,80,0.1)', color: '#ff5050', border: '1px solid rgba(255,80,80,0.2)' }}>◈ REPORTED</span>
              <span style={{ fontSize: '10px', background: 'rgba(74,126,255,0.08)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(74,126,255,0.15)', color: '#4a7eff' }}>{profile.type}</span>
            </div>
            <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '13px', fontWeight: 700, color: '#e2e8f0' }}>{profile.name}</h3>
            {profile.aliases && <p style={{ fontSize: '11px', color: '#5a6080' }}>{profile.aliases.join(' · ')}</p>}
            <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.4', flex: 1 }}>{profile.summary.slice(0, 90)}...</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {profile.category.map((cat) => (
                <span key={cat} style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(139,92,246,0.08)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.15)' }}>{cat}</span>
              ))}
            </div>
            <div className="flex items-center justify-between mt-1">
              <div>
                <div style={{ fontSize: '9px', color: '#5a6080', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Loss</div>
                <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '13px', fontWeight: 700, color: '#ff5050' }}>{formatUsd(profile.lossUsd)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '9px', color: '#5a6080', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Reports</div>
                <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '13px', fontWeight: 700, color: '#ccff00' }}>{profile.reports}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '9px', color: '#5a6080', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Date</div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>{formatDate(profile.date)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '10px', fontWeight: 700, padding: '8px 16px', borderRadius: '6px', border: '1px solid #1f2133', background: '#14161e', color: page === 1 ? '#1f2133' : '#94a3b8', cursor: page === 1 ? 'default' : 'pointer' }}>
            ← PREV
          </button>
          <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px', color: '#5a6080' }}>
            Page {page} of {totalPages}
          </span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '10px', fontWeight: 700, padding: '8px 16px', borderRadius: '6px', border: '1px solid #1f2133', background: '#14161e', color: page === totalPages ? '#1f2133' : '#94a3b8', cursor: page === totalPages ? 'default' : 'pointer' }}>
            NEXT →
          </button>
        </div>
      )}
    </div>
  );
}

export default function DirectoryPage() {
  return (
    <Suspense fallback={<div style={{ color: '#5a6080', padding: '40px', textAlign: 'center' }}>Loading...</div>}>
      <DirectoryContent />
    </Suspense>
  );
}
