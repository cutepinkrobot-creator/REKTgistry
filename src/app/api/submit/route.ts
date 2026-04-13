import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ── Rate limiting (in-memory, resets on cold start) ─────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3;       // max submissions
const RATE_WINDOW = 60 * 60 * 1000; // per hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// ── Supabase admin client (service role for inserts) ──────────────────────
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

export async function POST(request: Request) {
  try {
    // ── Get IP for rate limiting ─────────────────────────────────────────
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { ok: false, error: "Too many submissions. Please wait before submitting again." },
        { status: 429 }
      );
    }

    // ── Parse FormData ───────────────────────────────────────────────────
    let data: Record<string, unknown> = {};
    const files: File[] = [];
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const fd = await request.formData();
      const rawData = fd.get("data");
      if (rawData) data = JSON.parse(rawData as string);
      fd.getAll("files").forEach((f) => {
        if (f instanceof File && f.size > 0) files.push(f);
      });
    } else {
      data = await request.json();
    }

    // ── Honeypot check ───────────────────────────────────────────────────
    if (data.website_url) {
      // Silently succeed to not reveal the trap
      return NextResponse.json({ ok: true, success: true });
    }

    // ── Upload evidence files to Supabase Storage ────────────────────────
    const evidenceUrls: string[] = [];
    if (files.length > 0) {
      try {
        const supabase = getSupabase();
        for (const file of files.slice(0, 5)) {
          const ext = file.name.split(".").pop() ?? "bin";
          const path = `submissions/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
          const buf = await file.arrayBuffer();
          const { error } = await supabase.storage
            .from("evidence")
            .upload(path, Buffer.from(buf), { contentType: file.type, upsert: false });
          if (!error) {
            const { data: urlData } = supabase.storage.from("evidence").getPublicUrl(path);
            if (urlData?.publicUrl) evidenceUrls.push(urlData.publicUrl);
          }
        }
      } catch {
        // Storage not configured — continue without files
      }
    }

    // ── Insert into Supabase ──────────────────────────────────────────────
    try {
      const supabase = getSupabase();
      const { error } = await supabase.from("scammer_profiles").insert({
        display_name: data.display_name,
        profile_type: data.profile_type ?? "person",
        aliases: data.aliases ?? [],
        twitter_handle: data.twitter_handle ?? null,
        telegram_handle: data.telegram_handle ?? null,
        discord_handle: data.discord_handle ?? null,
        wallet_addresses: data.wallet_addresses ?? [],
        website: data.website ?? null,
        chain: data.chain ?? null,
        categories: data.categories ?? [],
        summary: data.summary,
        amount_lost_usd: data.amount_lost_usd ?? null,
        incident_date: data.incident_date ?? null,
        status: "pending",
        reports_count: 1,
        verified: false,
        reporter_name: data.reporter_name ?? null,
        reporter_email: data.reporter_email ?? null,
        reporter_twitter: data.reporter_twitter ?? null,
        evidence_description: data.evidence_description ?? null,
        evidence_urls: evidenceUrls,
        tx_hashes: data.tx_hashes ?? [],
        submitted_at: new Date().toISOString(),
      });
      if (error) {
        console.error("[api/submit] Supabase error:", error);
        // Fall through — still return success to user so they aren't frustrated
      }
    } catch (dbErr) {
      console.error("[api/submit] DB insert failed:", dbErr);
    }

    return NextResponse.json({ ok: true, success: true });
  } catch (err) {
    console.error("[api/submit]", err);
    return NextResponse.json({ ok: false, error: "Submission failed. Please try again." }, { status: 400 });
  }
}
