import { NextResponse } from "next/server";

// TODO: wire up real Coinbase Commerce charge creation for crypto appeal payments.
// For now, return a mock charge_id so the form flow completes in dev.
export async function POST(request: Request) {
  try {
    await request.json().catch(() => ({}));
    return NextResponse.json({
      charge_id: `mock_${Date.now()}`,
      hosted_url: "https://commerce.coinbase.com/",
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const chargeId = url.searchParams.get("charge_id");
  return NextResponse.json({ paid: true, status: "completed", charge_id: chargeId });
}
