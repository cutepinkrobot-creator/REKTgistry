'use client';

import TwitterLookup from '@/components/TwitterLookup';

export default function LookupPage() {
  return (
    <main className="min-h-screen" style={{ paddingTop: '72px' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 10, fontWeight: 900, letterSpacing: '0.12em',
            padding: '3px 10px', borderRadius: 6, marginBottom: 14,
            backgroundColor: 'rgba(204,255,0,0.07)', color: '#ccff00',
            border: '1px solid rgba(100,130,0,0.35)', fontFamily: 'Orbitron, sans-serif',
          }}>
            ◈ IDENTITY LOOKUP
          </div>
          <h1 style={{
            fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 900,
            color: 'var(--text-primary)', fontFamily: 'Orbitron, sans-serif',
            margin: '0 0 10px', lineHeight: 1.2,
          }}>
            Search anyone.
          </h1>
          <p style={{
            fontSize: 13, color: 'var(--text-secondary)',
            fontFamily: 'Orbitron, sans-serif', margin: 0, lineHeight: 1.7,
          }}>
            Enter a Twitter handle to see their profile and check if they appear in the REKTgistry.
            Verify before you trust.
          </p>
        </div>

        <TwitterLookup />

      </div>
    </main>
  );
}
