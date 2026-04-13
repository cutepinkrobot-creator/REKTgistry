'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase, ScammerProfile } from '@/lib/supabase';

type EditableProfile = Omit<ScammerProfile, 'id' | 'created_at' | 'updated_at'>;

const TEXT_FIELDS: Array<{
  key: keyof EditableProfile;
  label: string;
  type?: string;
}> = [
  { key: 'display_name', label: 'Display Name' },
  { key: 'slug', label: 'Slug' },
  { key: 'summary', label: 'Summary', type: 'textarea' },
  { key: 'twitter_handle', label: 'Twitter Handle' },
  { key: 'telegram_handle', label: 'Telegram Handle' },
  { key: 'discord_handle', label: 'Discord Handle' },
  { key: 'website', label: 'Website' },
  { key: 'chain', label: 'Chain' },
  { key: 'incident_date', label: 'Incident Date', type: 'date' },
  { key: 'amount_lost_usd', label: 'Amount Lost (USD)', type: 'number' },
  { key: 'status', label: 'Status' },
];

const ARRAY_FIELDS: Array<{ key: keyof EditableProfile; label: string }> = [
  { key: 'aliases', label: 'Aliases' },
  { key: 'wallet_addresses', label: 'Wallet Addresses' },
  { key: 'categories', label: 'Categories' },
];

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(11,12,16,0.8)',
  border: '1px solid rgba(100,130,0,0.3)',
  borderRadius: '7px',
  padding: '10px 13px',
  color: '#e2e8f0',
  fontFamily: 'Orbitron, sans-serif',
  fontSize: '12px',
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '10px',
  color: '#5a6080',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  marginBottom: '6px',
};

export default function EditProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [profile, setProfile] = useState<ScammerProfile | null>(null);
  const [form, setForm] = useState<Partial<EditableProfile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    async function load() {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('scammer_profiles')
        .select('*')
        .eq('id', id)
        .single();
      if (!err && data) {
        setProfile(data as ScammerProfile);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _id, created_at: _ca, updated_at: _ua, ...editable } = data as ScammerProfile;
        setForm(editable);
      } else {
        setError('Profile not found.');
      }
      setLoading(false);
    }
    load();
  }, [id]);

  function setField(key: keyof EditableProfile, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setArrayField(key: keyof EditableProfile, raw: string) {
    const arr = raw
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    setField(key, arr);
  }

  async function handleSave() {
    setSaving(true);
    setMessage('');
    setError('');

    const res = await fetch('/api/admin/profile/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...form }),
    });

    if (res.ok) {
      setMessage('Profile saved successfully.');
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Failed to save profile.');
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0b0c10',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#5a6080',
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '13px',
        }}
      >
        Loading...
      </div>
    );
  }

  if (!profile) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0b0c10',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f87171',
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '13px',
        }}
      >
        {error || 'Profile not found.'}
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0b0c10',
        fontFamily: "'Orbitron', sans-serif",
        color: '#e2e8f0',
      }}
    >
      {/* Header */}
      <header
        style={{
          background: 'rgba(11,12,16,0.95)',
          borderBottom: '1px solid rgba(100,130,0,0.25)',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '56px',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => router.push('/admin')}
            style={{
              background: 'transparent',
              border: '1px solid rgba(100,130,0,0.3)',
              borderRadius: '6px',
              padding: '6px 14px',
              color: '#ccff00',
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.1em',
              cursor: 'pointer',
            }}
          >
            ← Back
          </button>
          <span
            style={{
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 700,
              fontSize: '13px',
              color: '#ccff00',
              letterSpacing: '0.1em',
            }}
          >
            Edit Profile
          </span>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {message && (
            <span style={{ fontSize: '12px', color: '#4ade80' }}>{message}</span>
          )}
          {error && (
            <span style={{ fontSize: '12px', color: '#f87171' }}>{error}</span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              background: saving ? 'rgba(100,130,0,0.2)' : '#ccff00',
              color: saving ? '#5a6080' : '#0b0c10',
              border: 'none',
              borderRadius: '7px',
              padding: '8px 20px',
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 700,
              fontSize: '12px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: saving ? 'not-allowed' : 'pointer',
            }}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </header>

      <main style={{ padding: '32px', maxWidth: '960px', margin: '0 auto' }}>
        {/* Profile ID badge */}
        <div style={{ marginBottom: '24px' }}>
          <span
            style={{
              fontSize: '11px',
              color: '#3a4020',
              letterSpacing: '0.15em',
              fontFamily: 'monospace',
            }}
          >
            ID: {profile.id}
          </span>
        </div>

        {/* Grid of fields */}
        <div
          style={{
            background: 'rgba(15,20,0,0.4)',
            border: '1px solid rgba(100,130,0,0.3)',
            borderRadius: '12px',
            padding: '28px',
            marginBottom: '24px',
          }}
        >
          <h2
            style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '12px',
              fontWeight: 700,
              color: '#ccff00',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '24px',
              margin: '0 0 24px 0',
            }}
          >
            Profile Fields
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {/* Profile type select */}
            <div>
              <label style={labelStyle}>Profile Type</label>
              <select
                value={(form.profile_type as string) || 'person'}
                onChange={(e) =>
                  setField('profile_type', e.target.value as 'person' | 'project')
                }
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="person">Person</option>
                <option value="project">Project</option>
              </select>
            </div>

            {/* Verified checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '24px' }}>
              <input
                type="checkbox"
                id="verified"
                checked={!!form.verified}
                onChange={(e) => setField('verified', e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#ccff00' }}
              />
              <label
                htmlFor="verified"
                style={{ fontSize: '12px', color: '#ccff00', cursor: 'pointer', letterSpacing: '0.08em' }}
              >
                Verified
              </label>
            </div>

            {/* Text / number / date fields */}
            {TEXT_FIELDS.map(({ key, label, type }) => {
              const val = form[key];
              if (type === 'textarea') {
                return (
                  <div key={key} style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>{label}</label>
                    <textarea
                      value={(val as string) || ''}
                      onChange={(e) => setField(key, e.target.value)}
                      rows={4}
                      style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.5' }}
                    />
                  </div>
                );
              }
              return (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input
                    type={type || 'text'}
                    value={
                      type === 'number'
                        ? (val as number | null) ?? ''
                        : (val as string) || ''
                    }
                    onChange={(e) =>
                      setField(
                        key,
                        type === 'number'
                          ? e.target.value === ''
                            ? null
                            : Number(e.target.value)
                          : e.target.value || null
                      )
                    }
                    style={inputStyle}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Array fields */}
        <div
          style={{
            background: 'rgba(15,20,0,0.4)',
            border: '1px solid rgba(100,130,0,0.3)',
            borderRadius: '12px',
            padding: '28px',
          }}
        >
          <h2
            style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '12px',
              fontWeight: 700,
              color: '#ccff00',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '24px',
              margin: '0 0 24px 0',
            }}
          >
            Array Fields (one per line)
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {ARRAY_FIELDS.map(({ key, label }) => {
              const arr = (form[key] as string[]) || [];
              return (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <textarea
                    value={arr.join('\n')}
                    onChange={(e) => setArrayField(key, e.target.value)}
                    rows={4}
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }}
                    placeholder={`One ${label.toLowerCase().replace(' ', ' ')} per line`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom save button */}
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          {message && (
            <span
              style={{
                fontSize: '12px',
                color: '#4ade80',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {message}
            </span>
          )}
          {error && (
            <span
              style={{
                fontSize: '12px',
                color: '#f87171',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {error}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              background: saving ? 'rgba(100,130,0,0.2)' : '#ccff00',
              color: saving ? '#5a6080' : '#0b0c10',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 28px',
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 700,
              fontSize: '13px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: saving ? 'not-allowed' : 'pointer',
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </main>
    </div>
  );
}
