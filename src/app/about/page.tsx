import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '10px', color: '#5a6080', letterSpacing: '0.2em', marginBottom: '6px' }}>◈ ABOUT</div>
      <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '32px', fontWeight: 900, color: '#e2e8f0', marginBottom: '8px' }}>
        We track the dark side so you don&apos;t have to
      </h1>
      <p style={{ fontSize: '16px', color: '#94a3b8', marginBottom: '40px', lineHeight: 1.7 }}>
        A free, community-powered registry of crypto scammers, rug pulls, and protocol exploits.
      </p>

      {/* The Problem */}
      <section className="mb-10">
        <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '18px', fontWeight: 800, color: '#ccff00', marginBottom: '12px' }}>The Problem</h2>
        <div className="rounded-xl p-6" style={{ background: '#14161e', border: '1px solid #1f2133' }}>
          <p style={{ fontSize: '22px', fontWeight: 700, color: '#ff5050', marginBottom: '12px', fontFamily: 'Orbitron, sans-serif' }}>
            $9.9B+
          </p>
          <p style={{ fontSize: '14px', color: '#e2e8f0', marginBottom: '8px' }}>drained from crypto victims in 2024 alone.</p>
          <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.7 }}>
            Information about scammers is fragmented across Discord servers, Twitter threads, and forum posts — and it disappears quickly. There has been no unified, searchable, community-verified registry. Until now.
          </p>
        </div>
      </section>

      {/* How We Operate */}
      <section className="mb-10">
        <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '18px', fontWeight: 800, color: '#ccff00', marginBottom: '12px' }}>How We Operate</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: '👁', title: 'Radical Transparency', color: '#ccff00', body: 'Every profile, report, and data source is visible to the public. No black-box moderation.' },
            { icon: '👥', title: 'Community-Powered', color: '#4a7eff', body: 'Reports come from real victims and community members. Our team reviews before publication.' },
            { icon: '🛡️', title: 'Due Process', color: '#8b5cf6', body: 'Everyone has the right to appeal. Reports are labeled "alleged" until independently verified.' },
            { icon: '⚡', title: 'Real-Time Protection', color: '#ff5050', body: 'Live scanning via GoPlus Security, DexScreener, and on-chain data keeps the registry current.' },
          ].map((item) => (
            <div key={item.title} className="rounded-xl p-5" style={{ background: '#14161e', border: '1px solid #1f2133' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{item.icon}</div>
              <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '12px', fontWeight: 700, color: item.color, marginBottom: '6px' }}>{item.title}</h3>
              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Legal */}
      <section className="mb-10">
        <div className="rounded-xl p-5" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.25)' }}>
          <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '12px', fontWeight: 700, color: '#f59e0b', marginBottom: '12px', letterSpacing: '0.05em' }}>LEGAL DISCLOSURES</h3>
          <ul style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.8, paddingLeft: '16px' }}>
            <li>All profiles are labeled &quot;alleged&quot; — no legal adjudication has occurred</li>
            <li>REKTgistry is not a law enforcement agency</li>
            <li>An appeal process is available at <Link href="/appeal" style={{ color: '#f59e0b' }}>/appeal</Link></li>
            <li>Information is provided for due diligence purposes only</li>
            <li>False reports may expose submitters to legal liability</li>
          </ul>
        </div>
      </section>

      {/* Timeline */}
      <section className="mb-10">
        <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '18px', fontWeight: 800, color: '#ccff00', marginBottom: '16px' }}>Our Story</h2>
        <div className="flex flex-col gap-4">
          {[
            { year: '2024', text: 'Project founded after the team personally lost funds to a coordinated rug pull.' },
            { year: 'Q1 2025', text: 'Launched beta with 500+ imported hack records from De.Fi REKT and CryptoScamDB.' },
            { year: 'Q2 2025', text: 'Added live on-chain scanning via GoPlus Security API.' },
            { year: 'Now', text: 'Open to the community — submit reports, track hacks, protect each other.' },
          ].map((item) => (
            <div key={item.year} className="flex gap-4 items-start">
              <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px', fontWeight: 700, color: '#ccff00', minWidth: '64px', paddingTop: '2px' }}>{item.year}</div>
              <div style={{ flex: 1, height: '1px', background: '#1f2133', marginTop: '10px' }} />
              <p style={{ fontSize: '13px', color: '#94a3b8', flex: 3, lineHeight: 1.6 }}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/submit" style={{ background: '#4a7eff', color: '#fff', fontFamily: 'Orbitron, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', boxShadow: '0 0 20px rgba(74,126,255,0.3)', textAlign: 'center' }}>
          SUBMIT A REPORT
        </Link>
        <Link href="/directory" style={{ background: 'transparent', color: '#e2e8f0', fontFamily: 'Orbitron, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', padding: '12px 24px', borderRadius: '8px', border: '1px solid #1f2133', textDecoration: 'none', textAlign: 'center' }}>
          BROWSE THE REGISTRY
        </Link>
      </div>
    </div>
  );
}
