"use client";

import { useState } from "react";

export default function DisputePage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    profile_url: "",
    your_name: "",
    your_email: "",
    reason: "",
    evidence: "",
  });
  const [submitting, setSubmitting] = useState(false);

  function update(key: keyof typeof form, value: string) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/dispute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-blue-400">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="m9 11 3 3L22 4" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-3 text-center">Dispute Submitted</h1>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          We have received your dispute request. Our moderation team will review the profile and evidence within 5–7 business days. You will be contacted at the email you provided.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-blue-400">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 5v6" />
          <circle cx="12" cy="17" r="1" />
        </svg>
        <h1 className="text-2xl font-bold text-white text-center">Dispute a Report</h1>
      </div>
      <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
        If you believe a profile on this platform is inaccurate, defamatory, or should be removed, submit a dispute below.
      </p>

      <div
        className="rounded-xl p-4 mb-6 flex items-start gap-3"
        style={{ backgroundColor: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          Disputes are reviewed manually. Please provide evidence to support your claim. Submitting false disputes may result in your request being ignored.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Profile URL or Name <span className="text-fuchsia-400">*</span>
          </label>
          <input
            required
            placeholder="e.g. /profile/john-doe or 'John Doe'"
            value={form.profile_url}
            onChange={(e) => update("profile_url", e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg text-white placeholder-gray-500 outline-none text-sm"
            style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Your Name <span className="text-fuchsia-400">*</span>
          </label>
          <input
            required
            placeholder="Full name"
            value={form.your_name}
            onChange={(e) => update("your_name", e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg text-white placeholder-gray-500 outline-none text-sm"
            style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Your Email <span className="text-fuchsia-400">*</span>
          </label>
          <input
            required
            type="email"
            placeholder="you@example.com"
            value={form.your_email}
            onChange={(e) => update("your_email", e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg text-white placeholder-gray-500 outline-none text-sm"
            style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Reason for Dispute <span className="text-fuchsia-400">*</span>
          </label>
          <textarea
            required
            rows={4}
            placeholder="Explain why this profile is inaccurate or should be removed..."
            value={form.reason}
            onChange={(e) => update("reason", e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg text-white placeholder-gray-500 outline-none text-sm resize-none"
            style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">Supporting Evidence</label>
          <p className="text-xs mb-1.5" style={{ color: "var(--text-secondary)" }}>
            Links to evidence, transaction hashes, or other supporting information
          </p>
          <textarea
            rows={3}
            placeholder="Provide links, transaction IDs, or any supporting documentation..."
            value={form.evidence}
            onChange={(e) => update("evidence", e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg text-white placeholder-gray-500 outline-none text-sm resize-none"
            style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors mt-2 disabled:opacity-50"
        >
          {submitting ? "Submitting…" : "Submit Dispute"}
        </button>
      </form>
    </div>
  );
}
