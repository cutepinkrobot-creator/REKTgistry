import { NextResponse } from "next/server";

// TODO: wire up real Stripe PaymentIntent creation for the appeal filing fee.
// For now, return { success: true, free: true } so the appeal form unlocks in dev.
export async function POST(request: Request) {
  try {
    await request.json().catch(() => ({}));
    return NextResponse.json({ success: true, free: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 400 });
  }
}
