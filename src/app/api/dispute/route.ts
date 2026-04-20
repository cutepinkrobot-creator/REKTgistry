import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { profile_url, your_name, your_email, reason, evidence } = body;

    if (!profile_url || !your_name || !your_email || !reason) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(your_email)) {
      return NextResponse.json(
        { ok: false, error: "Invalid email address." },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    const { error } = await supabase.from("disputes").insert({
      profile_url: profile_url.trim(),
      your_name: your_name.trim(),
      your_email: your_email.trim().toLowerCase(),
      reason: reason.trim(),
      evidence: evidence?.trim() || null,
      status: "pending",
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("[api/dispute] Supabase error:", error);
      return NextResponse.json(
        { ok: false, error: "Failed to save dispute. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/dispute]", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 400 });
  }
}
