'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { label: 'Registry', href: '/directory' },
  { label: 'Report', href: '/submit' },
  { label: 'Whitepaper', href: '/whitepaper' },
  { label: 'About', href: '/about' },
  { label: 'Sources', href: '/sources' },
  { label: 'Appeal', href: '/appeal' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(11,12,16,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1f2133',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span
            style={{
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 900,
              fontSize: '18px',
              color: '#ccff00',
              letterSpacing: '0.08em',
            }}
          >
            REKT<span style={{ color: '#ffffff', fontWeight: 700 }}>gistry</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: 'Exo 2, sans-serif',
                fontSize: '13px',
                fontWeight: 500,
                padding: '6px 12px',
                borderRadius: '6px',
                color: pathname === link.href ? '#ccff00' : '#94a3b8',
                background: pathname === link.href ? 'rgba(204,255,0,0.08)' : 'transparent',
                transition: 'color 0.2s, background 0.2s',
                textDecoration: 'none',
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/directory?feature=1"
            style={{
              fontFamily: 'Exo 2, sans-serif',
              fontSize: '13px',
              fontWeight: 600,
              padding: '6px 12px',
              borderRadius: '6px',
              color: '#f59e0b',
              border: '1px solid rgba(245,158,11,0.3)',
              textDecoration: 'none',
              marginLeft: '4px',
            }}
          >
            ★ Feature a Profile
          </Link>
        </nav>

        {/* Mobile hamburger placeholder */}
        <div className="md:hidden">
          <span style={{ color: '#5a6080', fontSize: '20px' }}>☰</span>
        </div>
      </div>
    </header>
  );
}
