'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, ScammerProfile } from '@/lib/supabase';

type Tab = 'submissions' | 'disputes' | 'appeals' | 'profiles' | 'quickadd';

const TABS: { key: Tab; label: string }[] = [
  { key: 'submissions', label: 'Submissions' },
  { key: 'disputes', label: 'Disputes' },
  { key: 'appeals', label: 'Appeals' },
  { key: 'profiles', label: 'All Profiles' },
  { key: 'quickadd', label: '⚡ Quick Add' },
];

const PAGE_SIZE = 20;

function StatCard({ label, value }: { label: string; value: number | null }) {
  return (
    <div
      style={{
        background: 'rgba(15,20,0,0.4)',
        border: '1px solid rgba(100,130,0,0.3)',
        borderRadius: '10px',
        padding: '20px 24px',
        flex: '1 1 160px',
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: '11px',
          color: '#5a6080',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '32px',
          fontWeight: 900,
          color: '#ccff00',
          fontFamily: 'Orbitron, sans-serif',
          lineHeight: 1,
        }}
      >
        {value === null ? '—' : value}
      </div>
    </div>
  );
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

function QuickAddPanel() {
  const orbitron = 'Orbitron, sans-serif';
  const [form, setForm] = useState({
    display_name: '',
    news_url: '',
    summary: '',
    amount_lost_usd: '',
    incident_date: '',
    profile_type: 'project' as 'project' | 'person',
    categories: 'other',
    twitter_handle: '',
    chain: '',
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [cronResult, setCronResult] = useState<string | null>(null);
  const [cronLoading, setCronLoading] = useState(false);

  function update(k: string, v: string) {
    setForm(f => ({ ...f, [k]: v }));
    if (k === 'display_name') {
      // auto-set suggested slug
    }
  }

  async function handleSave() {
    if (!form.display_name || !form.summary) {
      setMsg({ text: 'Display name and summary are required.', ok: false });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      const slug = slugify(form.display_name) + '-' + (form.incident_date?.slice(0, 7) || new Date().toISOString().slice(0, 7));
      const { error } = await supabase.from('scammer_profiles').insert({
        display_name: form.display_name,
        slug,
        profile_type: form.profile_type,
        status: 'approved',
        categories: [form.categories],
        summary: form.summary,
        amount_lost_usd: form.amount_lost_usd ? parseFloat(form.amount_lost_usd) : null,
        incident_date: form.incident_date || null,
        verified: true,
        reports_count: 10,
        twitter_handle: form.twitter_handle || null,
        website: form.news_url || null,
        chain: form.chain || null,
        aliases: [],
        wallet_addresses: [],
      });
      if (error) throw error;
      setMsg({ text: `✓ "${form.display_name}" added to registry.`, ok: true });
      setForm({ display_name: '', news_url: '', summary: '', amount_lost_usd: '', incident_date: '', profile_type: 'project', categories: 'other', twitter_handle: '', chain: '' });
    } catch (e: unknown) {
      setMsg({ text: `Error: ${e instanceof Error ? e.message : 'Unknown error'}`, ok: false });
    }
    setSaving(false);
  }

  async function runCron(type: 'zachxbt-rss' | 'chainabuse-sync') {
    setCronLoading(true);
    setCronResult(null);
    try {
      const res = await fetch(`/api/cron/${type}`, {
        headers: { 'x-cron-secret': process.env.NEXT_PUBLIC_CRON_SECRET || 'admin-trigger' },
      });
      const data = await res.json();
      setCronResult(JSON.stringify(data, null, 2));
    } catch (e) {
      setCronResult('Error: ' + (e instanceof Error ? e.message : 'Unknown'));
    }
    setCronLoading(false);
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: 7, fontSize: 13,
    backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(100,130,0,0.3)',
    color: '#e2e8f0', fontFamily: orbitron, outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 10, fontFamily: orbitron, color: '#5a6080',
    letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 5,
  };

  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      {/* Manual quick-add form */}
      <div style={{ flex: '1 1 480px', background: 'rgba(15,20,0,0.4)', border: '1px solid rgba(100,130,0,0.3)', borderRadius: 12, padding: 24 }}>
        <div style={{ fontSize: 11, fontFamily: orbitron, color: '#ccff00', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>
          ⚡ Quick Add from News
        </div>

        <div style={{ display: 'grid', gap: 14 }}>
          <div>
            <label style={labelStyle}>Display Name *</label>
            <input style={inputStyle} value={form.display_name} onChange={e => update('display_name', e.target.value)} placeholder="e.g. Drift Protocol Hack" />
          </div>
          <div>
            <label style={labelStyle}>News Article URL</label>
            <input style={inputStyle} value={form.news_url} onChange={e => update('news_url', e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <label style={labelStyle}>Summary *</label>
            <textarea style={{ ...inputStyle, height: 90, resize: 'vertical' }} value={form.summary} onChange={e => update('summary', e.target.value)} placeholder="Paste or write a summary of the incident..." />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Amount Lost (USD)</label>
              <input style={inputStyle} type="number" value={form.amount_lost_usd} onChange={e => update('amount_lost_usd', e.target.value)} placeholder="285000000" />
            </div>
            <div>
              <label style={labelStyle}>Incident Date</label>
              <input style={inputStyle} type="date" value={form.incident_date} onChange={e => update('incident_date', e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Type</label>
              <select style={inputStyle} value={form.profile_type} onChange={e => update('profile_type', e.target.value)}>
                <option value="project">Project / Protocol</option>
                <option value="person">Person / Individual</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select style={inputStyle} value={form.categories} onChange={e => update('categories', e.target.value)}>
                <option value="other">Other / Hack</option>
                <option value="rug_pull">Rug Pull</option>
                <option value="phishing">Phishing</option>
                <option value="exit_scam">Exit Scam</option>
                <option value="pump_and_dump">Pump &amp; Dump</option>
                <option value="fake_project">Fake Project</option>
                <option value="social_engineering">Social Engineering</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Chain</label>
              <input style={inputStyle} value={form.chain} onChange={e => update('chain', e.target.value)} placeholder="Solana, Ethereum..." />
            </div>
            <div>
              <label style={labelStyle}>Twitter Handle</label>
              <input style={inputStyle} value={form.twitter_handle} onChange={e => update('twitter_handle', e.target.value)} placeholder="@handle" />
            </div>
          </div>
        </div>

        {msg && (
          <div style={{ marginTop: 14, padding: '9px 14px', borderRadius: 7, fontSize: 12, fontFamily: orbitron, backgroundColor: msg.ok ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${msg.ok ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, color: msg.ok ? '#4ade80' : '#f87171' }}>
            {msg.text}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          style={{ marginTop: 16, width: '100%', padding: '11px', borderRadius: 8, fontSize: 13, fontWeight: 700, fontFamily: orbitron, cursor: saving ? 'not-allowed' : 'pointer', backgroundColor: 'rgba(204,255,0,0.1)', border: '1.5px solid rgba(204,255,0,0.35)', color: '#ccff00', opacity: saving ? 0.6 : 1 }}
        >
          {saving ? 'Adding...' : '⚡ Add to Registry (Approved)'}
        </button>
      </div>

      {/* Cron triggers */}
      <div style={{ flex: '0 1 320px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ background: 'rgba(15,20,0,0.4)', border: '1px solid rgba(100,130,0,0.3)', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 11, fontFamily: orbitron, color: '#ccff00', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>
            🔄 Data Sources
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={() => runCron('zachxbt-rss')} disabled={cronLoading}
              style={{ padding: '10px 14px', borderRadius: 8, fontSize: 12, fontFamily: orbitron, fontWeight: 700, cursor: 'pointer', backgroundColor: 'rgba(74,126,255,0.1)', border: '1px solid rgba(74,126,255,0.3)', color: '#7ba7ff', textAlign: 'left' }}>
              📡 Pull ZachXBT RSS Feed
              <div style={{ fontSize: 10, color: '#5a6080', marginTop: 3, fontWeight: 400 }}>Runs auto every 6h · checks last 48h posts</div>
            </button>
            <button onClick={() => runCron('chainabuse-sync')} disabled={cronLoading}
              style={{ padding: '10px 14px', borderRadius: 8, fontSize: 12, fontFamily: orbitron, fontWeight: 700, cursor: 'pointer', backgroundColor: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', color: '#f59e0b', textAlign: 'left' }}>
              🔗 Sync Chainabuse Reports
              <div style={{ fontSize: 10, color: '#5a6080', marginTop: 3, fontWeight: 400 }}>Runs auto every 12h · last 7 days</div>
            </button>
          </div>
        </div>

        {cronLoading && (
          <div style={{ background: 'rgba(15,20,0,0.4)', border: '1px solid rgba(100,130,0,0.2)', borderRadius: 10, padding: 16, fontSize: 12, fontFamily: orbitron, color: '#ccff00' }}>
            Running...
          </div>
        )}
        {cronResult && (
          <div style={{ background: 'rgba(15,20,0,0.4)', border: '1px solid rgba(100,130,0,0.2)', borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 10, fontFamily: orbitron, color: '#5a6080', letterSpacing: '0.1em', marginBottom: 8 }}>RESULT</div>
            <pre style={{ fontSize: 11, color: '#a0b060', fontFamily: 'monospace', whiteSpace: 'pre-wrap', margin: 0 }}>{cronResult}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('submissions');

  // Stats
  const [stats, setStats] = useState({
    pending: null as number | null,
    disputes: null as number | null,
    appeals: null as number | null,
    total: null as number | null,
  });

  // Per-tab data
  const [rows, setRows] = useState<ScammerProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [actionMsg, setActionMsg] = useState('');

  const fetchStats = useCallback(async () => {
    const [pendingRes, disputeRes, appealRes, totalRes] = await Promise.all([
      supabase
        .from('scammer_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending'),
      supabase
        .from('scammer_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'disputed'),
      supabase
        .from('scammer_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'appealed'),
      supabase
        .from('scammer_profiles')
        .select('*', { count: 'exact', head: true }),
    ]);

    setStats({
      pending: pendingRes.count ?? 0,
      disputes: disputeRes.count ?? 0,
      appeals: appealRes.count ?? 0,
      total: totalRes.count ?? 0,
    });
  }, []);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    setRows([]);

    let statusFilter: string | null = null;
    if (activeTab === 'submissions') statusFilter = 'pending';
    else if (activeTab === 'disputes') statusFilter = 'disputed';
    else if (activeTab === 'appeals') statusFilter = 'appealed';

    let query = supabase
      .from('scammer_profiles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }

    const { data, count, error } = await query;
    if (!error && data) {
      setRows(data as ScammerProfile[]);
      setTotalCount(count ?? 0);
    }
    setLoading(false);
  }, [activeTab, page]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  async function handleAction(id: string, action: 'approve' | 'reject') {
    setActionMsg('');
    const res = await fetch(`/api/admin/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setActionMsg(`Profile ${action === 'approve' ? 'approved' : 'rejected'} successfully.`);
      await Promise.all([fetchStats(), fetchRows()]);
    } else {
      setActionMsg(`Failed to ${action} profile.`);
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0b0c10',
        fontFamily: "'Orbitron', sans-serif",
        color: '#e2e8f0',
      }}
    >
      {/* Top bar */}
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
          <span
            style={{
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 900,
              fontSize: '18px',
              letterSpacing: '0.08em',
            }}
          >
            <span style={{ color: '#ccff00' }}>REKT</span>
            <span style={{ color: '#ffffff', fontWeight: 700 }}>gistry</span>
          </span>
          <span
            style={{
              fontSize: '10px',
              color: '#3a4020',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              borderLeft: '1px solid #1f2133',
              paddingLeft: '12px',
            }}
          >
            Admin
          </span>
        </div>

        <button
          onClick={handleLogout}
          style={{
            background: 'transparent',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '6px',
            padding: '7px 16px',
            color: '#f87171',
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '11px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.1)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
          }}
        >
          Logout
        </button>
      </header>

      <main style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Stats row */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            marginBottom: '32px',
          }}
        >
          <StatCard label="Pending Submissions" value={stats.pending} />
          <StatCard label="Pending Disputes" value={stats.disputes} />
          <StatCard label="Pending Appeals" value={stats.appeals} />
          <StatCard label="Total Profiles" value={stats.total} />
        </div>

        {/* Tab nav */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            borderBottom: '1px solid rgba(100,130,0,0.2)',
            marginBottom: '24px',
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background:
                  activeTab === tab.key ? 'rgba(204,255,0,0.08)' : 'transparent',
                border: 'none',
                borderBottom:
                  activeTab === tab.key
                    ? '2px solid #ccff00'
                    : '2px solid transparent',
                color: activeTab === tab.key ? '#ccff00' : '#5a6080',
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '12px',
                fontWeight: activeTab === tab.key ? 700 : 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '10px 20px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                marginBottom: '-1px',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Action feedback */}
        {actionMsg && (
          <div
            style={{
              background: actionMsg.includes('successfully')
                ? 'rgba(34,197,94,0.1)'
                : 'rgba(239,68,68,0.1)',
              border: `1px solid ${actionMsg.includes('successfully') ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
              borderRadius: '6px',
              padding: '10px 16px',
              marginBottom: '16px',
              fontSize: '12px',
              color: actionMsg.includes('successfully') ? '#4ade80' : '#f87171',
            }}
          >
            {actionMsg}
          </div>
        )}

        {/* Quick Add Panel */}
        {activeTab === 'quickadd' && <QuickAddPanel />}

        {/* Table */}
        {activeTab !== 'quickadd' && <div
          style={{
            background: 'rgba(15,20,0,0.4)',
            border: '1px solid rgba(100,130,0,0.3)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          {loading ? (
            <div
              style={{
                padding: '60px',
                textAlign: 'center',
                color: '#5a6080',
                fontSize: '13px',
              }}
            >
              Loading...
            </div>
          ) : rows.length === 0 ? (
            <div
              style={{
                padding: '60px',
                textAlign: 'center',
                color: '#5a6080',
                fontSize: '13px',
              }}
            >
              No records found.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr
                    style={{
                      borderBottom: '1px solid rgba(100,130,0,0.3)',
                      background: 'rgba(204,255,0,0.04)',
                    }}
                  >
                    {[
                      'Display Name',
                      'Type',
                      'Status',
                      'Reports',
                      'Created',
                      'Actions',
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: '12px 16px',
                          textAlign: 'left',
                          fontSize: '11px',
                          color: '#ccff00',
                          fontWeight: 700,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr
                      key={row.id}
                      style={{
                        borderBottom:
                          i < rows.length - 1
                            ? '1px solid rgba(31,33,51,0.7)'
                            : 'none',
                        background:
                          i % 2 === 0 ? 'transparent' : 'rgba(204,255,0,0.01)',
                      }}
                    >
                      <td
                        style={{
                          padding: '13px 16px',
                          fontSize: '13px',
                          color: '#deff80',
                          fontWeight: 600,
                          maxWidth: '200px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {row.display_name}
                      </td>
                      <td
                        style={{
                          padding: '13px 16px',
                          fontSize: '12px',
                          color: '#94a3b8',
                        }}
                      >
                        {row.profile_type}
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <StatusBadge status={row.status} />
                      </td>
                      <td
                        style={{
                          padding: '13px 16px',
                          fontSize: '13px',
                          color: '#94a3b8',
                        }}
                      >
                        {row.reports_count}
                      </td>
                      <td
                        style={{
                          padding: '13px 16px',
                          fontSize: '12px',
                          color: '#5a6080',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {new Date(row.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                          {activeTab === 'submissions' && (
                            <>
                              <ActionButton
                                color="#22c55e"
                                onClick={() => handleAction(row.id, 'approve')}
                              >
                                Approve
                              </ActionButton>
                              <ActionButton
                                color="#ef4444"
                                onClick={() => handleAction(row.id, 'reject')}
                              >
                                Reject
                              </ActionButton>
                            </>
                          )}
                          <a
                            href={`/admin/profile/${row.id}`}
                            style={{
                              background: 'rgba(74,126,255,0.15)',
                              border: '1px solid rgba(74,126,255,0.3)',
                              borderRadius: '5px',
                              padding: '5px 12px',
                              fontSize: '11px',
                              color: '#7ba7ff',
                              textDecoration: 'none',
                              fontFamily: 'Orbitron, sans-serif',
                              letterSpacing: '0.05em',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Edit
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>}

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '20px',
            }}
          >
            <span style={{ fontSize: '12px', color: '#5a6080' }}>
              {totalCount} total &mdash; page {page} of {totalPages}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <PaginationButton
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </PaginationButton>
              <PaginationButton
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </PaginationButton>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    pending: { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b' },
    approved: { bg: 'rgba(34,197,94,0.15)', text: '#4ade80' },
    rejected: { bg: 'rgba(239,68,68,0.15)', text: '#f87171' },
    disputed: { bg: 'rgba(74,126,255,0.15)', text: '#7ba7ff' },
    appealed: { bg: 'rgba(139,92,246,0.15)', text: '#a78bfa' },
  };
  const c = colors[status] || { bg: 'rgba(90,96,128,0.15)', text: '#5a6080' };
  return (
    <span
      style={{
        background: c.bg,
        color: c.text,
        borderRadius: '4px',
        padding: '3px 10px',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        display: 'inline-block',
      }}
    >
      {status}
    </span>
  );
}

function ActionButton({
  color,
  onClick,
  children,
}: {
  color: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: color,
        border: 'none',
        borderRadius: '5px',
        padding: '5px 12px',
        fontSize: '11px',
        fontWeight: 700,
        color: '#fff',
        fontFamily: 'Orbitron, sans-serif',
        letterSpacing: '0.05em',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'opacity 0.2s',
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.85')}
      onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
    >
      {children}
    </button>
  );
}

function PaginationButton({
  disabled,
  onClick,
  children,
}: {
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        background: disabled ? 'rgba(90,96,128,0.1)' : 'rgba(204,255,0,0.08)',
        border: `1px solid ${disabled ? 'rgba(90,96,128,0.2)' : 'rgba(204,255,0,0.3)'}`,
        borderRadius: '6px',
        padding: '7px 16px',
        color: disabled ? '#3a4051' : '#ccff00',
        fontFamily: 'Orbitron, sans-serif',
        fontSize: '11px',
        letterSpacing: '0.1em',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </button>
  );
}
