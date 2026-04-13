'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setError('Invalid password. Access denied.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0b0c10',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Orbitron', sans-serif",
        padding: '24px',
      }}
    >
      {/* Subtle grid overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(204,255,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(204,255,0,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '420px',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div
            style={{
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 900,
              fontSize: '32px',
              letterSpacing: '0.08em',
              marginBottom: '8px',
            }}
          >
            <span style={{ color: '#ccff00' }}>REKT</span>
            <span style={{ color: '#ffffff', fontWeight: 700 }}>gistry</span>
          </div>
          <div
            style={{
              fontSize: '11px',
              color: '#5a6080',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            Admin Portal
          </div>
        </div>

        {/* Card */}
        <div
          style={{
            background: 'rgba(15,20,0,0.4)',
            border: '1px solid rgba(100,130,0,0.3)',
            borderRadius: '12px',
            padding: '36px 32px',
            boxShadow: '0 0 40px rgba(204,255,0,0.05)',
          }}
        >
          <h1
            style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '14px',
              fontWeight: 700,
              color: '#ccff00',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '28px',
              margin: '0 0 28px 0',
            }}
          >
            Authenticate
          </h1>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '11px',
                  color: '#5a6080',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}
              >
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                placeholder="Enter admin password"
                style={{
                  width: '100%',
                  background: 'rgba(11,12,16,0.8)',
                  border: '1px solid rgba(100,130,0,0.3)',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  color: '#e2e8f0',
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(204,255,0,0.5)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(100,130,0,0.3)';
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  marginBottom: '20px',
                  color: '#f87171',
                  fontSize: '12px',
                  letterSpacing: '0.05em',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              style={{
                width: '100%',
                background: loading || !password ? 'rgba(100,130,0,0.2)' : '#ccff00',
                color: loading || !password ? '#5a6080' : '#0b0c10',
                border: 'none',
                borderRadius: '8px',
                padding: '13px',
                fontFamily: 'Orbitron, sans-serif',
                fontWeight: 700,
                fontSize: '13px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: loading || !password ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {loading ? 'Authenticating...' : 'Access Portal'}
            </button>
          </form>
        </div>

        <div
          style={{
            textAlign: 'center',
            marginTop: '24px',
            fontSize: '11px',
            color: '#3a4020',
            letterSpacing: '0.1em',
          }}
        >
          REKTGISTRY ADMIN — AUTHORIZED PERSONNEL ONLY
        </div>
      </div>
    </div>
  );
}
