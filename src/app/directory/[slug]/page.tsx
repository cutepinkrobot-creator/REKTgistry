"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { getProfileBySlugOrId, ScammerProfile } from "@/lib/supabase";

// ── Helpers ─────────────────────────────────────────────────────────────────
function formatUsd(n: number | null): string {
  if (!n) return "—";
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

function formatDate(d: string | null): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatRelative(d: string): string {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(d);
}

function isFeatured(featured_until: string | null): boolean {
  if (!featured_until) return false;
  return new Date(featured_until) > new Date();
}

type ConfidenceTier = { label: string; color: string; bg: string; border: string };
function getConfidenceTier(profile: ScammerProfile): ConfidenceTier {
  if (profile.verified) {
    return { label: "✓ VERIFIED", color: "#39ff14", bg: "rgba(57,255,20,0.1)", border: "rgba(57,255,20,0.35)" };
  }
  const hasTx = Array.isArray(profile.tx_hashes) && profile.tx_hashes.length > 0;
  const hasEvidence = Array.isArray(profile.evidence_urls) && profile.evidence_urls.length > 0;
  if (hasTx || hasEvidence) {
    return { label: "◈ EVIDENCE-SUPPORTED", color: "#60a5fa", bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.3)" };
  }
  return { label: "○ UNVERIFIED", color: "#6b7280", bg: "rgba(107,114,128,0.08)", border: "rgba(107,114,128,0.2)" };
}

// ── Comment types ────────────────────────────────────────────────────────────
interface Comment {
  id: string;
  profile_id: string;
  content: string;
  nickname: string | null;
  created_at: string;
}

interface Rebuttal {
  id: string;
  profile_id: string;
  name: string | null;
  content: string;
  created_at: string;
}

// ── Skeleton loader ──────────────────────────────────────────────────────────
function SkeletonBlock({ w, h }: { w?: string; h?: string }) {
  return (
    <div
      style={{
        width: w ?? "100%",
        height: h ?? "16px",
        borderRadius: "6px",
        backgroundColor: "rgba(255,255,255,0.05)",
        animation: "pulse 1.5s ease-in-out infinite",
      }}
    />
  );
}

function ProfileSkeleton() {
  return (
    <main className="min-h-screen" style={{ paddingTop: "72px" }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <SkeletonBlock w="80px" h="32px" />
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.05)" }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
            <SkeletonBlock w="200px" h="28px" />
            <SkeletonBlock w="120px" h="18px" />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ borderRadius: "12px", padding: "16px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <SkeletonBlock w="60%" h="12px" />
              <div style={{ marginTop: 8 }}><SkeletonBlock w="80%" h="24px" /></div>
            </div>
          ))}
        </div>
        <SkeletonBlock h="120px" />
      </div>
    </main>
  );
}

// ── Not Found ────────────────────────────────────────────────────────────────
function NotFound() {
  return (
    <main className="min-h-screen" style={{ paddingTop: "72px" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            backgroundColor: "rgba(204,0,0,0.12)",
            border: "2px solid rgba(204,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            margin: "0 auto 20px",
          }}
        >
          ?
        </div>
        <h1 className="text-2xl font-black" style={{ color: "var(--text-primary)", fontFamily: "Orbitron, sans-serif" }}>
          Profile Not Found
        </h1>
        <p className="text-sm mt-3 mb-8" style={{ color: "var(--text-secondary)", fontFamily: "Orbitron, sans-serif" }}>
          This profile doesn&apos;t exist, hasn&apos;t been approved yet, or the link is incorrect.
        </p>
        <Link
          href="/directory"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black"
          style={{
            backgroundColor: "rgba(204,255,0,0.08)",
            border: "1.5px solid rgba(204,255,0,0.3)",
            color: "#ccff00",
            fontFamily: "Orbitron, sans-serif",
            textDecoration: "none",
          }}
        >
          ← Back to Registry
        </Link>
      </div>
    </main>
  );
}

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div
      style={{
        borderRadius: "12px",
        padding: "16px",
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
      }}
    >
      <div style={{ fontSize: "10px", color: "var(--text-secondary)", fontFamily: "Orbitron, sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ fontSize: "20px", fontWeight: 900, color: accent ?? "var(--text-primary)", fontFamily: "Orbitron, sans-serif" }}>
        {value}
      </div>
    </div>
  );
}

// ── Chip ─────────────────────────────────────────────────────────────────────
function Chip({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span
      style={{
        fontSize: "11px",
        fontWeight: 700,
        padding: "3px 10px",
        borderRadius: "6px",
        backgroundColor: accent ? "rgba(204,255,0,0.08)" : "rgba(255,255,255,0.04)",
        color: accent ? "#ccff00" : "var(--text-secondary)",
        border: `1px solid ${accent ? "rgba(100,130,0,0.4)" : "rgba(255,255,255,0.08)"}`,
        fontFamily: "Orbitron, sans-serif",
        letterSpacing: "0.04em",
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
}

// ── Comment Card ──────────────────────────────────────────────────────────────
function CommentCard({ comment }: { comment: Comment }) {
  return (
    <div
      style={{
        borderRadius: "10px",
        padding: "14px 16px",
        backgroundColor: "rgba(255,255,255,0.02)",
        border: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
        <span style={{ fontSize: "12px", fontWeight: 700, color: "#ccff00", fontFamily: "Orbitron, sans-serif" }}>
          {comment.nickname || "Anonymous"}
        </span>
        <span style={{ fontSize: "10px", color: "var(--text-secondary)", fontFamily: "Orbitron, sans-serif" }}>
          {formatRelative(comment.created_at)}
        </span>
      </div>
      <p style={{ fontSize: "13px", color: "var(--text-primary)", fontFamily: "Orbitron, sans-serif", lineHeight: 1.6, margin: 0 }}>
        {comment.content}
      </p>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const [profile, setProfile] = useState<ScammerProfile | null | undefined>(undefined);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  // comment form
  const [content, setContent] = useState("");
  const [nickname, setNickname] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // rebuttal
  const [rebuttals, setRebuttals] = useState<Rebuttal[]>([]);
  const [rebuttalContent, setRebuttalContent] = useState("");
  const [rebuttalName, setRebuttalName] = useState("");
  const [rebuttalEmail, setRebuttalEmail] = useState("");
  const [rebuttalSubmitting, setRebuttalSubmitting] = useState(false);
  const [rebuttalError, setRebuttalError] = useState<string | null>(null);
  const [rebuttalSuccess, setRebuttalSuccess] = useState(false);
  const [showRebuttalForm, setShowRebuttalForm] = useState(false);

  // Show/hide full alias/wallet lists
  const [showAllAliases, setShowAllAliases] = useState(false);
  const [showAllWallets, setShowAllWallets] = useState(false);

  // Fetch profile
  useEffect(() => {
    if (!slug) return;
    getProfileBySlugOrId(slug).then(({ data }) => {
      setProfile(data ?? null);
    });
  }, [slug]);

  // Fetch comments once we have profile
  useEffect(() => {
    if (!profile?.id) return;
    setCommentsLoading(true);
    fetch(`/api/comments?profile_id=${profile.id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) setComments(json.comments ?? []);
      })
      .finally(() => setCommentsLoading(false));
  }, [profile?.id]);

  // Fetch rebuttals
  useEffect(() => {
    if (!profile?.id) return;
    fetch(`/api/rebuttal?profile_id=${profile.id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) setRebuttals(json.rebuttals ?? []);
      });
  }, [profile?.id]);

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile_id: profile!.id, content, nickname: nickname.trim() || undefined }),
      });
      const json = await res.json();
      if (!json.ok) {
        setSubmitError(json.error ?? "Failed to submit comment.");
      } else {
        setSubmitSuccess(true);
        setContent("");
        setNickname("");
        // Re-fetch comments
        const r = await fetch(`/api/comments?profile_id=${profile!.id}`);
        const j = await r.json();
        if (j.ok) setComments(j.comments ?? []);
      }
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitRebuttal(e: React.FormEvent) {
    e.preventDefault();
    if (rebuttalSubmitting) return;
    setRebuttalError(null);
    setRebuttalSubmitting(true);
    try {
      const res = await fetch("/api/rebuttal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile_id: profile!.id,
          name: rebuttalName.trim() || null,
          email: rebuttalEmail.trim() || null,
          content: rebuttalContent.trim(),
        }),
      });
      const json = await res.json();
      if (!json.ok) {
        setRebuttalError(json.error ?? "Failed to submit rebuttal.");
      } else {
        setRebuttalSuccess(true);
        setRebuttalContent("");
        setRebuttalName("");
        setRebuttalEmail("");
        setShowRebuttalForm(false);
      }
    } catch {
      setRebuttalError("Something went wrong. Please try again.");
    } finally {
      setRebuttalSubmitting(false);
    }
  }

  // Loading
  if (profile === undefined) return <ProfileSkeleton />;

  // Not found
  if (profile === null) return <NotFound />;

  const featured = isFeatured(profile.featured_until);
  const confidenceTier = getConfidenceTier(profile);
  const aliases = profile.aliases ?? [];
  const wallets = profile.wallet_addresses ?? [];
  const categories = profile.categories ?? [];
  const visibleAliases = showAllAliases ? aliases : aliases.slice(0, 3);
  const visibleWallets = showAllWallets ? wallets : wallets.slice(0, 2);

  return (
    <main className="min-h-screen" style={{ paddingTop: "72px" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* Back button */}
        <Link
          href="/directory"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            fontWeight: 700,
            color: "var(--text-secondary)",
            textDecoration: "none",
            fontFamily: "Orbitron, sans-serif",
            marginBottom: "16px",
            letterSpacing: "0.04em",
          }}
        >
          ← Registry
        </Link>

        {/* Disclaimer banner */}
        <div
          style={{
            borderRadius: "10px",
            padding: "12px 16px",
            marginBottom: "20px",
            backgroundColor: "rgba(245,158,11,0.05)",
            border: "1px solid rgba(245,158,11,0.2)",
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "14px", flexShrink: 0, marginTop: "1px" }}>⚖️</span>
          <p style={{ fontSize: "11px", color: "var(--text-secondary)", fontFamily: "Orbitron, sans-serif", margin: 0, lineHeight: 1.6 }}>
            <strong style={{ color: "#f59e0b" }}>Disclaimer:</strong> All profiles on REKTgistry are based on community-submitted reports and public on-chain data.
            All allegations are unverified unless marked otherwise. This is not legal advice. If you believe a profile is inaccurate, you may{" "}
            <button
              onClick={() => setShowRebuttalForm(true)}
              style={{ color: "#f59e0b", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "Orbitron, sans-serif", fontSize: "11px", fontWeight: 700, textDecoration: "underline" }}
            >
              submit a rebuttal
            </button>
            .
          </p>
        </div>

        {/* Profile header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", marginBottom: "24px", flexWrap: "wrap" }}>
          {/* Avatar */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              backgroundColor: "#ccff00",
              color: "#0b0c10",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: 900,
              fontFamily: "Orbitron, sans-serif",
              flexShrink: 0,
              border: "2px solid rgba(204,255,0,0.4)",
              boxShadow: "0 0 20px rgba(204,255,0,0.2)",
            }}
          >
            {profile.display_name?.charAt(0)?.toUpperCase() ?? "?"}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Name */}
            <h1
              style={{
                fontSize: "clamp(20px, 4vw, 28px)",
                fontWeight: 900,
                color: "var(--text-primary)",
                fontFamily: "Orbitron, sans-serif",
                margin: "0 0 8px",
                lineHeight: 1.2,
              }}
            >
              {profile.display_name}
            </h1>

            {/* Badges */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
              {/* Confidence tier badge */}
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: "6px",
                  backgroundColor: confidenceTier.bg,
                  color: confidenceTier.color,
                  border: `1px solid ${confidenceTier.border}`,
                  fontFamily: "Orbitron, sans-serif",
                  letterSpacing: "0.08em",
                }}
              >
                {confidenceTier.label}
              </span>
              {featured && (
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "6px",
                    backgroundColor: "rgba(245,158,11,0.12)",
                    color: "#f59e0b",
                    border: "1px solid rgba(245,158,11,0.35)",
                    fontFamily: "Orbitron, sans-serif",
                    letterSpacing: "0.08em",
                  }}
                >
                  ★ FEATURED
                </span>
              )}
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: "6px",
                  backgroundColor: "rgba(136,153,187,0.1)",
                  color: "#8899bb",
                  border: "1px solid rgba(136,153,187,0.2)",
                  fontFamily: "Orbitron, sans-serif",
                  letterSpacing: "0.06em",
                  textTransform: "capitalize",
                }}
              >
                {profile.profile_type === "person" ? "Person" : "Project"}
              </span>
            </div>

            {/* Social handles */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {profile.twitter_handle && (
                <a
                  href={`https://x.com/${profile.twitter_handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "6px",
                    backgroundColor: "rgba(255,255,255,0.04)",
                    color: "var(--text-secondary)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    fontFamily: "Orbitron, sans-serif",
                    textDecoration: "none",
                  }}
                >
                  𝕏 @{profile.twitter_handle}
                </a>
              )}
              {profile.telegram_handle && (
                <a
                  href={`https://t.me/${profile.telegram_handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "6px",
                    backgroundColor: "rgba(255,255,255,0.04)",
                    color: "var(--text-secondary)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    fontFamily: "Orbitron, sans-serif",
                    textDecoration: "none",
                  }}
                >
                  TG @{profile.telegram_handle}
                </a>
              )}
              {profile.discord_handle && (
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "6px",
                    backgroundColor: "rgba(255,255,255,0.04)",
                    color: "var(--text-secondary)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    fontFamily: "Orbitron, sans-serif",
                  }}
                >
                  DC {profile.discord_handle}
                </span>
              )}
              {profile.chain && (
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "6px",
                    backgroundColor: "rgba(74,126,255,0.08)",
                    color: "#4a7eff",
                    border: "1px solid rgba(74,126,255,0.2)",
                    fontFamily: "Orbitron, sans-serif",
                    textTransform: "uppercase",
                  }}
                >
                  {profile.chain}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "28px" }}>
          <StatCard label="Amount Lost" value={formatUsd(profile.amount_lost_usd)} accent="#ff5050" />
          <StatCard label="Reports" value={profile.reports_count?.toString() ?? "0"} accent="#ccff00" />
          <StatCard label="Incident Date" value={formatDate(profile.incident_date)} />
        </div>

        {/* Two-column layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
            gap: "20px",
            marginBottom: "32px",
          }}
          className="profile-cols"
        >
          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Summary */}
            {profile.summary && (
              <div
                style={{
                  borderRadius: "14px",
                  padding: "20px",
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border)",
                }}
              >
                <h2
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--text-secondary)",
                    fontFamily: "Orbitron, sans-serif",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: "10px",
                  }}
                >
                  Summary
                </h2>
                <p
                  style={{
                    fontSize: "14px",
                    color: "var(--text-primary)",
                    fontFamily: "Orbitron, sans-serif",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {profile.summary}
                </p>
              </div>
            )}

            {/* Aliases */}
            {aliases.length > 0 && (
              <div
                style={{
                  borderRadius: "14px",
                  padding: "20px",
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border)",
                }}
              >
                <h2
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--text-secondary)",
                    fontFamily: "Orbitron, sans-serif",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: "10px",
                  }}
                >
                  Known Aliases
                </h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {visibleAliases.map((a, i) => (
                    <Chip key={i}>{a}</Chip>
                  ))}
                </div>
                {aliases.length > 3 && (
                  <button
                    type="button"
                    onClick={() => setShowAllAliases(!showAllAliases)}
                    style={{
                      marginTop: "10px",
                      fontSize: "11px",
                      color: "#ccff00",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "Orbitron, sans-serif",
                      padding: 0,
                    }}
                  >
                    {showAllAliases ? "Show less" : `+ ${aliases.length - 3} more`}
                  </button>
                )}
              </div>
            )}

            {/* Wallet addresses */}
            {wallets.length > 0 && (
              <div
                style={{
                  borderRadius: "14px",
                  padding: "20px",
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border)",
                }}
              >
                <h2
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--text-secondary)",
                    fontFamily: "Orbitron, sans-serif",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: "10px",
                  }}
                >
                  Wallet Addresses
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {visibleWallets.map((w, i) => (
                    <div
                      key={i}
                      style={{
                        fontSize: "11px",
                        fontFamily: "monospace",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        backgroundColor: "rgba(255,255,255,0.03)",
                        border: "1px solid var(--border)",
                        color: "#ccff00",
                        wordBreak: "break-all",
                      }}
                    >
                      {w}
                    </div>
                  ))}
                </div>
                {wallets.length > 2 && (
                  <button
                    type="button"
                    onClick={() => setShowAllWallets(!showAllWallets)}
                    style={{
                      marginTop: "10px",
                      fontSize: "11px",
                      color: "#ccff00",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "Orbitron, sans-serif",
                      padding: 0,
                    }}
                  >
                    {showAllWallets ? "Show less" : `+ ${wallets.length - 2} more`}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Categories */}
            {categories.length > 0 && (
              <div
                style={{
                  borderRadius: "14px",
                  padding: "18px",
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border)",
                }}
              >
                <h2
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--text-secondary)",
                    fontFamily: "Orbitron, sans-serif",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: "10px",
                  }}
                >
                  Categories
                </h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {categories.map((c, i) => (
                    <Chip key={i} accent>
                      {c.replace(/_/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase())}
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            {/* Chain */}
            {profile.chain && (
              <div
                style={{
                  borderRadius: "14px",
                  padding: "18px",
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border)",
                }}
              >
                <h2
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--text-secondary)",
                    fontFamily: "Orbitron, sans-serif",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: "10px",
                  }}
                >
                  Chain
                </h2>
                <Chip>{profile.chain.toUpperCase()}</Chip>
              </div>
            )}

            {/* Links */}
            {(profile.website || profile.twitter_handle) && (
              <div
                style={{
                  borderRadius: "14px",
                  padding: "18px",
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border)",
                }}
              >
                <h2
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--text-secondary)",
                    fontFamily: "Orbitron, sans-serif",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: "10px",
                  }}
                >
                  Links
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {profile.website && (
                    <a
                      href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: "11px",
                        color: "#ccff00",
                        fontFamily: "Orbitron, sans-serif",
                        textDecoration: "underline",
                        wordBreak: "break-all",
                      }}
                    >
                      {profile.website}
                    </a>
                  )}
                  {profile.twitter_handle && (
                    <a
                      href={`https://x.com/${profile.twitter_handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: "11px",
                        color: "#ccff00",
                        fontFamily: "Orbitron, sans-serif",
                        textDecoration: "underline",
                      }}
                    >
                      x.com/{profile.twitter_handle}
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Dates meta */}
            <div
              style={{
                borderRadius: "14px",
                padding: "18px",
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              <h2
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                  fontFamily: "Orbitron, sans-serif",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                }}
              >
                Timeline
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {profile.incident_date && (
                  <div>
                    <div style={{ fontSize: "10px", color: "var(--text-secondary)", fontFamily: "Orbitron, sans-serif", marginBottom: "2px" }}>Incident</div>
                    <div style={{ fontSize: "12px", color: "var(--text-primary)", fontFamily: "Orbitron, sans-serif", fontWeight: 700 }}>
                      {formatDate(profile.incident_date)}
                    </div>
                  </div>
                )}
                <div>
                  <div style={{ fontSize: "10px", color: "var(--text-secondary)", fontFamily: "Orbitron, sans-serif", marginBottom: "2px" }}>Added to Registry</div>
                  <div style={{ fontSize: "12px", color: "var(--text-primary)", fontFamily: "Orbitron, sans-serif", fontWeight: 700 }}>
                    {formatDate(profile.created_at)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Responsive fix for small screens */}
        <style>{`
          @media (max-width: 640px) {
            .profile-cols {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>

        {/* Saber divider */}
        <hr className="saber-red" style={{ margin: "0 0 32px" }} />

        {/* Comment section */}
        <section>
          <div style={{ marginBottom: "20px" }}>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 900,
                color: "var(--text-primary)",
                fontFamily: "Orbitron, sans-serif",
                margin: "0 0 4px",
              }}
            >
              💬 Community Intelligence
            </h2>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", fontFamily: "Orbitron, sans-serif", margin: 0 }}>
              Anonymous. No account required. Share what you know.
            </p>
          </div>

          {/* Comment form */}
          <form onSubmit={submitComment} style={{ marginBottom: "28px" }}>
            <div
              style={{
                borderRadius: "14px",
                padding: "20px",
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {/* Honeypot (hidden) */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                aria-hidden="true"
                autoComplete="off"
                style={{ display: "none" }}
              />

              {/* Textarea */}
              <div style={{ position: "relative" }}>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value.slice(0, 500))}
                  placeholder="Share intelligence, warn the community, or add context…"
                  rows={4}
                  style={{
                    width: "100%",
                    resize: "vertical",
                    padding: "12px 14px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--darkside-border, var(--border))",
                    color: "var(--text-primary)",
                    fontFamily: "Orbitron, sans-serif",
                    fontSize: "13px",
                    outline: "none",
                    minHeight: "100px",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "8px",
                    right: "12px",
                    fontSize: "10px",
                    color: content.length > 450 ? "#f59e0b" : "var(--text-secondary)",
                    fontFamily: "Orbitron, sans-serif",
                  }}
                >
                  {content.length}/500
                </div>
              </div>

              {/* Nickname + submit row */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Nickname (optional)"
                  maxLength={40}
                  style={{
                    flex: 1,
                    minWidth: "140px",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--darkside-border, var(--border))",
                    color: "var(--text-primary)",
                    fontFamily: "Orbitron, sans-serif",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  disabled={submitting || content.trim().length < 10}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(204,255,0,0.1)",
                    border: "1.5px solid rgba(204,255,0,0.35)",
                    color: "#ccff00",
                    fontFamily: "Orbitron, sans-serif",
                    fontSize: "12px",
                    fontWeight: 900,
                    cursor: "pointer",
                    opacity: submitting || content.trim().length < 10 ? 0.4 : 1,
                    transition: "opacity 0.2s",
                  }}
                >
                  {submitting ? "Posting…" : "Post →"}
                </button>
              </div>

              {/* Error / success */}
              {submitError && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "#ff6b6b",
                    fontFamily: "Orbitron, sans-serif",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    backgroundColor: "rgba(204,0,0,0.08)",
                    border: "1px solid rgba(204,0,0,0.2)",
                  }}
                >
                  {submitError}
                </div>
              )}
              {submitSuccess && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "#39ff14",
                    fontFamily: "Orbitron, sans-serif",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    backgroundColor: "rgba(57,255,20,0.06)",
                    border: "1px solid rgba(57,255,20,0.2)",
                  }}
                >
                  Comment posted. Thanks for contributing.
                </div>
              )}
            </div>
          </form>

          {/* Comments list */}
          {commentsLoading ? (
            <div style={{ color: "var(--text-secondary)", fontSize: "12px", fontFamily: "Orbitron, sans-serif" }}>
              Loading comments…
            </div>
          ) : comments.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "32px",
                borderRadius: "12px",
                border: "1px dashed rgba(255,255,255,0.08)",
                color: "var(--text-secondary)",
                fontSize: "12px",
                fontFamily: "Orbitron, sans-serif",
              }}
            >
              No comments yet. Be the first to share intelligence.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {comments.map((c) => (
                <CommentCard key={c.id} comment={c} />
              ))}
            </div>
          )}
        </section>

        {/* Rebuttal section */}
        <section style={{ marginTop: "40px" }}>
          <hr style={{ border: "none", borderTop: "1px solid rgba(245,158,11,0.15)", marginBottom: "32px" }} />

          <div style={{ marginBottom: "20px" }}>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 900,
                color: "var(--text-primary)",
                fontFamily: "Orbitron, sans-serif",
                margin: "0 0 4px",
              }}
            >
              ⚖️ Subject Rebuttals
            </h2>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", fontFamily: "Orbitron, sans-serif", margin: 0 }}>
              If you are the subject of this profile and believe it contains inaccurate information, you can submit a rebuttal. All rebuttals are reviewed before publication.
            </p>
          </div>

          {/* Existing rebuttals */}
          {rebuttals.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
              {rebuttals.map((r) => (
                <div
                  key={r.id}
                  style={{
                    borderRadius: "10px",
                    padding: "14px 16px",
                    backgroundColor: "rgba(245,158,11,0.04)",
                    border: "1px solid rgba(245,158,11,0.2)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#f59e0b", fontFamily: "Orbitron, sans-serif" }}>
                      ⚖️ {r.name || "Subject Response"}
                    </span>
                    <span style={{ fontSize: "10px", color: "var(--text-secondary)", fontFamily: "Orbitron, sans-serif" }}>
                      {formatRelative(r.created_at)}
                    </span>
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--text-primary)", fontFamily: "Orbitron, sans-serif", lineHeight: 1.6, margin: 0 }}>
                    {r.content}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Rebuttal success */}
          {rebuttalSuccess && (
            <div
              style={{
                borderRadius: "10px",
                padding: "14px 16px",
                backgroundColor: "rgba(57,255,20,0.06)",
                border: "1px solid rgba(57,255,20,0.2)",
                fontSize: "13px",
                color: "#39ff14",
                fontFamily: "Orbitron, sans-serif",
                marginBottom: "16px",
              }}
            >
              ✓ Rebuttal submitted. Our team will review it within 48 hours before it goes live.
            </div>
          )}

          {/* Rebuttal toggle */}
          {!showRebuttalForm && !rebuttalSuccess && (
            <button
              onClick={() => setShowRebuttalForm(true)}
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                backgroundColor: "rgba(245,158,11,0.08)",
                border: "1.5px solid rgba(245,158,11,0.3)",
                color: "#f59e0b",
                fontFamily: "Orbitron, sans-serif",
                fontSize: "12px",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              I am the subject — submit a rebuttal →
            </button>
          )}

          {/* Rebuttal form */}
          {showRebuttalForm && !rebuttalSuccess && (
            <form onSubmit={submitRebuttal}>
              <div
                style={{
                  borderRadius: "14px",
                  padding: "20px",
                  backgroundColor: "rgba(245,158,11,0.04)",
                  border: "1.5px solid rgba(245,158,11,0.25)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <p style={{ fontSize: "11px", color: "var(--text-secondary)", fontFamily: "Orbitron, sans-serif", margin: 0 }}>
                  This rebuttal will be reviewed by our team before it appears publicly. Include your contact email so we can verify your identity and follow up.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <input
                    type="text"
                    value={rebuttalName}
                    onChange={(e) => setRebuttalName(e.target.value)}
                    placeholder="Your name or company"
                    style={{
                      padding: "10px 12px",
                      borderRadius: "8px",
                      backgroundColor: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(245,158,11,0.2)",
                      color: "var(--text-primary)",
                      fontFamily: "Orbitron, sans-serif",
                      fontSize: "13px",
                      outline: "none",
                    }}
                  />
                  <input
                    type="email"
                    value={rebuttalEmail}
                    onChange={(e) => setRebuttalEmail(e.target.value)}
                    placeholder="Contact email (private)"
                    style={{
                      padding: "10px 12px",
                      borderRadius: "8px",
                      backgroundColor: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(245,158,11,0.2)",
                      color: "var(--text-primary)",
                      fontFamily: "Orbitron, sans-serif",
                      fontSize: "13px",
                      outline: "none",
                    }}
                  />
                </div>

                <textarea
                  value={rebuttalContent}
                  onChange={(e) => setRebuttalContent(e.target.value.slice(0, 1000))}
                  placeholder="Explain why you believe this profile is inaccurate. Include any evidence, context, or supporting links."
                  rows={5}
                  style={{
                    width: "100%",
                    resize: "vertical",
                    padding: "12px 14px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(245,158,11,0.2)",
                    color: "var(--text-primary)",
                    fontFamily: "Orbitron, sans-serif",
                    fontSize: "13px",
                    outline: "none",
                    minHeight: "120px",
                  }}
                />

                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={() => setShowRebuttalForm(false)}
                    style={{
                      padding: "10px 16px",
                      borderRadius: "8px",
                      backgroundColor: "transparent",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "var(--text-secondary)",
                      fontFamily: "Orbitron, sans-serif",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={rebuttalSubmitting || rebuttalContent.trim().length < 20}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "8px",
                      backgroundColor: "rgba(245,158,11,0.12)",
                      border: "1.5px solid rgba(245,158,11,0.4)",
                      color: "#f59e0b",
                      fontFamily: "Orbitron, sans-serif",
                      fontSize: "12px",
                      fontWeight: 900,
                      cursor: "pointer",
                      opacity: rebuttalSubmitting || rebuttalContent.trim().length < 20 ? 0.4 : 1,
                    }}
                  >
                    {rebuttalSubmitting ? "Submitting…" : "Submit Rebuttal →"}
                  </button>
                </div>

                {rebuttalError && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#ff6b6b",
                      fontFamily: "Orbitron, sans-serif",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      backgroundColor: "rgba(204,0,0,0.08)",
                      border: "1px solid rgba(204,0,0,0.2)",
                    }}
                  >
                    {rebuttalError}
                  </div>
                )}
              </div>
            </form>
          )}
        </section>

        {/* Bottom padding */}
        <div style={{ height: "64px" }} />
      </div>
    </main>
  );
}
