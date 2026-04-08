import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #1f2133', marginTop: '80px', padding: '40px 24px 32px' }}>
      <div className="max-w-7xl mx-auto">
        {/* Decorative divider */}
        <div className="flex items-center gap-4 mb-6">
          <div style={{ flex: 1, height: '1px', background: '#1f2133' }} />
          <span
            style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              color: '#ccff00',
              letterSpacing: '0.15em',
              padding: '4px 12px',
              border: '1px solid rgba(204,255,0,0.2)',
              borderRadius: '4px',
            }}
          >
            REKTgistry
          </span>
          <div style={{ flex: 1, height: '1px', background: '#1f2133' }} />
        </div>

        <p
          style={{
            textAlign: 'center',
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '10px',
            color: '#5a6080',
            letterSpacing: '0.15em',
            marginBottom: '20px',
          }}
        >
          COMMUNITY ALLIANCE VS THE DARK SIDE
        </p>

        {/* Footer links row 1 */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-3">
          {[
            { label: 'Submit Report', href: '/submit' },
            { label: 'Directory', href: '/directory' },
            { label: 'About', href: '/about' },
            { label: 'Sources', href: '/sources' },
            { label: 'Brand', href: '/brand' },
            { label: 'Whitepaper', href: '/whitepaper' },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{ color: '#5a6080', fontSize: '12px', textDecoration: 'none' }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Footer links row 2 */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6">
          {[
            { label: 'Appeal', href: '/appeal' },
            { label: 'Dispute', href: '/dispute' },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{ color: '#5a6080', fontSize: '12px', textDecoration: 'none' }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/directory?feature=1"
            style={{ color: '#f59e0b', fontSize: '12px', textDecoration: 'none', fontWeight: 600 }}
          >
            ★ Feature a Profile
          </Link>
        </div>

        {/* Disclaimer */}
        <p style={{ textAlign: 'center', color: '#5a6080', fontSize: '11px', maxWidth: '600px', margin: '0 auto' }}>
          All profiles are <strong style={{ color: '#94a3b8' }}>alleged</strong> reports and have not been legally verified.
        </p>
      </div>
    </footer>
  );
}
