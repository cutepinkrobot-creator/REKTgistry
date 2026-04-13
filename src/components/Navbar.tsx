'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
  { label: 'Registry', href: '/directory' },
  { label: 'Report', href: '/submit' },
  { label: 'Sources', href: '/sources' },
  { label: 'Whitepaper', href: '/whitepaper' },
  { label: 'About', href: '/about' },
  { label: 'Appeal', href: '/appeal' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(11,12,16,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1f2133',
        fontFamily: 'Orbitron, sans-serif',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 900, fontSize: '18px', color: '#ccff00', letterSpacing: '0.08em' }}>
            REKT<span style={{ color: '#ffffff', fontWeight: 700 }}>gistry</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '11px',
                fontWeight: 600,
                padding: '6px 10px',
                borderRadius: '6px',
                color: pathname === link.href ? '#ccff00' : '#94a3b8',
                background: pathname === link.href ? 'rgba(204,255,0,0.08)' : 'transparent',
                transition: 'color 0.2s, background 0.2s',
                textDecoration: 'none',
                letterSpacing: '0.04em',
              }}
              onMouseEnter={(e) => { if (pathname !== link.href) (e.currentTarget as HTMLElement).style.color = '#ccff00'; }}
              onMouseLeave={(e) => { if (pathname !== link.href) (e.currentTarget as HTMLElement).style.color = '#94a3b8'; }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/promote"
            style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              padding: '6px 10px',
              borderRadius: '6px',
              color: '#f59e0b',
              border: '1px solid rgba(245,158,11,0.35)',
              textDecoration: 'none',
              marginLeft: '6px',
              letterSpacing: '0.04em',
            }}
          >
            ★ Feature
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg"
          style={{ background: menuOpen ? 'rgba(204,255,0,0.08)' : 'transparent', border: 'none', cursor: 'pointer' }}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span style={{ color: '#94a3b8', fontSize: '20px', fontFamily: 'sans-serif' }}>{menuOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="md:hidden"
          style={{
            background: 'rgba(11,12,16,0.98)',
            borderTop: '1px solid #1f2133',
            padding: '12px 16px 16px',
          }}
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: '12px',
                  fontWeight: 600,
                  padding: '10px 12px',
                  borderRadius: '8px',
                  color: pathname === link.href ? '#ccff00' : '#94a3b8',
                  background: pathname === link.href ? 'rgba(204,255,0,0.08)' : 'transparent',
                  textDecoration: 'none',
                  letterSpacing: '0.04em',
                  display: 'block',
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/promote"
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                padding: '10px 12px',
                borderRadius: '8px',
                color: '#f59e0b',
                border: '1px solid rgba(245,158,11,0.35)',
                textDecoration: 'none',
                marginTop: '4px',
                letterSpacing: '0.04em',
                display: 'block',
                textAlign: 'center',
              }}
            >
              ★ Feature a Profile
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
