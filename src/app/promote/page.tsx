"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { getProfiles, getFeaturedProfiles, ScammerProfile } from "@/lib/supabase";

type TierId = "24h" | "3d" | "7d";

type Tier = {
  id: TierId;
  label: string;
  duration: string;
  price: number;
  desc: string;
  icon: string;
  popular?: boolean;
};

const TIERS: Tier[] = [
  {
    id: "24h",
    label: "24 Hours",
    duration: "1 day",
    price: 10,
    desc: "Pinned at the top of the Hall of Shame for 24 hours",
    icon: "⚡",
  },
  {
    id: "3d",
    label: "3 Days",
    duration: "72 hours",
    price: 15,
    desc: "Maximum visibility for 3 full days",
    icon: "🔥",
    popular: true,
  },
  {
    id: "7d",
    label: "1 Week",
    duration: "7 days",
    price: 20,
    desc: "Full week of featured placement — best value",
    icon: "☠️",
  },
];

function ProfileSearchResult({ profile, onSelect }: { profile: ScammerProfile; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
      style={{
        backgroundColor: "rgba(255,255,255,0.03)",
        border: "1px solid var(--darkside-border)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(204,255,0,0.06)")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)")}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
        style={{ backgroundColor: "rgba(55,70,0,0.4)", color: "#ccff00", border: "1px solid rgba(100,130,0,0.4)" }}
      >
        {profile.display_name?.charAt(0)?.toUpperCase() ?? "?"}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-bold truncate" style={{ color: "var(--text-primary)" }}>
          {profile.display_name}
        </div>
        {profile.twitter_handle && (
          <div className="text-xs" style={{ color: "#5a6080" }}>@{profile.twitter_handle}</div>
        )}
      </div>
      <div
        className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded flex-shrink-0"
        style={{ backgroundColor: "rgba(55,70,0,0.3)", color: "#ccff00", border: "1px solid rgba(100,130,0,0.4)" }}
      >
        SELECT →
      </div>
    </button>
  );
}

function timeRemaining(until: string): string {
  const diff = new Date(until).getTime() - Date.now();
  if (diff <= 0) return "expired";
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 24) return `${hrs}h remaining`;
  const days = Math.floor(hrs / 24);
  return `${days}d remaining`;
}

function FeaturedProfileCard({ profile }: { profile: ScammerProfile }) {
  const remaining = profile.featured_until ? timeRemaining(profile.featured_until) : "";
  return (
    <div
      style={{
        borderRadius: "14px",
        padding: "16px",
        backgroundColor: "rgba(245,158,11,0.05)",
        border: "1.5px solid rgba(245,158,11,0.25)",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            backgroundColor: "rgba(55,70,0,0.4)",
            color: "#ccff00",
            border: "1px solid rgba(100,130,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            fontWeight: 900,
            fontFamily: "Orbitron, sans-serif",
            flexShrink: 0,
          }}
        >
          {profile.display_name?.charAt(0)?.toUpperCase() ?? "?"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "13px", fontWeight: 900, color: "var(--text-primary)", fontFamily: "Orbitron, sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {profile.display_name}
          </div>
          {profile.twitter_handle && (
            <div style={{ fontSize: "11px", color: "#5a6080", fontFamily: "Orbitron, sans-serif" }}>
              @{profile.twitter_handle}
            </div>
          )}
        </div>
        <div
          style={{
            fontSize: "9px",
            fontWeight: 700,
            padding: "3px 8px",
            borderRadius: "5px",
            backgroundColor: "rgba(245,158,11,0.12)",
            color: "#f59e0b",
            border: "1px solid rgba(245,158,11,0.35)",
            fontFamily: "Orbitron, sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          ★ FEATURED
        </div>
      </div>
      {profile.summary && (
        <p
          style={{
            fontSize: "11px",
            color: "var(--text-secondary)",
            fontFamily: "Orbitron, sans-serif",
            margin: 0,
            lineHeight: 1.5,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          } as React.CSSProperties}
        >
          {profile.summary}
        </p>
      )}
      <div style={{ fontSize: "10px", color: "#f59e0b", fontFamily: "Orbitron, sans-serif", fontWeight: 700 }}>
        ⏱ {remaining}
      </div>
    </div>
  );
}

function PromoteInner() {
  const search = useSearchParams();
  const status = search.get("status");

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ScammerProfile[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<ScammerProfile | null>(null);
  const [tierId, setTierId] = useState<TierId | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [featuredProfiles, setFeaturedProfiles] = useState<ScammerProfile[]>([]);
  const step1Ref = useRef<HTMLElement | null>(null);

  const tier = TIERS.find((t) => t.id === tierId) ?? null;

  // Fetch currently featured profiles on mount
  useEffect(() => {
    getFeaturedProfiles(3).then(({ data }) => {
      setFeaturedProfiles(data ?? []);
    });
  }, []);

  // Live search Supabase
  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); return; }
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      setSearching(true);
      const { data } = await getProfiles({ search: query.trim(), pageSize: 6, page: 1 });
      setResults(data ?? []);
      setSearching(false);
    }, 300);
  }, [query]);

  async function startCheckout() {
    if (!selected || !tierId) return;
    setProcessing(true);
    setError(null);
    try {
      const res = await fetch("/api/promote/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile_id: selected.id, tier: tierId }),
      });
      const { url, error: apiError } = await res.json();
      if (apiError) {
        setError(apiError);
        setProcessing(false);
        return;
      }
      if (url) window.location.href = url;
    } catch {
      setError("Something went wrong. Please try again.");
      setProcessing(false);
    }
  }

  // Success / cancel states from Stripe redirect
  if (status === "success") {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl"
          style={{ backgroundColor: "rgba(245,158,11,0.12)", border: "2px solid #f59e0b" }}
        >
          ★
        </div>
        <h1 className="text-2xl font-black mb-3 sw-title" style={{ color: "#f59e0b" }}>
          Profile Featured!
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
          The profile is now pinned at the top of the Hall of Shame. It will be visible to every visitor for the chosen duration.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black"
          style={{ backgroundColor: "rgba(245,158,11,0.14)", border: "1.5px solid rgba(245,158,11,0.45)", color: "#f59e0b" }}
        >
          ← Back to Home
        </a>
      </div>
    );
  }

  if (status === "cancel") {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl"
          style={{ backgroundColor: "rgba(204,0,0,0.1)", border: "2px solid rgba(204,0,0,0.3)" }}
        >
          ✕
        </div>
        <h1 className="text-xl font-black mb-3 sw-title" style={{ color: "var(--text-primary)" }}>
          Payment Cancelled
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
          No charge was made. You can try again whenever you&apos;re ready.
        </p>
        <a
          href="/promote"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black"
          style={{ backgroundColor: "rgba(245,158,11,0.14)", border: "1.5px solid rgba(245,158,11,0.45)", color: "#f59e0b" }}
        >
          Try Again
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

      {/* Currently Featured — only shown when there are active featured profiles */}
      {featuredProfiles.length > 0 && (
        <section className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: "6px",
                backgroundColor: "rgba(245,158,11,0.1)",
                color: "#f59e0b",
                border: "1px solid rgba(245,158,11,0.3)",
                fontFamily: "Orbitron, sans-serif",
                letterSpacing: "0.08em",
              }}
            >
              ★ CURRENTLY FEATURED
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {featuredProfiles.map((p) => (
              <FeaturedProfileCard key={p.id} profile={p} />
            ))}
          </div>
        </section>
      )}

      {/* Header */}
      <div className="mb-6 text-center">
        <div
          className="inline-flex items-center gap-1.5 text-xs font-black tracking-widest uppercase px-2.5 py-1 rounded mb-3"
          style={{ backgroundColor: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.3)" }}
        >
          ★ FEATURED HALL OF SHAME
        </div>
        <h1 className="text-2xl font-black sw-title" style={{ color: "var(--text-primary)" }}>
          Feature a Scammer
        </h1>
        <p className="text-sm mt-2 max-w-lg mx-auto" style={{ color: "var(--text-secondary)" }}>
          Pin any registered profile to the top of the Hall of Shame so the community sees it first.
          Maximum exposure for the most important warnings.
        </p>
      </div>

      {/* How it works */}
      <div
        className="rounded-xl p-4 mb-8 flex items-start gap-3"
        style={{ backgroundColor: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.2)" }}
      >
        <span style={{ fontSize: 18, flexShrink: 0 }}>★</span>
        <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
          <p className="font-bold mb-1.5" style={{ color: "#f59e0b" }}>How Featured Profiles Work</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Profile is <strong style={{ color: "var(--text-primary)" }}>pinned at the top</strong> of the Hall of Shame homepage</li>
            <li>Shown to every visitor for your chosen duration</li>
            <li>Displays a gold <strong style={{ color: "#f59e0b" }}>★ FEATURED</strong> badge</li>
            <li>Payment processed securely via Stripe — no account required</li>
          </ul>
        </div>
      </div>

      {/* Step 1 — search */}
      <section
        ref={step1Ref}
        className="rounded-2xl p-5 mb-6"
        style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        <h2 className="text-sm font-black mb-3" style={{ color: "var(--text-primary)" }}>
          Step 1 — Find the Profile
        </h2>

        {selected ? (
          <div
            className="flex items-center justify-between rounded-lg px-4 py-3"
            style={{ backgroundColor: "rgba(204,255,0,0.06)", border: "1px solid rgba(204,255,0,0.3)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
                style={{ backgroundColor: "rgba(55,70,0,0.4)", color: "#ccff00", border: "1px solid rgba(100,130,0,0.4)" }}
              >
                {selected.display_name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-black" style={{ color: "var(--text-primary)" }}>{selected.display_name}</div>
                {selected.twitter_handle && (
                  <div className="text-xs" style={{ color: "#5a6080" }}>@{selected.twitter_handle}</div>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setSelected(null); setQuery(""); }}
              className="text-xs font-bold underline ml-4"
              style={{ color: "var(--text-secondary)" }}
            >
              Change
            </button>
          </div>
        ) : (
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--text-secondary)" }}
            >
              <path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or Twitter handle..."
              className="w-full pl-8 pr-4 py-2.5 rounded-lg text-sm outline-none"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--darkside-border)", color: "var(--text-primary)" }}
            />
            {searching && (
              <div className="mt-2 text-xs" style={{ color: "var(--text-secondary)" }}>Searching...</div>
            )}
            {results.length > 0 && !searching && (
              <div className="mt-2 space-y-1.5">
                {results.map((p) => (
                  <ProfileSearchResult key={p.id} profile={p} onSelect={() => { setSelected(p); setResults([]); setQuery(""); }} />
                ))}
              </div>
            )}
            {query.trim().length >= 2 && results.length === 0 && !searching && (
              <div className="mt-3">
                <div
                  style={{
                    borderRadius: "12px",
                    padding: "16px 18px",
                    border: "1.5px dashed rgba(204,255,0,0.2)",
                    backgroundColor: "rgba(204,255,0,0.03)",
                  }}
                >
                  <div
                    className="text-sm font-black mb-1.5"
                    style={{ color: "var(--text-primary)", fontFamily: "Orbitron, sans-serif" }}
                  >
                    Not in the registry yet?
                  </div>
                  <p className="text-xs mb-4" style={{ color: "var(--text-secondary)", fontFamily: "Orbitron, sans-serif" }}>
                    You can feature someone as soon as they&apos;re added. Submit a new report first — it takes under 2 minutes.
                  </p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <a
                      href="/submit"
                      className="inline-flex items-center gap-1 text-xs font-black px-4 py-2 rounded-lg"
                      style={{
                        backgroundColor: "rgba(204,255,0,0.1)",
                        border: "1.5px solid rgba(204,255,0,0.3)",
                        color: "#ccff00",
                        fontFamily: "Orbitron, sans-serif",
                        textDecoration: "none",
                      }}
                    >
                      Submit a Report →
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        setResults([]);
                        step1Ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                      }}
                      className="inline-flex items-center gap-1 text-xs font-black px-4 py-2 rounded-lg"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.04)",
                        border: "1px solid var(--border)",
                        color: "var(--text-secondary)",
                        fontFamily: "Orbitron, sans-serif",
                        cursor: "pointer",
                      }}
                    >
                      Or feature someone already in the registry ↑
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Step 2 — tier */}
      <section
        className="rounded-2xl p-5 mb-6"
        style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        <h2 className="text-sm font-black mb-4" style={{ color: "var(--text-primary)" }}>
          Step 2 — Choose Duration
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TIERS.map((t) => {
            const on = tierId === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTierId(t.id)}
                className="relative text-left rounded-xl p-4 transition-all"
                style={{
                  backgroundColor: on ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.03)",
                  border: on ? "1.5px solid rgba(245,158,11,0.5)" : "1px solid var(--border)",
                }}
              >
                {t.popular && (
                  <div
                    className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-black px-2 py-0.5 rounded whitespace-nowrap"
                    style={{ backgroundColor: "#ccff00", color: "#0b0c10" }}
                  >
                    MOST POPULAR
                  </div>
                )}
                <div className="text-2xl mb-2">{t.icon}</div>
                <div className="text-sm font-black mb-1" style={{ color: "var(--text-primary)" }}>
                  {t.label}
                </div>
                <div className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>
                  {t.desc}
                </div>
                <div className="text-xl font-black" style={{ color: on ? "#f59e0b" : "#ccff00" }}>
                  ${t.price}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Order summary */}
      {selected && tier && (
        <section
          className="rounded-2xl p-5 mb-6"
          style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <h2 className="text-sm font-black mb-4" style={{ color: "var(--text-primary)" }}>★ Order Summary</h2>
          <div className="space-y-2 text-xs" style={{ color: "var(--text-secondary)" }}>
            <div className="flex justify-between">
              <span>Profile</span>
              <span className="font-bold" style={{ color: "var(--text-primary)" }}>{selected.display_name}</span>
            </div>
            <div className="flex justify-between">
              <span>Duration</span>
              <span className="font-bold" style={{ color: "var(--text-primary)" }}>{tier.label} ({tier.duration})</span>
            </div>
            <div
              className="flex justify-between pt-2 mt-2 text-sm"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <span className="font-black" style={{ color: "var(--text-primary)" }}>Total</span>
              <span className="font-black" style={{ color: "#f59e0b" }}>${tier.price}.00 USD</span>
            </div>
          </div>
        </section>
      )}

      {error && (
        <div
          className="rounded-lg p-3 text-sm mb-4"
          style={{ backgroundColor: "rgba(204,0,0,0.1)", border: "1px solid rgba(204,0,0,0.25)", color: "#ff6b6b" }}
        >
          {error}
        </div>
      )}

      {/* Payment */}
      <button
        type="button"
        onClick={startCheckout}
        disabled={!selected || !tierId || processing}
        className="w-full py-3.5 rounded-xl text-sm font-black transition-all disabled:opacity-40"
        style={{
          backgroundColor: "rgba(245,158,11,0.14)",
          border: "1.5px solid rgba(245,158,11,0.5)",
          color: "#f59e0b",
          boxShadow: "0 0 18px rgba(245,158,11,0.15)",
        }}
      >
        {processing
          ? "Redirecting to Stripe…"
          : selected && tier
            ? `★ Pay $${tier.price} — Feature for ${tier.label}`
            : "★ Select a Profile & Duration to Continue"}
      </button>

      <p className="text-[10px] text-center mt-3" style={{ color: "var(--text-secondary)" }}>
        Secured by Stripe · Visa, Mastercard, Amex, Apple Pay · Instant activation after payment
      </p>

      <div
        className="rounded-xl p-4 mt-6 text-xs"
        style={{ backgroundColor: "rgba(245,158,11,0.04)", border: "1px solid rgba(245,158,11,0.15)", color: "var(--text-secondary)" }}
      >
        <strong style={{ color: "#f59e0b" }}>Important:</strong> Featured profiles remain labeled{" "}
        <strong>alleged</strong> unless independently verified. Featuring does not affect a profile&apos;s legal status or our editorial decisions.
      </div>
    </div>
  );
}

export default function PromotePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto px-4 py-20 text-center" style={{ color: "var(--text-secondary)" }}>
          Loading…
        </div>
      }
    >
      <PromoteInner />
    </Suspense>
  );
}
