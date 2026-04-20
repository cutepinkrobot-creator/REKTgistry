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

    const { profile_slug, appellant_name, appellant_email, reason, evidence, payment_method, payment_id } = body;

    if (!profile_slug || !appellant_name || !appellant_email || !reason) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(appellant_email)) {
      return NextResponse.json(
        { ok: false, error: "Invalid email address." },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    const { error } = await supabase.from("appeals").insert({
      profile_slug: profile_slug.trim(),
      appellant_name: appellant_name.trim(),
      appellant_email: appellant_email.trim().toLowerCase(),
      reason: reason.trim(),
      evidence: evidence?.trim() || null,
      payment_method: payment_method || null,
      payment_id: payment_id || null,
      status: "pending",
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("[api/appeal] Supabase error:", error);
      return NextResponse.json(
        { ok: false, error: "Failed to save appeal. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, success: true });
  } catch (err) {
    console.error("[api/appeal]", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 400 });
  }
}
