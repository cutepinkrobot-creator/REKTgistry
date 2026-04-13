import { NextResponse } from "next/server";

// Appeal filing fee: $5.00 USD
const APPEAL_FEE_CENTS = 500;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    // If Stripe is configured, create a real PaymentIntent
    if (process.env.STRIPE_SECRET_KEY) {
      try {
        const stripe = (await import("stripe")).default;
        const client = new stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-03-25.dahlia" as const });
        const intent = await client.paymentIntents.create({
          amount: APPEAL_FEE_CENTS,
          currency: "usd",
          metadata: {
            profile_slug: String((body as Record<string, unknown>).profile_slug ?? ""),
            type: "appeal_filing_fee",
          },
        });
        return NextResponse.json({
          success: true,
          payment_intent_id: intent.id,
          client_secret: intent.client_secret,
          amount_cents: APPEAL_FEE_CENTS,
        });
      } catch (stripeErr) {
        console.error("[appeal-payment] Stripe error:", stripeErr);
      }
    }

    // Dev mode — unlock for free so the form can be tested
    return NextResponse.json({ success: true, free: true, amount_cents: APPEAL_FEE_CENTS });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 400 });
  }
}
