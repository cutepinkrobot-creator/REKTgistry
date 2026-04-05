'use client';
import { useState } from 'react';

export default function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '', twitter: '', wallet: '', category: '', date: '', lossUsd: '', description: '', evidence: '', email: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputStyle = {
    width: '100%', background: '#14161e', border: '1px solid #1f2133', borderRadius: '8px',
    padding: '10px 14px', fontSize: '14px', color: '#e2e8f0', outline: 'none',
    fontFamily: "'Exo 2', sans-serif",
  };
  const labelStyle = { fontSize: '11px', fontWeight: 600, color: '#5a6080', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: '6px', display: 'block' };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
        <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '24px', fontWeight: 800, color: '#ccff00', marginBottom: '12px' }}>Report Submitted</h1>
        <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>
          Thank you for contributing to the registry. Our team will review your report before it is published publicly. This typically takes 1–3 business days.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '10px', color: '#5a6080', letterSpacing: '0.2em', marginBottom: '6px' }}>◈ SUBMIT REPORT</div>
      <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '28px', fontWeight: 900, color: '#e2e8f0', marginBottom: '8px' }}>Report a Scammer</h1>
      <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '32px', lineHeight: 1.6 }}>
        Submit a verified report with evidence. All reports are reviewed by our team before being published. False reports may expose you to legal liability.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label style={labelStyle}>Name / Handle *</label>
          <input name="name" required value={form.name} onChange={handleChange} placeholder="Full name or username" style={inputStyle} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Twitter Handle</label>
            <input name="twitter" value={form.twitter} onChange={handleChange} placeholder="@handle" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Wallet Address</label>
            <input name="wallet" value={form.wallet} onChange={handleChange} placeholder="0x..." style={{ ...inputStyle, fontFamily: 'Courier New, monospace', color: '#ccff00' }} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Category *</label>
            <select name="category" required value={form.category} onChange={handleChange} style={inputStyle}>
              <option value="">Select category</option>
              {['Rug Pull', 'Phishing', 'Pump & Dump', 'Exit Scam', 'Fake Project', 'Social Engineering', 'Exchange Hack', 'Other'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Incident Date *</label>
            <input name="date" type="date" required value={form.date} onChange={handleChange} style={inputStyle} />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Estimated Loss (USD)</label>
          <input name="lossUsd" type="number" value={form.lossUsd} onChange={handleChange} placeholder="0" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Description *</label>
          <textarea
            name="description" required value={form.description} onChange={handleChange}
            placeholder="Describe what happened in detail..."
            rows={5}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>
        <div>
          <label style={labelStyle}>Evidence Links / Transaction Hashes</label>
          <textarea
            name="evidence" value={form.evidence} onChange={handleChange}
            placeholder="Transaction hashes, links to screenshots, on-chain explorer URLs..."
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>
        <div>
          <label style={labelStyle}>Your Email (for follow-up)</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" style={inputStyle} />
        </div>

        <div className="rounded-xl p-4" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
          <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.6 }}>
            <strong style={{ color: '#f59e0b' }}>Note:</strong> All submissions are reviewed manually. Reports are labeled &quot;alleged&quot; until independently verified. Submitting false reports may expose you to legal liability.
          </p>
        </div>

        <button
          type="submit"
          style={{ background: '#4a7eff', color: '#fff', fontFamily: 'Orbitron, sans-serif', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', padding: '14px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', boxShadow: '0 0 20px rgba(74,126,255,0.3)' }}
        >
          SUBMIT REPORT
        </button>
      </form>
    </div>
  );
}
