export default function BrandPage() {
  const colors = [
    { name: 'Obsidian', hex: '#0b0c10', usage: 'Primary background' },
    { name: 'Card BG', hex: '#14161e', usage: 'Elevated surfaces' },
    { name: 'Border', hex: '#1f2133', usage: 'Dividers, lines' },
    { name: 'Slate', hex: '#5a6080', usage: 'Secondary text' },
    { name: 'Neon Yellow', hex: '#ccff00', usage: 'Primary accent, headings' },
    { name: 'Yellow Light', hex: '#deff80', usage: 'Secondary highlight' },
    { name: 'Accent Blue', hex: '#4a7eff', usage: 'Badges, buttons, links' },
    { name: 'Alert Red', hex: '#ff5050', usage: 'Warnings, destructive' },
    { name: 'Amber', hex: '#f59e0b', usage: 'Disclaimers, featured' },
    { name: 'Neon Green', hex: '#39ff14', usage: 'Live API status' },
    { name: 'Purple', hex: '#8b5cf6', usage: 'Intelligence category' },
    { name: 'Cyan', hex: '#06b6d4', usage: 'Research category' },
  ];

  const typeScale = [
    { name: 'Display / Hero', size: '48–72px', weight: 'Bold 700–900', color: 'White or Neon Yellow', font: 'Orbitron' },
    { name: 'H1', size: '32–36px', weight: 'Bold 700', color: 'Neon Yellow #ccff00', font: 'Orbitron' },
    { name: 'H2', size: '24–28px', weight: 'SemiBold 600', color: 'Yellow Light #deff80', font: 'Orbitron' },
    { name: 'Body / UI', size: '14–16px', weight: 'Regular 400', color: '#94a3b8', font: 'Exo 2' },
    { name: 'Labels / Meta', size: '11–12px', weight: 'Medium 500', color: 'Slate #5a6080', font: 'Exo 2' },
    { name: 'Code / Addresses', size: '13px', weight: 'Regular', color: 'Neon Yellow', font: 'Courier New' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Hero */}
      <div className="text-center mb-12">
        <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', color: '#ccff00', padding: '4px 12px', border: '1px solid rgba(204,255,0,0.2)', borderRadius: '4px' }}>◈ BRAND GUIDELINES</span>
        <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '44px', fontWeight: 900, color: '#ccff00', marginTop: '16px', letterSpacing: '0.06em' }}>REKTgistry</h1>
        <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '16px', color: '#deff80', marginBottom: '4px' }}>Web3 Scam Registry</p>
        <p style={{ fontSize: '14px', color: '#5a6080', fontStyle: 'italic' }}>Before it&apos;s too late.</p>
      </div>

      {/* Mission */}
      <section className="mb-10">
        <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '14px', fontWeight: 700, color: '#ccff00', marginBottom: '12px', letterSpacing: '0.1em' }}>BRAND OVERVIEW</h2>
        <div className="rounded-xl p-5" style={{ background: '#14161e', border: '1px solid #1f2133' }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Mission', text: 'Protect the Web3 ecosystem by making scammer information freely accessible, community-verified, and permanently on record.' },
              { label: 'Vision', text: 'A crypto space where transparency is the default and bad actors have nowhere to hide.' },
              { label: 'Tagline Rule', text: 'Always lowercase with period — "before it\'s too late." — never without the period.' },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '9px', fontWeight: 700, color: '#5a6080', letterSpacing: '0.15em', marginBottom: '4px' }}>{item.label.toUpperCase()}</div>
                <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.6 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Color Palette */}
      <section className="mb-10">
        <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '14px', fontWeight: 700, color: '#ccff00', marginBottom: '12px', letterSpacing: '0.1em' }}>COLOR PALETTE</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {colors.map((c) => (
            <div key={c.hex} className="rounded-xl overflow-hidden" style={{ border: '1px solid #1f2133' }}>
              <div style={{ height: '48px', background: c.hex, border: c.hex === '#0b0c10' ? '1px solid #1f2133' : 'none' }} />
              <div style={{ background: '#14161e', padding: '8px 10px' }}>
                <div style={{ fontFamily: 'Courier New, monospace', fontSize: '11px', color: '#ccff00', marginBottom: '2px' }}>{c.hex}</div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#e2e8f0', marginBottom: '1px' }}>{c.name}</div>
                <div style={{ fontSize: '10px', color: '#5a6080' }}>{c.usage}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section className="mb-10">
        <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '14px', fontWeight: 700, color: '#ccff00', marginBottom: '12px', letterSpacing: '0.1em' }}>TYPOGRAPHY</h2>
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1f2133' }}>
          {typeScale.map((t, i) => (
            <div key={t.name} style={{ padding: '12px 16px', background: i % 2 === 0 ? '#14161e' : '#0f1118', borderBottom: i < typeScale.length - 1 ? '1px solid #1f2133' : 'none' }}>
              <div className="flex flex-wrap gap-x-6 gap-y-1 items-baseline">
                <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '10px', color: '#5a6080', minWidth: '140px' }}>{t.name}</span>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>{t.size}</span>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>{t.weight}</span>
                <span style={{ fontSize: '11px', color: '#5a6080', fontFamily: t.font === 'Courier New' ? 'Courier New' : t.font === 'Orbitron' ? 'Orbitron, sans-serif' : "'Exo 2', sans-serif" }}>{t.font}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Voice & Tone */}
      <section className="mb-10">
        <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '14px', fontWeight: 700, color: '#ccff00', marginBottom: '12px', letterSpacing: '0.1em' }}>VOICE & TONE</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {[
            { title: 'Factual', body: 'We report what is documented. Claims are linked to evidence. We do not speculate or editorialize.' },
            { title: 'Direct', body: 'Short sentences. No corporate padding. Get to the point.' },
            { title: 'Restrained', body: 'We do not celebrate scammer exposure or use sensationalist language. Seriousness is our credibility.' },
            { title: 'Empowering', body: 'We give the community a tool. The tone is active — not passive or victim-focused.' },
          ].map((v) => (
            <div key={v.title} className="rounded-xl p-4" style={{ background: '#14161e', border: '1px solid #1f2133' }}>
              <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px', fontWeight: 700, color: '#ccff00', marginBottom: '6px' }}>{v.title}</h3>
              <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.6 }}>{v.body}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl p-4" style={{ background: 'rgba(57,255,20,0.04)', border: '1px solid rgba(57,255,20,0.2)' }}>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '10px', color: '#39ff14', fontWeight: 700, marginBottom: '8px', letterSpacing: '0.1em' }}>✓ DO</div>
            <ul style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.8, paddingLeft: '14px' }}>
              <li>Report verified facts with source links</li>
              <li>Use neutral language: &quot;reported for,&quot; &quot;alleged to have&quot;</li>
              <li>Acknowledge appeals promptly</li>
              <li>Keep CTAs short and active</li>
            </ul>
          </div>
          <div className="rounded-xl p-4" style={{ background: 'rgba(255,80,80,0.04)', border: '1px solid rgba(255,80,80,0.2)' }}>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '10px', color: '#ff5050', fontWeight: 700, marginBottom: '8px', letterSpacing: '0.1em' }}>✕ DON&apos;T</div>
            <ul style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.8, paddingLeft: '14px' }}>
              <li>Publish unverified rumours</li>
              <li>Use emotionally charged labels</li>
              <li>Call every listing a &quot;proven scam&quot;</li>
              <li>Use urgency manipulation (&quot;ACT NOW&quot;)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Legal */}
      <div className="rounded-xl p-5" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.25)' }}>
        <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px', fontWeight: 700, color: '#f59e0b', marginBottom: '10px', letterSpacing: '0.08em' }}>LEGAL & COMPLIANCE</h3>
        <ul style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.9, paddingLeft: '14px' }}>
          <li>All listings must be clearly labeled with verification status</li>
          <li>REKTgistry does not endorse or warrant community report accuracy</li>
          <li>&quot;Scammer&quot; and &quot;fraud&quot; refer to community-reported activity, not legal determinations</li>
          <li>Appeals must be processed within 14 business days</li>
          <li>Partnership use of wordmark or data requires direct team contact</li>
        </ul>
      </div>
    </div>
  );
}
