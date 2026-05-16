import { NextResponse } from "next/server";
import { getRazorpayConfig, razorpayFetch } from "@/lib/razorpay-server";

type SubscriptionResponse = {
  id: string;
  status: string;
};

export async function POST() {
  const config = getRazorpayConfig();
  if (!config) {
    return NextResponse.json(
      { error: "Razorpay is not configured. Add keys to .env.local" },
      { status: 503 }
    );
  }

  try {
    const subscription = await razorpayFetch<SubscriptionResponse>("/subscriptions", {
      method: "POST",
      body: JSON.stringify({
        plan_id: config.planId,
        total_count: 120,
        customer_notify: 1,
        quantity: 1,
      }),
    });

    return NextResponse.json({
      keyId: config.keyId,
      subscriptionId: subscription.id,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create subscription";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
