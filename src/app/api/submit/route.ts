import { NextResponse } from "next/server";

// TODO: wire up the real submission backend (database, evidence uploads, moderation queue).
// For now this just accepts the POST and returns { ok: true } so the form completes.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("[api/submit] received report", body);
    return NextResponse.json({ ok: true, success: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 400 });
  }
}
