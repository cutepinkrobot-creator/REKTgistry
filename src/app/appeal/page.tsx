"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function AppealInner() {
  const search = useSearchParams();
  const profileSlug = search.get("profile") ?? "";
  const profileName = search.get("name") ?? "";

  const [paymentMethod, setPaymentMethod] = useState<"crypto" | "card">("crypto");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "loading" | "ready" | "paid" | "free" | "verifying" | "error">("idle");
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [cryptoChargeId, setCryptoChargeId] = useState<string | null>(null);
  const [cryptoHostedUrl, setCryptoHostedUrl] = useState<string | null>(null);
  const [cryptoPaid, setCryptoPaid] = useState(false);
  const [hasNewInfo] = useState(false);
  const [newInformation] = useState("");
  const [form, setForm] = useState({
    profile_slug: profileSlug,
    appellant_name: "",
    appellant_email: "",
    reason: "",
    evidence: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function updateField(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function startCardPayment() {
    setPaymentStatus("loading");
    setPaymentError(null);
    try {
      const res = await fetch("/api/appeal-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile_slug: profileSlug, profile_name: profileName }),
      });
      const data = await res.json();
      if (!data.success) {
        setPaymentError(data.error ?? "Payment init failed");
        setPaymentStatus("error");
        return;
      }
      if (data.free) {
        setPaymentStatus("free");
        return;
      }
      setPaymentIntentId(data.payment_intent_id);
      setPaymentStatus("ready");
    } catch (err) {
      setPaymentError(String(err));
      setPaymentStatus("error");
    }
  }

  async function startCryptoPayment() {
    setPaymentStatus("loading");
    setPaymentError(null);
    try {
      const res = await fetch("/api/appeal-crypto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile_slug: profileSlug, profile_name: profileName }),
      });
      const data = await res.json();
      if (data.error) {
        setPaymentError(data.error);
        setPaymentStatus("error");
        return;
      }
      setCryptoChargeId(data.charge_id);
      setCryptoHostedUrl(data.hosted_url);
      setPaymentStatus("ready");
    } catch (err) {
      setPaymentError(String(err));
      setPaymentStatus("error");
    }
  }

  async function checkCryptoPayment(chargeId: string) {
    setPaymentStatus("verifying");
    setPaymentError(null);
    try {
      const res = await fetch(`/api/appeal-crypto?charge_id=${encodeURIComponent(chargeId)}`);
      const data = await res.json();
      if (data.paid) {
        setCryptoChargeId(chargeId);
        setCryptoPaid(true);
        setPaymentStatus("paid");
      } else {
        setPaymentError(`Payment status: ${data.status ?? "pending"}. If you just paid, wait a moment and click "Check Payment" again.`);
        setPaymentStatus("ready");
      }
    } catch (err) {
      setPaymentError(String(err));
      setPaymentStatus("error");
    }
  }

  const paymentSatisfied =
    paymentStatus === "paid" ||
    paymentStatus === "free" ||
    (paymentMethod === "crypto" && cryptoPaid) ||
    (paymentMethod === "card" && !!paymentIntentId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.appellant_email.trim() || !form.reason.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/appeal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile_id: form.profile_slug || profileSlug,
          appellant_name: form.appellant_name.trim(),
          appellant_email: form.appellant_email.trim(),
          reason: form.reason.trim(),
          evidence: form.evidence.trim(),
          payment_intent_id: paymentIntentId,
          crypto_charge_id: cryptoChargeId,
          new_information: hasNewInfo ? newInformation.trim() : undefined,
        }),
      });
      const data = await res.json();
      if (data.ok || data.success) {
        setSubmitted(true);
      } else {
        setSubmitError(data.error ?? "Submission failed. Please try again.");
      }
    } catch (err) {
      setSubmitError(String(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ backgroundColor: "rgba(204,255,0,0.12)", border: "2px solid #ccff00" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ccff00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="m9 11 3 3L22 4" />
          </svg>
        </div>
        <h1 className="text-2xl font-black mb-3 sw-title text-center" style={{ color: "var(--text-primary)" }}>
          Appeal Submitted
        </h1>
        <p className="text-sm leading-relaxed mb-2" style={{ color: "var(--text-secondary)" }}>
          Your appeal has been received. All appeals are reviewed manually — typically within 3–5 business days.
        </p>
        <p className="text-xs mb-8" style={{ color: "var(--text-secondary)" }}>
          Check your email for a confirmation with a secure link to add more information later.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black"
          style={{ backgroundColor: "var(--accent)", color: "#fff" }}
        >
          Return Home
        </a>
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div
          className="inline-flex items-center gap-1.5 text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded-full mb-6"
          style={{ backgroundColor: "rgba(160,210,0,0.1)", color: "#ccff00", border: "1px solid rgba(160,210,0,0.25)" }}
        >
          ⚔️ LIGHT SIDE — APPEAL PROCESS
        </div>
        <h1 className="text-4xl sm:text-5xl font-black mb-4 sw-title leading-tight" style={{ color: "var(--text-primary)" }}>
          File an Appeal
        </h1>
        <p className="text-base max-w-xl mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Believe you&apos;ve been incorrectly listed? Present your case to the moderation council.
        </p>
      </div>

      {profileName && (
        <div
          className="rounded-xl p-4 mb-6 flex items-center gap-3"
          style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Appealing profile:
          </div>
          <div className="text-sm font-black" style={{ color: "var(--text-primary)" }}>
            {profileName}
          </div>
        </div>
      )}

      <div
        className="rounded-2xl p-6 mb-6"
        style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        <h2 className="text-sm font-black mb-3" style={{ color: "var(--text-primary)" }}>
          How the appeal process works:
        </h2>
        <ol className="space-y-2 text-xs leading-relaxed list-decimal list-inside" style={{ color: "var(--text-secondary)" }}>
          <li>Submit your appeal with supporting evidence.</li>
          <li>Moderation council reviews your case manually (3–5 business days).</li>
          <li>You&apos;ll receive an email with the outcome and a link to add more info if needed.</li>
        </ol>
      </div>

      {!paymentSatisfied && (
        <div
          className="rounded-2xl p-6 mb-6"
          style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black" style={{ color: "var(--text-primary)" }}>
              Appeal Filing Fee
            </h2>
            <span
              className="text-[10px] font-bold px-2 py-1 rounded"
              style={{ backgroundColor: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.25)" }}
            >
              Non-refundable
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              type="button"
              onClick={() => setPaymentMethod("crypto")}
              className="py-2 rounded-lg text-xs font-black transition-all"
              style={{
                backgroundColor: paymentMethod === "crypto" ? "rgba(204,255,0,0.12)" : "rgba(255,255,255,0.04)",
                border: paymentMethod === "crypto" ? "1.5px solid rgba(204,255,0,0.4)" : "1px solid var(--border)",
                color: paymentMethod === "crypto" ? "#ccff00" : "var(--text-secondary)",
              }}
            >
              Pay with Crypto
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("card")}
              className="py-2 rounded-lg text-xs font-black transition-all"
              style={{
                backgroundColor: paymentMethod === "card" ? "rgba(74,126,255,0.12)" : "rgba(255,255,255,0.04)",
                border: paymentMethod === "card" ? "1.5px solid rgba(74,126,255,0.4)" : "1px solid var(--border)",
                color: paymentMethod === "card" ? "#4a7eff" : "var(--text-secondary)",
              }}
            >
              Pay with Card
            </button>
          </div>

          {paymentError && (
            <div
              className="rounded-lg p-3 text-xs mb-3"
              style={{ backgroundColor: "rgba(204,0,0,0.1)", border: "1px solid rgba(204,0,0,0.25)", color: "#ff6b6b" }}
            >
              {paymentError}
            </div>
          )}

          {paymentMethod === "crypto" ? (
            <div className="space-y-2">
              {!cryptoHostedUrl ? (
                <button
                  type="button"
                  onClick={startCryptoPayment}
                  disabled={paymentStatus === "loading"}
                  className="w-full py-3 rounded-xl text-sm font-black transition-all disabled:opacity-40"
                  style={{ backgroundColor: "rgba(204,255,0,0.12)", border: "1.5px solid rgba(204,255,0,0.4)", color: "#ccff00" }}
                >
                  Continue with Crypto →
                </button>
              ) : (
                <>
                  <a
                    href={cryptoHostedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center w-full py-3 rounded-xl text-sm font-black"
                    style={{ backgroundColor: "rgba(204,255,0,0.12)", border: "1.5px solid rgba(204,255,0,0.4)", color: "#ccff00" }}
                  >
                    Open Coinbase Checkout →
                  </a>
                  <button
                    type="button"
                    onClick={() => cryptoChargeId && checkCryptoPayment(cryptoChargeId)}
                    disabled={paymentStatus === "verifying"}
                    className="w-full py-2 rounded-xl text-xs font-black transition-all disabled:opacity-40"
                    style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
                  >
                    ✓ I&apos;ve paid — Check Payment
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <button
                type="button"
                onClick={startCardPayment}
                disabled={paymentStatus === "loading"}
                className="w-full py-3 rounded-xl text-sm font-black transition-all disabled:opacity-40"
                style={{ backgroundColor: "rgba(74,126,255,0.12)", border: "1.5px solid rgba(74,126,255,0.4)", color: "#4a7eff" }}
              >
                Continue with Card →
              </button>
              <p className="text-[10px] text-center" style={{ color: "var(--text-secondary)" }}>
                Secure card payment via Stripe
              </p>
            </div>
          )}
        </div>
      )}

      {paymentSatisfied ? (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-6"
          style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <h2 className="text-sm font-black mb-5" style={{ color: "var(--text-primary)" }}>
            Your Appeal
          </h2>

          <div className="mb-4">
            <label className="block text-xs font-bold mb-2" style={{ color: "var(--text-secondary)" }}>
              Your Full Name
            </label>
            <input
              type="text"
              value={form.appellant_name}
              onChange={(e) => updateField("appellant_name", e.target.value)}
              placeholder="Your real name"
              className="w-full px-3 py-2.5 rounded-lg text-sm"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold mb-2" style={{ color: "var(--text-secondary)" }}>
              Email Address <span style={{ color: "#ff5050" }}>*</span>
            </label>
            <input
              type="email"
              required
              value={form.appellant_email}
              onChange={(e) => updateField("appellant_email", e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2.5 rounded-lg text-sm"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold mb-2" style={{ color: "var(--text-secondary)" }}>
              Profile URL or Name
            </label>
            <input
              type="text"
              value={form.profile_slug}
              onChange={(e) => updateField("profile_slug", e.target.value)}
              placeholder="https://web3-scam-registry.vercel.app/profile/..."
              className="w-full px-3 py-2.5 rounded-lg text-sm"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold mb-2" style={{ color: "var(--text-secondary)" }}>
              Reason for Appeal <span style={{ color: "#ff5050" }}>*</span>
            </label>
            <textarea
              required
              rows={5}
              value={form.reason}
              onChange={(e) => updateField("reason", e.target.value)}
              placeholder="I believe this report is inaccurate because…"
              className="w-full px-3 py-2.5 rounded-lg text-sm"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold mb-2" style={{ color: "var(--text-secondary)" }}>
              Supporting Evidence
            </label>
            <textarea
              rows={4}
              value={form.evidence}
              onChange={(e) => updateField("evidence", e.target.value)}
              placeholder="Include any links, hashes, or references…"
              className="w-full px-3 py-2.5 rounded-lg text-sm"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
            />
          </div>

          <div
            className="rounded-lg p-3 mb-4 text-xs leading-relaxed"
            style={{ backgroundColor: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.2)", color: "var(--text-secondary)" }}
          >
            <strong style={{ color: "#f59e0b" }}>Legal Notice:</strong> By submitting this appeal, you confirm all information is truthful. Deliberately false appeals may result in legal action.
          </div>

          {submitError && (
            <div
              className="rounded-lg p-3 text-sm mb-4"
              style={{ backgroundColor: "rgba(204,0,0,0.1)", border: "1px solid rgba(204,0,0,0.25)", color: "#ff6b6b" }}
            >
              {submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !form.appellant_email.trim() || !form.reason.trim()}
            className="w-full py-3 rounded-xl text-sm font-black transition-all disabled:opacity-40 flex items-center justify-center gap-2"
            style={{
              backgroundColor: "rgba(204,255,0,0.12)",
              border: "1.5px solid rgba(204,255,0,0.4)",
              color: "#ccff00",
              boxShadow: "0 0 14px rgba(204,255,0,0.2)",
            }}
          >
            {submitting ? "Submitting…" : "⚔️ Submit Appeal to Moderation Council"}
          </button>

          <p className="text-[10px] leading-relaxed mt-4" style={{ color: "var(--text-secondary)" }}>
            To add new information, use the secure link from your original confirmation email instead. This ensures only the original appellant can update the appeal.
          </p>
        </form>
      ) : (
        <div className="flex items-center gap-3 mt-4">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold"
            style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
          >
            Step 2: Fill appeal form (after payment)
          </div>
        </div>
      )}
    </main>
  );
}

export default function AppealPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto px-4 py-20 text-center" style={{ color: "var(--text-secondary)" }}>
          Loading…
        </div>
      }
    >
      <AppealInner />
    </Suspense>
  );
}
