import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ── Rate limiting (in-memory, resets on cold start) ─────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;               // max comments per IP
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

// ── Supabase admin client ──────────────────────────────────────────────────
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

// ── GET /api/comments?profile_id=<uuid> ───────────────────────────────────
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const profile_id = searchParams.get("profile_id");

    if (!profile_id) {
      return NextResponse.json(
        { ok: false, error: "profile_id is required" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("comments")
      .select("id, profile_id, content, nickname, created_at")
      .eq("profile_id", profile_id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("[api/comments GET] Supabase error:", error);
      return NextResponse.json({ ok: false, error: "Failed to fetch comments" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, comments: data ?? [] });
  } catch (err) {
    console.error("[api/comments GET]", err);
    return NextResponse.json({ ok: false, error: "Failed to fetch comments" }, { status: 500 });
  }
}

// ── POST /api/comments ────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    // ── Get IP for rate limiting ─────────────────────────────────────────
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

    const body = await request.json() as {
      profile_id?: string;
      content?: string;
      nickname?: string;
      website?: string;
    };

    // ── Honeypot: silently succeed ───────────────────────────────────────
    if (body.website) {
      return NextResponse.json({ ok: true, success: true });
    }

    // ── Rate limit ───────────────────────────────────────────────────────
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { ok: false, error: "Too many comments. Please wait before posting again." },
        { status: 429 }
      );
    }

    // ── Validate ─────────────────────────────────────────────────────────
    const { profile_id, content, nickname } = body;

    if (!profile_id) {
      return NextResponse.json({ ok: false, error: "profile_id is required" }, { status: 400 });
    }

    if (!content || typeof content !== "string") {
      return NextResponse.json({ ok: false, error: "content is required" }, { status: 400 });
    }

    const trimmed = content.trim();
    if (trimmed.length < 10) {
      return NextResponse.json({ ok: false, error: "Comment must be at least 10 characters." }, { status: 400 });
    }
    if (trimmed.length > 500) {
      return NextResponse.json({ ok: false, error: "Comment must be 500 characters or fewer." }, { status: 400 });
    }

    // ── Simple IP hash (non-reversible) ──────────────────────────────────
    const encoder = new TextEncoder();
    const data = encoder.encode(ip + process.env.NEXT_PUBLIC_SUPABASE_URL);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const ip_hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);

    // ── Insert into Supabase ──────────────────────────────────────────────
    const supabase = getSupabase();
    const { error } = await supabase.from("comments").insert({
      profile_id,
      content: trimmed,
      nickname: nickname?.trim() || null,
      ip_hash,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("[api/comments POST] Supabase error:", error);
      return NextResponse.json({ ok: false, error: "Failed to save comment." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, success: true });
  } catch (err) {
    console.error("[api/comments POST]", err);
    return NextResponse.json({ ok: false, error: "Submission failed. Please try again." }, { status: 400 });
  }
}
