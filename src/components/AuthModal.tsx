'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  redirectAfter?: string
}

type AuthState = 'idle' | 'loading' | 'success' | 'error'

export default function AuthModal({ isOpen, onClose, redirectAfter }: AuthModalProps) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<AuthState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [sentEmail, setSentEmail] = useState('')

  if (!isOpen) return null

  const callbackUrl =
    typeof window !== 'undefined'
      ? window.location.origin + '/auth/callback' + (redirectAfter ? '?next=' + redirectAfter : '')
      : '/auth/callback'

  async function handleTwitter() {
    setState('loading')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'twitter',
      options: {
        redirectTo: callbackUrl,
      },
    })
    if (error) {
      setState('error')
      setErrorMsg(error.message)
    }
    // On success, the page navigates away — no need to close the modal
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setState('loading')
    setErrorMsg('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: callbackUrl,
      },
    })
    if (error) {
      setState('error')
      setErrorMsg(error.message)
    } else {
      setSentEmail(email.trim())
      setState('success')
    }
  }

  const orbitron: React.CSSProperties = { fontFamily: 'Orbitron, sans-serif' }

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.75)',
    backdropFilter: 'blur(4px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
  }

  const cardStyle: React.CSSProperties = {
    ...orbitron,
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 16,
    padding: '28px 24px',
    width: '100%',
    maxWidth: 440,
    position: 'relative',
    boxShadow: '0 0 40px rgba(0,0,0,0.6)',
  }

  const inputStyle: React.CSSProperties = {
    ...orbitron,
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box',
  }

  const btnBase: React.CSSProperties = {
    ...orbitron,
    width: '100%',
    padding: '12px 16px',
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    transition: 'opacity 0.15s',
  }

  return (
    <div style={overlayStyle} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div style={cardStyle}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            ...orbitron,
            position: 'absolute',
            top: 14,
            right: 16,
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: 20,
            cursor: 'pointer',
            lineHeight: 1,
            padding: 4,
          }}
          aria-label="Close"
        >
          ×
        </button>

        {/* Badge */}
        <div style={{
          ...orbitron,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 10,
          fontWeight: 900,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          padding: '3px 8px',
          borderRadius: 4,
          marginBottom: 14,
          backgroundColor: 'rgba(204,255,0,0.07)',
          color: '#ccff00',
          border: '1px solid rgba(100,130,0,0.35)',
        }}>
          ◈ IDENTITY VERIFICATION
        </div>

        {/* Title */}
        <h2 style={{
          ...orbitron,
          fontSize: 22,
          fontWeight: 900,
          color: 'var(--text-primary)',
          margin: '0 0 8px',
          lineHeight: 1.2,
        }}>
          Prove you&apos;re human.
        </h2>

        {/* Subtitle */}
        <p style={{
          ...orbitron,
          fontSize: 12,
          color: 'var(--text-secondary)',
          margin: '0 0 24px',
          lineHeight: 1.6,
        }}>
          Required to submit reports. Stays anonymous beyond your username.
        </p>

        {state === 'success' ? (
          /* Success state */
          <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📬</div>
            <p style={{
              ...orbitron,
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: 6,
            }}>
              Check your inbox.
            </p>
            <p style={{
              ...orbitron,
              fontSize: 12,
              color: '#ccff00',
              marginBottom: 8,
              wordBreak: 'break-all',
            }}>
              Magic link sent to {sentEmail}.
            </p>
            <p style={{
              ...orbitron,
              fontSize: 11,
              color: 'var(--text-secondary)',
            }}>
              No password needed. Just click the link.
            </p>
          </div>
        ) : (
          <>
            {/* Twitter/X button */}
            <button
              onClick={handleTwitter}
              disabled={state === 'loading'}
              style={{
                ...btnBase,
                backgroundColor: '#0f0f0f',
                border: '1.5px solid rgba(255,255,255,0.18)',
                color: '#ffffff',
                opacity: state === 'loading' ? 0.6 : 1,
              }}
            >
              {state === 'loading' ? (
                <Spinner />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="white"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              )}
              Continue with 𝕏
            </button>

            {/* Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              margin: '18px 0',
            }}>
              <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border)' }} />
              <span style={{ ...orbitron, fontSize: 11, color: 'var(--text-secondary)' }}>— or —</span>
              <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border)' }} />
            </div>

            {/* Magic link form */}
            <form onSubmit={handleMagicLink} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={inputStyle}
              />
              <button
                type="submit"
                disabled={state === 'loading' || !email.trim()}
                style={{
                  ...btnBase,
                  backgroundColor: 'rgba(204,255,0,0.08)',
                  border: '1.5px solid rgba(100,130,0,0.45)',
                  color: '#ccff00',
                  opacity: state === 'loading' || !email.trim() ? 0.5 : 1,
                }}
              >
                {state === 'loading' ? <Spinner color="#ccff00" /> : 'Send Magic Link →'}
              </button>
            </form>

            {/* Error state */}
            {state === 'error' && (
              <div style={{
                marginTop: 12,
                padding: '8px 12px',
                borderRadius: 8,
                backgroundColor: 'rgba(204,0,0,0.1)',
                border: '1px solid rgba(204,0,0,0.25)',
                color: '#ff6b6b',
                fontSize: 12,
                ...orbitron,
              }}>
                {errorMsg || 'Something went wrong. Please try again.'}
              </div>
            )}
          </>
        )}

        {/* Footer note */}
        <p style={{
          ...orbitron,
          fontSize: 10,
          color: 'var(--text-secondary)',
          marginTop: 20,
          lineHeight: 1.6,
          opacity: 0.7,
        }}>
          Your identity is only used to prevent spam. Reports are displayed without your personal info.
        </p>
      </div>
    </div>
  )
}

function Spinner({ color = '#ffffff' }: { color?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      style={{ animation: 'spin 0.8s linear infinite' }}
      aria-hidden="true"
    >
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  )
}
