'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { topIndividuals, recentIncidents, allProfiles, formatUsd, formatDate, STATS } from '@/lib/data';

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center p-4 rounded-xl" style={{ background: '#14161e', border: '1px solid #1f2133' }}>
      <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '28px', fontWeight: 800, color: '#ccff00' }}>{value}</div>
      <div style={{ fontSize: '11px', color: '#5a6080', marginTop: '4px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
}

function ProfileCard({ profile, rank }: { profile: (typeof topIndividuals)[0]; rank?: number }) {
  return (
    <div className="rounded-xl p-5 flex flex-col gap-3 transition-opacity hover:opacity-80" style={{ background: '#14161e', border: '1px solid #1f2133' }}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          {rank && <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '24px', fontWeight: 900, color: '#1f2133' }}>{String(rank).padStart(2, '0')}</span>}
          <div className="flex items-center justify-center rounded-lg" style={{ width: '40px', height: '40px', background: 'rgba(74,126,255,0.1)', color: '#4a7eff', fontFamily: 'Orbitron, sans-serif', fontSize: '14px', flexShrink: 0 }}>
            {profile.name.slice(0, 2).toUpperCase()}
          </div>
        </div>
        <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', padding: '3px 7px', borderRadius: '4px', background: 'rgba(255,80,80,0.1)', color: '#ff5050', border: '1px solid rgba(255,80,80,0.2)' }}>
          ◈ REPORTED
        </span>
      </div>
      <div>
        <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '13px', fontWeight: 700, color: '#e2e8f0', marginBottom: '2px' }}>{profile.name}</h3>
        {profile.aliases && <p style={{ fontSize: '11px', color: '#5a6080' }}>{profile.aliases.join(' · ')}</p>}
      </div>
      <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5', flex: 1 }}>{profile.summary.slice(0, 110)}...</p>
      <div className="flex items-center justify-between">
        <div>
          <div style={{ fontSize: '10px', color: '#5a6080', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Reported Loss</div>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '14px', fontWeight: 700, color: '#ff5050' }}>{formatUsd(profile.lossUsd)}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px', color: '#5a6080', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Reports</div>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '14px', fontWeight: 700, color: '#ccff00' }}>{profile.reports}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {profile.category.map((cat) => (
          <span key={cat} style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '4px', background: 'rgba(74,126,255,0.08)', color: '#4a7eff', border: '1px solid rgba(74,126,255,0.15)' }}>{cat}</span>
        ))}
      </div>
      <div style={{ fontSize: '11px', color: '#5a6080' }}>
        {formatDate(profile.date)}{profile.twitter && <span> · @{profile.twitter}</span>}
      </div>
    </div>
  );
}

function RecentCard({ profile }: { profile: (typeof recentIncidents)[0] }) {
  return (
    <div className="rounded-xl p-4 flex flex-col gap-2 transition-opacity hover:opacity-80" style={{ background: '#14161e', border: '1px solid #1f2133' }}>
      <div className="flex items-center justify-between">
        <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,80,80,0.1)', color: '#ff5050', border: '1px solid rgba(255,80,80,0.2)' }}>◈ REPORTED</span>
        <span style={{ fontSize: '10px', color: '#5a6080' }}>{formatDate(profile.date)}</span>
      </div>
      <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '12px', fontWeight: 700, color: '#e2e8f0' }}>{profile.name}</h3>
      <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.4' }}>{profile.summary.slice(0, 80)}...</p>
      <div className="flex items-center justify-between mt-1">
        <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(74,126,255,0.08)', color: '#4a7eff', border: '1px solid rgba(74,126,255,0.15)' }}>{profile.category[0]}</span>
        <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '12px', fontWeight: 700, color: '#ff5050' }}>{formatUsd(profile.lossUsd)}</span>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(query.trim() ? `/directory?q=${encodeURIComponent(query.trim())}` : '/directory');
  };

  const biggestThreats = allProfiles.filter(p => p.lossUsd > 100_000_000).slice(0, 3);

  return (
    <div className="relative z-10">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-12 text-center">
        <div className="inline-block mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', color: '#5a6080', padding: '4px 12px', border: '1px solid #1f2133', borderRadius: '4px' }}>
          ◈ WEB3 SCAM REGISTRY · 12,860+ PROFILES
        </div>
        <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(26px, 5vw, 50px)', fontWeight: 900, color: '#e2e8f0', lineHeight: 1.15, marginBottom: '12px' }}>
          Know who you&apos;re working with.{' '}
          <span className="dissolve" style={{ color: '#ccff00' }}>Before it&apos;s too late.</span>
        </h1>
        <p style={{ fontSize: '16px', color: '#94a3b8', maxWidth: '560px', margin: '0 auto 36px', lineHeight: 1.6 }}>
          Scammers operate in the dark. The community fights back. Search our registry before trusting anyone in Web3.
        </p>
        <form onSubmit={handleSearch} className="max-w-xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, wallet address, Twitter handle..."
              style={{ flex: 1, background: '#14161e', border: '1px solid #1f2133', borderRadius: '8px', padding: '12px 16px', fontSize: '14px', color: '#e2e8f0', outline: 'none', fontFamily: "'Exo 2', sans-serif" }}
            />
            <button type="submit" style={{ background: '#4a7eff', color: '#fff', fontFamily: 'Orbitron, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', padding: '12px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', boxShadow: '0 0 20px rgba(74,126,255,0.3)', whiteSpace: 'nowrap' }}>
              SEARCH
            </button>
          </div>
          <p style={{ fontSize: '11px', color: '#5a6080', marginTop: '8px' }}>Try: wallet address, Twitter @handle, or project name</p>
        </form>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard value={STATS.totalProfiles.toLocaleString() + '+'} label="Profiles Tracked" />
          <StatCard value="$688M+" label="Total Reported Losses" />
          <StatCard value={STATS.communityReports.toLocaleString() + '+'} label="Community Reports" />
          <StatCard value={STATS.dataSources + '+'} label="Data Sources" />
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { num: '01', title: 'Search Before You Work', body: 'Look up any name, wallet address, or social handle before engaging with someone in Web3.' },
            { num: '02', title: 'Review the Evidence', body: 'Community-submitted transaction hashes, screenshots, and verified on-chain data.' },
            { num: '03', title: 'Report a Scammer', body: 'Submit a verified report with evidence. Our team reviews before publishing.' },
          ].map((step) => (
            <div key={step.num} className="p-5 rounded-xl" style={{ background: '#14161e', border: '1px solid #1f2133' }}>
              <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '28px', fontWeight: 900, color: '#1f2133', marginBottom: '8px' }}>{step.num}</div>
              <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '12px', fontWeight: 700, color: '#ccff00', marginBottom: '8px', letterSpacing: '0.05em' }}>{step.title}</h3>
              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Hall of Shame */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '10px', color: '#5a6080', letterSpacing: '0.2em', marginBottom: '4px' }}>◈ DARK SIDE INTEL</div>
            <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '22px', fontWeight: 800, color: '#e2e8f0' }}>Most Wanted</h2>
          </div>
          <Link href="/directory" style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '10px', color: '#4a7eff', textDecoration: 'none', letterSpacing: '0.08em' }}>VIEW ALL →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {topIndividuals.map((profile, i) => <ProfileCard key={profile.id} profile={profile} rank={i + 1} />)}
        </div>

        {/* Biggest Threats */}
        <div className="rounded-xl p-5 mb-6" style={{ background: '#14161e', border: '1px solid #1f2133' }}>
          <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '13px', fontWeight: 700, color: '#ccff00', marginBottom: '12px', letterSpacing: '0.05em' }}>
            This Year&apos;s Biggest Threats (TOP 3)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {biggestThreats.map((p, i) => (
              <div key={p.id} className="flex items-start gap-3">
                <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '20px', fontWeight: 900, color: '#1f2133', lineHeight: 1 }}>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px', fontWeight: 700, color: '#e2e8f0' }}>{p.name}</div>
                  <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '12px', color: '#ff5050', marginTop: '2px' }}>{formatUsd(p.lossUsd)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Worst Individuals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '20px', fontWeight: 800, color: '#e2e8f0', marginBottom: '16px' }}>Top Worst Individuals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topIndividuals.map((profile, i) => <ProfileCard key={profile.id + '-b'} profile={profile} rank={i + 1} />)}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-10">
        <div className="rounded-xl p-4" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
          <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.6 }}>
            <strong style={{ color: '#f59e0b' }}>Disclaimer:</strong> All profiles represent alleged community reports and have not been legally verified. Provided for due diligence purposes only.{' '}
            <Link href="/dispute" style={{ color: '#f59e0b' }}>File a dispute</Link> or <Link href="/appeal" style={{ color: '#f59e0b' }}>submit an appeal</Link> if you believe a listing is inaccurate.
          </p>
        </div>
      </section>

      {/* Recently Reported */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '20px', fontWeight: 800, color: '#e2e8f0' }}>Recently Reported</h2>
          <Link href="/directory" style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '10px', color: '#4a7eff', textDecoration: 'none', letterSpacing: '0.08em' }}>VIEW ALL →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentIncidents.map((profile) => <RecentCard key={profile.id} profile={profile} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-20 text-center">
        <div className="rounded-2xl p-10" style={{ background: '#14161e', border: '1px solid #1f2133' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>🛡️</div>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '22px', fontWeight: 800, color: '#e2e8f0', marginBottom: '10px' }}>Protect the Community</h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '24px', lineHeight: 1.6 }}>Help others stay safe. Submit a verified report and help the community avoid bad actors.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/submit" style={{ background: '#4a7eff', color: '#fff', fontFamily: 'Orbitron, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', boxShadow: '0 0 20px rgba(74,126,255,0.3)' }}>
              SUBMIT A REPORT
            </Link>
            <Link href="/appeal" style={{ background: 'transparent', color: '#e2e8f0', fontFamily: 'Orbitron, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', padding: '12px 24px', borderRadius: '8px', border: '1px solid #1f2133', textDecoration: 'none' }}>
              FILE AN APPEAL
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
