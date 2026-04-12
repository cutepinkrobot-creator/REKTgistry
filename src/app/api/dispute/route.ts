import { NextResponse } from "next/server";

// TODO: wire up the real dispute moderation backend.
// For now this just accepts the POST and returns { ok: true } so the form completes.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("[api/dispute] received dispute", body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 400 });
  }
}
