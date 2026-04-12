"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

type Tier = {
  id: "24h" | "48h" | "72h";
  label: string;
  price: number;
  desc: string;
  icon: string;
  color: string;
  border: string;
  textColor: string;
  popular?: boolean;
};

const TIERS: Tier[] = [
  {
    id: "24h",
    label: "24 Hours",
    price: 10,
    desc: "Featured in Hall of Shame for 24 hours",
    icon: "⚡",
    color: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.3)",
    textColor: "#ccff00",
  },
  {
    id: "48h",
    label: "48 Hours",
    price: 15,
    desc: "Featured in Hall of Shame for 48 hours",
    icon: "🔥",
    color: "rgba(232,202,0,0.12)",
    border: "rgba(232,202,0,0.38)",
    textColor: "#ccff00",
    popular: true,
  },
  {
    id: "72h",
    label: "72 Hours",
    price: 20,
    desc: "Featured in Hall of Shame for 72 hours",
    icon: "☠️",
    color: "rgba(200,170,0,0.14)",
    border: "rgba(200,170,0,0.42)",
    textColor: "#ccff00",
  },
];

type SelectedProfile = { id: string; display_name: string; slug?: string };

function PromoteInner() {
  const search = useSearchParams();
  const initialProfile = search.get("profile") ?? "";

  const [query, setQuery] = useState(initialProfile);
  const [selected, setSelected] = useState<SelectedProfile | null>(null);
  const [tierId, setTierId] = useState<Tier["id"] | null>(null);
  const [processing, setProcessing] = useState(false);

  const tier = TIERS.find((t) => t.id === tierId) ?? null;

  async function startCheckout() {
    if (!selected || !tierId) return;
    setProcessing(true);
    try {
      const res = await fetch("/api/promote/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile_id: selected.id, tier: tierId }),
      });
      const { url, error } = await res.json();
      if (error) {
        alert("Payment error: " + error);
        setProcessing(false);
        return;
      }
      if (url) {
        window.location.href = url;
      }
    } catch {
      alert("Something went wrong. Please try again.");
      setProcessing(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <div
          className="inline-flex items-center gap-1.5 text-xs font-black tracking-widest uppercase px-2.5 py-1 rounded mb-3"
          style={{ backgroundColor: "rgba(245,158,11,0.1)", color: "#b45309", border: "1px solid rgba(245,158,11,0.3)" }}
        >
          ★ FEATURED HALL OF SHAME
        </div>
        <h1 className="text-2xl font-black sw-title text-center" style={{ color: "var(--text-primary)" }}>
          Feature a Scammer
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          Pin any registry profile to the top of the Hall of Shame for 24, 48, or 72 hours. Maximum visibility for the community&apos;s most important warnings.
        </p>
      </div>

      <div
        className="rounded-xl p-4 mb-8 flex items-start gap-3"
        style={{ backgroundColor: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mt-0.5 flex-shrink-0 text-yellow-500">
          <path d="M12 2l2.39 7.36h7.74l-6.26 4.55 2.39 7.36L12 16.72l-6.26 4.55 2.39-7.36L1.87 9.36h7.74z" />
        </svg>
        <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
          <p className="font-bold mb-1" style={{ color: "#b45309" }}>
            How Featured Profiles Work:
          </p>
          <ul className="space-y-1 list-disc list-inside">
            <li>
              Selected profile appears <strong>pinned at the top</strong> of the Hall of Shame on the homepage.
            </li>
            <li>Shown to every visitor for the chosen duration.</li>
            <li>Features a golden ★ FEATURED badge so it stands out.</li>
            <li>Payment processed securely via Stripe.</li>
          </ul>
        </div>
      </div>

      {/* Step 1 */}
      <section
        className="rounded-2xl p-5 mb-6"
        style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        <h2 className="text-sm font-black mb-3" style={{ color: "var(--text-primary)" }}>
          Step 1 — Select a Profile
        </h2>
        {selected ? (
          <div
            className="flex items-center justify-between rounded-lg px-4 py-3"
            style={{ backgroundColor: "rgba(204,255,0,0.06)", border: "1px solid rgba(204,255,0,0.25)" }}
          >
            <div>
              <div className="text-sm font-black" style={{ color: "var(--text-primary)" }}>
                {selected.display_name}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#ccff00" }}>
                approved
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="text-xs font-bold underline"
              style={{ color: "var(--text-secondary)" }}
            >
              Change
            </button>
          </div>
        ) : (
          <>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search profile by name or Twitter handle..."
              className="w-full px-3 py-2.5 rounded-lg text-sm"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
            />
            {query.trim().length >= 2 && (
              <button
                type="button"
                onClick={() =>
                  setSelected({
                    id: `manual-${query.trim().toLowerCase().replace(/\s+/g, "-")}`,
                    display_name: query.trim(),
                  })
                }
                className="mt-3 w-full text-left rounded-lg px-4 py-3 text-sm transition-all"
                style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px dashed var(--border)", color: "var(--text-primary)" }}
              >
                Use &quot;<strong>{query.trim()}</strong>&quot; as the profile to feature →
              </button>
            )}
          </>
        )}
      </section>

      {/* Step 2 */}
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
                  backgroundColor: on ? t.color : "rgba(255,255,255,0.03)",
                  border: on ? `1.5px solid ${t.border}` : "1px solid var(--border)",
                }}
              >
                {t.popular && (
                  <div
                    className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-black px-2 py-0.5 rounded"
                    style={{ backgroundColor: "#ccff00", color: "#0b0c10" }}
                  >
                    MOST POPULAR
                  </div>
                )}
                <div className="text-2xl mb-2">{t.icon}</div>
                <div className="text-sm font-black mb-1" style={{ color: "var(--text-primary)" }}>
                  {t.label}
                </div>
                <div className="text-xs mb-2" style={{ color: "var(--text-secondary)" }}>
                  {t.desc}
                </div>
                <div className="text-lg font-black" style={{ color: t.textColor }}>
                  ${t.price}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Summary */}
      {selected && tier && (
        <section
          className="rounded-2xl p-5 mb-6"
          style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <h2 className="text-sm font-black mb-4" style={{ color: "var(--text-primary)" }}>
            ★ Order Summary
          </h2>
          <div className="space-y-2 text-xs" style={{ color: "var(--text-secondary)" }}>
            <div className="flex justify-between">
              <span>Profile</span>
              <span className="font-bold" style={{ color: "var(--text-primary)" }}>
                {selected.display_name}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Duration</span>
              <span className="font-bold" style={{ color: "var(--text-primary)" }}>
                {tier.label}
              </span>
            </div>
            <div
              className="flex justify-between pt-2 mt-2 text-sm"
              style={{ borderTop: "1px solid var(--border)", color: "var(--text-primary)" }}
            >
              <span className="font-black">Total</span>
              <span className="font-black" style={{ color: "#ccff00" }}>
                ${tier.price}
              </span>
            </div>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={startCheckout}
        disabled={!selected || !tierId || processing}
        className="w-full py-3 rounded-xl text-sm font-black transition-all disabled:opacity-40"
        style={{
          backgroundColor: "rgba(245,158,11,0.14)",
          border: "1.5px solid rgba(245,158,11,0.45)",
          color: "#f59e0b",
          boxShadow: "0 0 14px rgba(245,158,11,0.2)",
        }}
      >
        {processing ? "Redirecting to Stripe…" : "★ Continue to Stripe Checkout"}
      </button>

      <p className="text-[10px] text-center mt-3" style={{ color: "var(--text-secondary)" }}>
        Secured by Stripe · Instant activation after payment
      </p>

      <div
        className="rounded-xl p-4 mt-6 text-xs"
        style={{ backgroundColor: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.2)", color: "var(--text-secondary)" }}
      >
        <strong style={{ color: "#f59e0b" }}>Important:</strong> All featured profiles are labeled{" "}
        <strong>alleged</strong> unless independently verified. Featuring a profile does not change its legal status.
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
