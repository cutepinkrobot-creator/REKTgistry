import Link from 'next/link';

export default function WhitepaperPage() {
  const sections = [
    { num: '01', icon: '🛡️', title: 'The Problem', body: 'The Web3 ecosystem loses billions of dollars annually to scams, rug pulls, phishing attacks, and protocol exploits. Despite the scale, there is no unified community registry — information is scattered across Discord servers, Twitter threads, and forums where it quickly disappears.' },
    { num: '02', icon: '🌐', title: 'What We Built', body: 'REKTgistry aggregates wallet addresses, social handles, evidence links, and victim accounts — all searchable in a public, verifiable directory. Every entry is community-sourced and moderation-reviewed before publication.' },
    { num: '03', icon: '👥', title: 'Community Governance', body: 'Reports are submitted by the community and reviewed by moderators before appearing publicly. Any listed individual or project has the right to appeal. All profiles are labeled "alleged" until independently verified.' },
    { num: '04', icon: '🔒', title: 'Data Sources', body: 'We integrate with: DeFi Rekt, GoPlus Labs, Chainabuse, MetaMask eth-phishing-detect, ScamSniffer, OFAC SDN, SlowMist Hacked, Forta Network, ZachXBT research, PeckShield alerts, and community submissions.' },
    { num: '05', icon: '⚡', title: 'Technology Stack', body: 'Built on Next.js with a Supabase PostgreSQL backend. Features full-text search, a real-time moderation queue, on-chain address flagging via GoPlus API, and a public REST API for integrations.' },
    { num: '06', icon: '📈', title: 'Roadmap', body: 'Q2 2026: Public REST API launch. Q3 2026: IPFS attestation for reports. Q4 2026: Browser extension for real-time wallet warnings. Q1 2027: Cross-chain identity linking and verifiable credentials.' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Hero */}
      <div className="text-center mb-12">
        <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', color: '#ccff00', padding: '4px 12px', border: '1px solid rgba(204,255,0,0.2)', borderRadius: '4px' }}>◈ WHITEPAPER</span>
        <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '40px', fontWeight: 900, color: '#ccff00', marginTop: '16px', marginBottom: '4px', letterSpacing: '0.05em' }}>REKTgistry</h1>
        <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '16px', color: '#deff80', marginBottom: '8px' }}>Web3 Scam Registry</p>
        <p style={{ fontSize: '14px', color: '#5a6080', marginBottom: '4px' }}>Community intelligence infrastructure for a safer Web3</p>
        <p style={{ fontSize: '12px', color: '#5a6080' }}>Version 1.0 · REKTgistry</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
        {[
          { value: 'Growing', label: 'Reported Incidents' },
          { value: '10+', label: 'Data Sources' },
          { value: '14 days', label: 'Appeal Response' },
          { value: 'Free & Public', label: 'Access Model' },
        ].map((m) => (
          <div key={m.label} className="text-center p-4 rounded-xl" style={{ background: '#14161e', border: '1px solid #1f2133' }}>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '16px', fontWeight: 800, color: '#ccff00', marginBottom: '4px' }}>{m.value}</div>
            <div style={{ fontSize: '10px', color: '#5a6080', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-6 mb-12">
        {sections.map((s) => (
          <div key={s.num} className="rounded-xl p-6" style={{ background: '#14161e', border: '1px solid #1f2133' }}>
            <div className="flex items-start gap-4">
              <div>
                <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '10px', color: '#5a6080', letterSpacing: '0.15em', marginBottom: '4px' }}>{s.num}</div>
                <span style={{ fontSize: '24px' }}>{s.icon}</span>
              </div>
              <div>
                <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '14px', fontWeight: 700, color: '#ccff00', marginBottom: '8px', letterSpacing: '0.05em' }}>{s.title}</h2>
                <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.7 }}>{s.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legal notice */}
      <div className="rounded-xl p-5 mb-10" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.25)' }}>
        <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.7 }}>
          <strong style={{ color: '#f59e0b' }}>Legal Notice:</strong> All profiles on REKTgistry represent alleged community-reported activity and have not been independently verified or legally adjudicated. Information is provided for due diligence purposes only. An appeal process is available at <Link href="/appeal" style={{ color: '#f59e0b' }}>/appeal</Link>.
        </p>
      </div>

      {/* CTA cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: 'Browse Directory', desc: 'Search the full scammer registry', href: '/directory' },
          { title: 'Brand Guidelines', desc: 'Colours, fonts, and voice', href: '/brand' },
          { title: 'Data Sources', desc: 'APIs and databases we use', href: '/sources' },
        ].map((c) => (
          <Link key={c.href} href={c.href} style={{ textDecoration: 'none' }}>
            <div className="rounded-xl p-4 transition-opacity hover:opacity-80" style={{ background: '#14161e', border: '1px solid #1f2133', height: '100%' }}>
              <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px', fontWeight: 700, color: '#ccff00', marginBottom: '4px' }}>{c.title}</h3>
              <p style={{ fontSize: '12px', color: '#5a6080' }}>{c.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
