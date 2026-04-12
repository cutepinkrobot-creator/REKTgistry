"use client";

import { useState } from "react";

const CATEGORY_OPTIONS = [
  "rug_pull",
  "phishing",
  "fake_project",
  "exit_scam",
  "pump_and_dump",
  "social_engineering",
  "other",
];

type ProfileType = "person" | "project";

export default function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileType, setProfileType] = useState<ProfileType>("person");
  const [form, setForm] = useState({
    display_name: "",
    aliases: "",
    twitter_handle: "",
    telegram_handle: "",
    discord_handle: "",
    wallet_addresses: "",
    website: "",
    chain: "",
    categories: [] as string[],
    summary: "",
    amount_lost_usd: "",
    incident_date: "",
    reporter_name: "",
    reporter_email: "",
    evidence_description: "",
    tx_hashes: "",
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function toggleCategory(cat: string) {
    setForm((p) => ({
      ...p,
      categories: p.categories.includes(cat)
        ? p.categories.filter((c) => c !== cat)
        : [...p.categories, cat],
    }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.display_name.trim() || !form.summary.trim()) {
      setError("Please fill in the required fields: Name and Summary.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile_type: profileType,
          display_name: form.display_name.trim(),
          aliases: form.aliases.split(",").map((s) => s.trim()).filter(Boolean),
          twitter_handle: form.twitter_handle.replace("@", "").trim() || null,
          telegram_handle: form.telegram_handle.replace("@", "").trim() || null,
          discord_handle: form.discord_handle.trim() || null,
          wallet_addresses: form.wallet_addresses.split(",").map((s) => s.trim()).filter(Boolean),
          website: form.website.trim() || null,
          chain: form.chain.trim() || null,
          categories: form.categories,
          summary: form.summary.trim(),
          amount_lost_usd: form.amount_lost_usd ? parseFloat(form.amount_lost_usd) : null,
          incident_date: form.incident_date || null,
          reporter_name: form.reporter_name.trim() || null,
          reporter_email: form.reporter_email.trim() || null,
          evidence_description: form.evidence_description.trim(),
          tx_hashes: form.tx_hashes.split(",").map((s) => s.trim()).filter(Boolean),
          website_url: "",
        }),
      });
      const data = await res.json();
      if (data.ok || data.success) {
        setSubmitted(true);
      } else {
        setError(data.error ?? "Submission failed. Please try again.");
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ backgroundColor: "rgba(57,255,20,0.12)", border: "2px solid #39ff14" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#39ff14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="m9 11 3 3L22 4" />
          </svg>
        </div>
        <h1 className="text-2xl font-black mb-3" style={{ color: "var(--text-primary)" }}>
          Report Submitted
        </h1>
        <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
          Your report is now in our review queue. The moderation team will review it within 24–48 hours before it goes live in the directory.
        </p>
        <a
          href="/directory"
          className="inline-flex items-center gap-2 px-5 py-3 text-white rounded-xl text-sm font-bold transition-colors"
          style={{ backgroundColor: "var(--accent)" }}
        >
          Browse Directory
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* honeypot */}
      <input
        name="website_url"
        style={{ position: "absolute", opacity: 0, height: 0, pointerEvents: "none" }}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        readOnly
      />

      <div className="mb-6">
        <div
          className="inline-flex items-center gap-1.5 text-xs font-black tracking-widest uppercase px-2 py-1 rounded mb-3"
          style={{ backgroundColor: "rgba(100,95,0,0.12)", color: "#e8ca00", border: "1px solid rgba(200,180,0,0.3)" }}
        >
          ◈ STRIKE BACK
        </div>
        <h1 className="text-2xl font-black sw-title" style={{ color: "var(--text-primary)" }}>
          Submit a Report
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          All submissions are reviewed before going live. Provide as much evidence as possible.
        </p>
      </div>

      <div
        className="rounded-xl p-4 mb-6"
        style={{ backgroundColor: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.2)" }}
      >
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          <strong style={{ color: "#f59e0b" }}>Important:</strong> All reports are labeled{" "}
          <strong>alleged</strong> until reviewed. False reports may result in legal liability.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Profile type */}
        <section
          className="rounded-2xl p-5"
          style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <h2 className="text-sm font-black mb-1" style={{ color: "var(--text-primary)" }}>
            What are you reporting?
          </h2>
          <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>
            Choose whether you&apos;re reporting an individual person or a scam project / protocol.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setProfileType("person")}
              className="text-left rounded-xl p-4 transition-all"
              style={{
                backgroundColor: profileType === "person" ? "rgba(224,64,251,0.08)" : "rgba(255,255,255,0.03)",
                border: profileType === "person" ? "1.5px solid rgba(224,64,251,0.4)" : "1px solid var(--border)",
              }}
            >
              <div className="text-sm font-black mb-1" style={{ color: "var(--text-primary)" }}>
                Person
              </div>
              <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                An individual scammer — Twitter handle, Telegram, Discord, wallet address
              </div>
            </button>
            <button
              type="button"
              onClick={() => setProfileType("project")}
              className="text-left rounded-xl p-4 transition-all"
              style={{
                backgroundColor: profileType === "project" ? "rgba(74,126,255,0.08)" : "rgba(255,255,255,0.03)",
                border: profileType === "project" ? "1.5px solid rgba(74,126,255,0.4)" : "1px solid var(--border)",
              }}
            >
              <div className="text-sm font-black mb-1" style={{ color: "var(--text-primary)" }}>
                Project / Protocol
              </div>
              <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                A scam token, DeFi protocol, fake exchange, or fraudulent website
              </div>
            </button>
          </div>
        </section>

        {/* Identity */}
        <section
          className="rounded-2xl p-5 space-y-4"
          style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <h2 className="text-sm font-black" style={{ color: "var(--text-primary)" }}>
            {profileType === "project" ? "🌐 Project Details" : "🔍 Social Media Handles"}
          </h2>

          <Field label="Display Name" required>
            <input
              required
              value={form.display_name}
              onChange={(e) => update("display_name", e.target.value)}
              placeholder={profileType === "project" ? "project" : "@handle or real name"}
              className="form-input"
              style={inputStyle}
            />
          </Field>

          <Field label="Known Aliases">
            <input
              value={form.aliases}
              onChange={(e) => update("aliases", e.target.value)}
              placeholder="alias1, alias2"
              style={inputStyle}
            />
          </Field>

          {profileType === "project" && (
            <>
              <Field label="Website / Domain">
                <input
                  value={form.website}
                  onChange={(e) => update("website", e.target.value)}
                  placeholder="https://scamproject.io"
                  style={inputStyle}
                />
              </Field>
              <Field label="Blockchain / Chain">
                <input
                  value={form.chain}
                  onChange={(e) => update("chain", e.target.value)}
                  placeholder="Ethereum"
                  style={inputStyle}
                />
              </Field>
              <Field label="Contract / Token Addresses">
                <input
                  value={form.wallet_addresses}
                  onChange={(e) => update("wallet_addresses", e.target.value)}
                  placeholder="0x123..., 0xabc..."
                  style={inputStyle}
                />
              </Field>
            </>
          )}

          <Field label="Twitter / X Handle">
            <input
              value={form.twitter_handle}
              onChange={(e) => update("twitter_handle", e.target.value)}
              placeholder="@handle"
              style={inputStyle}
            />
          </Field>

          <Field label="Telegram">
            <input
              value={form.telegram_handle}
              onChange={(e) => update("telegram_handle", e.target.value)}
              placeholder="@handle or group name"
              style={inputStyle}
            />
          </Field>

          <Field label="Discord">
            <input
              value={form.discord_handle}
              onChange={(e) => update("discord_handle", e.target.value)}
              placeholder="username or username#0000"
              style={inputStyle}
            />
          </Field>

          {profileType === "person" && (
            <Field label="Wallet Addresses">
              <input
                value={form.wallet_addresses}
                onChange={(e) => update("wallet_addresses", e.target.value)}
                placeholder="0x123..., 0xabc..."
                style={inputStyle}
              />
            </Field>
          )}

          <Field label="Categories">
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((cat) => {
                const on = form.categories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                    style={{
                      backgroundColor: on ? "rgba(224,64,251,0.12)" : "rgba(255,255,255,0.04)",
                      border: on ? "1.5px solid rgba(224,64,251,0.45)" : "1px solid var(--border)",
                      color: on ? "#e040fb" : "var(--text-secondary)",
                    }}
                  >
                    {cat.replace(/_/g, " ")}
                  </button>
                );
              })}
            </div>
          </Field>
        </section>

        {/* Incident */}
        <section
          className="rounded-2xl p-5 space-y-4"
          style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <h2 className="text-sm font-black" style={{ color: "var(--text-primary)" }}>
            Incident Details
          </h2>

          <Field label="Summary" required>
            <textarea
              required
              rows={5}
              value={form.summary}
              onChange={(e) => update("summary", e.target.value)}
              placeholder="Explain the scam, how it unfolded, what methods were used..."
              style={inputStyle}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Approximate Loss (USD)">
              <input
                type="number"
                value={form.amount_lost_usd}
                onChange={(e) => update("amount_lost_usd", e.target.value)}
                placeholder="e.g. 50000"
                style={inputStyle}
              />
            </Field>
            <Field label="Incident Date">
              <input
                type="date"
                value={form.incident_date}
                onChange={(e) => update("incident_date", e.target.value)}
                style={inputStyle}
              />
            </Field>
          </div>

          <Field label="Evidence Description">
            <textarea
              rows={4}
              value={form.evidence_description}
              onChange={(e) => update("evidence_description", e.target.value)}
              placeholder="On [date], I observed... I have screenshots of... Transaction hash: 0x..."
              style={inputStyle}
            />
          </Field>

          <Field label="Transaction Hashes">
            <input
              value={form.tx_hashes}
              onChange={(e) => update("tx_hashes", e.target.value)}
              placeholder="0xabc123..., 0xdef456..."
              style={inputStyle}
            />
          </Field>

          <div
            className="rounded-xl p-4 text-xs"
            style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px dashed var(--border)", color: "var(--text-secondary)" }}
          >
            <div className="font-bold mb-1" style={{ color: "var(--text-primary)" }}>
              Upload Evidence Files
            </div>
            Screenshots, screen recordings, PDFs — up to 5 files, 10MB each. (
            <span className="underline">click to browse</span>) JPG, PNG, GIF, WEBP, MP4, PDF
          </div>
        </section>

        {/* Your info */}
        <section
          className="rounded-2xl p-5 space-y-4"
          style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <h2 className="text-sm font-black" style={{ color: "var(--text-primary)" }}>
            Your Information
          </h2>

          <Field label="Your Name">
            <input
              value={form.reporter_name}
              onChange={(e) => update("reporter_name", e.target.value)}
              style={inputStyle}
            />
          </Field>

          <Field label="Your Email (optional)">
            <input
              type="email"
              value={form.reporter_email}
              onChange={(e) => update("reporter_email", e.target.value)}
              placeholder="you@example.com"
              style={inputStyle}
            />
          </Field>

          <p className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
            <strong style={{ color: "var(--text-primary)" }}>Privacy:</strong> Your email is never shown publicly. It&apos;s only used so moderators can contact you about your report.
          </p>
        </section>

        {error && (
          <div
            className="rounded-lg p-3 text-sm"
            style={{ backgroundColor: "rgba(204,0,0,0.1)", border: "1px solid rgba(204,0,0,0.25)", color: "#ff6b6b" }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-xl text-sm font-black transition-all disabled:opacity-40"
          style={{
            backgroundColor: "rgba(224,64,251,0.12)",
            border: "1.5px solid rgba(224,64,251,0.45)",
            color: "#e040fb",
            boxShadow: "0 0 14px rgba(224,64,251,0.18)",
          }}
        >
          {submitting ? "Submitting…" : "◈ Submit Report"}
        </button>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  backgroundColor: "rgba(255,255,255,0.04)",
  border: "1px solid var(--border)",
  color: "var(--text-primary)",
  fontSize: 14,
  outline: "none",
};

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-bold mb-2" style={{ color: "var(--text-secondary)" }}>
        {label} {required && <span style={{ color: "#ff5050" }}>*</span>}
      </label>
      {children}
    </div>
  );
}
