import { NextResponse } from "next/server";

/**
 * Stripe Checkout for the "Feature a Profile" promote page.
 *
 * Setup:
 *   1. Run: npm install stripe
 *   2. Add STRIPE_SECRET_KEY=sk_test_... to .env.local
 *   3. (Optional) Add NEXT_PUBLIC_SITE_URL=http://localhost:3000 to .env.local
 *
 * The `stripe` package is imported dynamically so the build doesn't fail if it
 * isn't installed yet — the handler will just return a clear error instead.
 */

type Tier = "24h" | "48h" | "72h";

interface StripeClient {
  checkout: {
    sessions: {
      create: (params: Record<string, unknown>) => Promise<{ url: string | null }>;
    };
  };
}

const TIER_PRICES: Record<Tier, { amount: number; label: string }> = {
  "24h": { amount: 1000, label: "Featured Hall of Shame — 24 Hours" },
  "48h": { amount: 1500, label: "Featured Hall of Shame — 48 Hours" },
  "72h": { amount: 2000, label: "Featured Hall of Shame — 72 Hours" },
};

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Stripe not configured. Set STRIPE_SECRET_KEY in .env.local" },
      { status: 500 }
    );
  }

  let body: { profile_id?: string; tier?: Tier };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { profile_id, tier } = body;
  if (!profile_id || !tier || !(tier in TIER_PRICES)) {
    return NextResponse.json({ error: "Missing profile_id or invalid tier" }, { status: 400 });
  }

  try {
    // Dynamic import so build doesn't fail if `stripe` isn't installed yet.
    // Using a non-literal specifier so TypeScript doesn't try to resolve the module at compile time.
    const stripeSpecifier = "stripe";
    const stripeModule: { default: new (key: string) => StripeClient } | null = await import(
      /* webpackIgnore: true */ stripeSpecifier
    ).catch(() => null);
    if (!stripeModule) {
      return NextResponse.json(
        { error: "Stripe package not installed. Run: npm install stripe" },
        { status: 500 }
      );
    }
    const Stripe = stripeModule.default;
    const stripe = new Stripe(secretKey);

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ??
      new URL(request.url).origin ??
      "http://localhost:3000";

    const tierInfo = TIER_PRICES[tier];

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: tierInfo.label,
              description: `Feature profile ${profile_id} in the Hall of Shame`,
            },
            unit_amount: tierInfo.amount,
          },
          quantity: 1,
        },
      ],
      metadata: { profile_id, tier },
      success_url: `${siteUrl}/promote?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/promote?status=cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
