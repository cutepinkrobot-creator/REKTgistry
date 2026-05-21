'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

interface TwitterProfile {
  name: string;
  username: string;
  bio: string | null;
  followers: number;
  following: number;
  tweets: number;
  avatar: string | null;
  verified: boolean;
  joined: string | null;
  location: string | null;
  website: string | null;
}

interface RegistryMatch {
  id: string;
  slug: string;
  display_name: string;
  summary: string;
  amount_lost_usd: number | null;
  categories: string[];
  verified: boolean;
  incident_date: string | null;
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function fmtUsd(n: number | null): string {
  if (!n) return '—';
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${n.toLocaleString()}`;
}

const orb: React.CSSProperties = { fontFamily: 'Orbitron, sans-serif' };

export default function TwitterLookup() {
  const [handle, setHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<TwitterProfile | null>(null);
  const [matches, setMatches] = useState<RegistryMatch[]>([]);
  const [searched, setSearched] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function lookup(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const h = handle.replace('@', '').trim();
    if (!h) return;
    setLoading(true);
    setError(null);
    setProfile(null);
    setMatches([]);
    setSearched(h);
    try {
      const res = await fetch(`/api/twitter-profile?handle=${encodeURIComponent(h)}`);
      const json = await res.json();
      if (!json.ok) {
        setError(json.error ?? 'Lookup failed.');
      } else {
        setProfile(json.profile);
        setMatches(json.registryMatches ?? []);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const isRekt = matches.length > 0;

  return (
    <div style={{ width: '100%', maxWidth: 680 }}>
      {/* Search bar */}
      <form onSubmit={lookup} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <span style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-secondary)', fontSize: 14, pointerEvents: 'none', ...orb,
          }}>@</span>
          <input
            ref={inputRef}
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="twitter handle"
            style={{
              ...orb,
              width: '100%',
              padding: '12px 14px 12px 28px',
              borderRadius: 10,
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1.5px solid var(--border)',
              color: 'var(--text-primary)',
              fontSize: 14,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !handle.trim()}
          style={{
            ...orb,
            padding: '12px 22px',
            borderRadius: 10,
            backgroundColor: 'rgba(204,255,0,0.08)',
            border: '1.5px solid rgba(204,255,0,0.35)',
            color: '#ccff00',
            fontSize: 13,
            fontWeight: 900,
            cursor: 'pointer',
            opacity: loading || !handle.trim() ? 0.4 : 1,
            whiteSpace: 'nowrap',
          }}
        >
          {loading ? 'Searching…' : 'Search →'}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div style={{
          ...orb, padding: '10px 14px', borderRadius: 10, fontSize: 12,
          backgroundColor: 'rgba(204,0,0,0.08)', border: '1px solid rgba(204,0,0,0.2)', color: '#ff6b6b',
        }}>
          {error}
        </div>
      )}

      {/* Registry warning banner */}
      {!loading && searched && isRekt && (
        <div style={{
          padding: '12px 16px', borderRadius: 10, marginBottom: 14,
          backgroundColor: 'rgba(255,80,80,0.08)', border: '1.5px solid rgba(255,80,80,0.35)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <div>
            <div style={{ ...orb, fontSize: 12, fontWeight: 900, color: '#ff6b6b', marginBottom: 2 }}>
              FOUND IN REKTGISTRY
            </div>
            <div style={{ ...orb, fontSize: 11, color: 'var(--text-secondary)' }}>
              @{searched} is linked to {matches.length} registry {matches.length === 1 ? 'entry' : 'entries'}. See below.
            </div>
          </div>
        </div>
      )}

      {/* All clear */}
      {!loading && searched && !isRekt && (profile || searched) && (
        <div style={{
          padding: '10px 16px', borderRadius: 10, marginBottom: 14,
          backgroundColor: 'rgba(57,255,20,0.06)', border: '1px solid rgba(57,255,20,0.2)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 16 }}>✓</span>
          <div style={{ ...orb, fontSize: 11, color: '#39ff14' }}>
            @{searched} is not in the REKTgistry.
          </div>
        </div>
      )}

      {/* Twitter profile card */}
      {!loading && profile && (
        <div style={{
          borderRadius: 14, padding: '20px', marginBottom: 16,
          backgroundColor: 'var(--bg-card)', border: `1.5px solid ${isRekt ? 'rgba(255,80,80,0.3)' : 'var(--border)'}`,
        }}>
          {/* Header row */}
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 14 }}>
            {/* Avatar */}
            {profile.avatar ? (
              <img
                src={profile.avatar.replace('_normal', '_400x400')}
                alt={profile.name}
                style={{ width: 56, height: 56, borderRadius: '50%', flexShrink: 0, objectFit: 'cover' }}
              />
            ) : (
              <div style={{
                width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
                backgroundColor: '#ccff00', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 22, fontWeight: 900, color: '#0b0c10', ...orb,
              }}>
                {profile.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ ...orb, fontSize: 16, fontWeight: 900, color: 'var(--text-primary)' }}>
                  {profile.name}
                </span>
                {profile.verified && (
                  <span style={{ fontSize: 14 }} title="Verified">✓</span>
                )}
              </div>
              <a
                href={`https://x.com/${profile.username}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...orb, fontSize: 12, color: 'var(--text-secondary)', textDecoration: 'none' }}
              >
                @{profile.username}
              </a>
              {profile.location && (
                <div style={{ ...orb, fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                  📍 {profile.location}
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p style={{
              ...orb, fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.7,
              margin: '0 0 14px', padding: '10px 12px', borderRadius: 8,
              backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
            }}>
              {profile.bio}
            </p>
          )}

          {/* Stats */}
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[
              { label: 'Followers', value: fmt(profile.followers) },
              { label: 'Following', value: fmt(profile.following) },
              { label: 'Tweets', value: fmt(profile.tweets) },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ ...orb, fontSize: 16, fontWeight: 900, color: 'var(--text-primary)' }}>{s.value}</div>
                <div style={{ ...orb, fontSize: 10, color: 'var(--text-secondary)', letterSpacing: '0.06em' }}>{s.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Twitter profile found */}
      {!loading && searched && !profile && !error && (
        <div style={{
          ...orb, padding: '14px 16px', borderRadius: 10, marginBottom: 14, fontSize: 12,
          backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
          color: 'var(--text-secondary)',
        }}>
          No Twitter profile found for @{searched}.
        </div>
      )}

      {/* Registry matches */}
      {matches.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ ...orb, fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.08em', marginBottom: 4 }}>
            REGISTRY ENTRIES
          </div>
          {matches.map((m) => (
            <Link
              key={m.id}
              href={`/directory/${m.slug}`}
              style={{
                display: 'block', textDecoration: 'none', borderRadius: 12, padding: '14px 16px',
                backgroundColor: 'rgba(255,80,80,0.05)', border: '1px solid rgba(255,80,80,0.25)',
                transition: 'border-color 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <div style={{ ...orb, fontSize: 13, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 4 }}>
                    {m.display_name}
                  </div>
                  <p style={{ ...orb, fontSize: 11, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                    {m.summary?.slice(0, 120)}{m.summary?.length > 120 ? '…' : ''}
                  </p>
                  {m.categories?.length > 0 && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                      {m.categories.slice(0, 3).map((c) => (
                        <span key={c} style={{
                          ...orb, fontSize: 9, padding: '2px 8px', borderRadius: 4,
                          backgroundColor: 'rgba(204,255,0,0.06)', color: '#ccff00',
                          border: '1px solid rgba(100,130,0,0.3)', letterSpacing: '0.06em',
                        }}>
                          {c.replace(/-/g, ' ').toUpperCase()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {m.amount_lost_usd && (
                    <div style={{ ...orb, fontSize: 14, fontWeight: 900, color: '#ff5050' }}>
                      {fmtUsd(m.amount_lost_usd)}
                    </div>
                  )}
                  {m.verified && (
                    <div style={{ ...orb, fontSize: 9, color: '#39ff14', marginTop: 4, letterSpacing: '0.08em' }}>
                      ✓ VERIFIED
                    </div>
                  )}
                  <div style={{ ...orb, fontSize: 10, color: '#ccff00', marginTop: 6 }}>View →</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
