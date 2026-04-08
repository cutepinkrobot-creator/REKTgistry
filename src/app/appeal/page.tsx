'use client';
import { useState } from 'react';

export default function AppealPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ profileUrl: '', name: '', email: '', reason: '', evidence: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); };

  const inputStyle = { width: '100%', background: '#14161e', border: '1px solid #1f2133', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#e2e8f0', outline: 'none', fontFamily: "'Exo 2', sans-serif" };
  const labelStyle = { fontSize: '11px', fontWeight: 600 as const, color: '#5a6080', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: '6px', display: 'block' };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
        <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '24px', fontWeight: 800, color: '#ccff00', marginBottom: '12px' }}>Appeal Received</h1>
        <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>
          We will review your appeal within 14 business days. You will be contacted at the email address provided if we require additional information.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '10px', color: '#5a6080', letterSpacing: '0.2em', marginBottom: '6px' }}>◈ APPEAL PROCESS</div>
      <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '28px', fontWeight: 900, color: '#e2e8f0', marginBottom: '8px' }}>File an Appeal</h1>
      <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '12px', lineHeight: 1.6 }}>
        If you believe a profile on this platform is inaccurate, defamatory, or should be removed, submit an appeal below. Appeals are reviewed manually within 14 business days.
      </p>
      <div className="rounded-xl p-4 mb-8" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
        <p style={{ fontSize: '12px', color: '#94a3b8' }}>
          <strong style={{ color: '#f59e0b' }}>Important:</strong> Submitting false appeals may result in your request being ignored. We do not remove profiles based on requests alone — evidence is required.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label style={labelStyle}>Profile URL or Name *</label>
          <input name="profileUrl" required value={form.profileUrl} onChange={handleChange} placeholder="https://rektgistry.com/directory/..." style={inputStyle} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Your Name *</label>
            <input name="name" required value={form.name} onChange={handleChange} placeholder="Full name" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Your Email *</label>
            <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" style={inputStyle} />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Reason for Appeal *</label>
          <select name="reason" required value={form.reason} onChange={handleChange} style={inputStyle}>
            <option value="">Select reason</option>
            <option>Profile is factually incorrect</option>
            <option>I am not the person described</option>
            <option>Incident was resolved / refunded</option>
            <option>Defamatory content</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Supporting Evidence *</label>
          <textarea name="evidence" required value={form.evidence} onChange={handleChange}
            placeholder="Links to evidence, transaction hashes, or other supporting information..."
            rows={5} style={{ ...inputStyle, resize: 'vertical' as const }} />
        </div>
        <button type="submit" style={{ background: '#4a7eff', color: '#fff', fontFamily: 'Orbitron, sans-serif', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', padding: '14px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', boxShadow: '0 0 20px rgba(74,126,255,0.3)' }}>
          SUBMIT APPEAL
        </button>
      </form>
    </div>
  );
}
