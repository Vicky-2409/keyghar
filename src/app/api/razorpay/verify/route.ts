import { NextResponse } from "next/server";
import { getRazorpayConfig, verifySubscriptionSignature } from "@/lib/razorpay-server";

export async function POST(request: Request) {
  if (!getRazorpayConfig()) {
    return NextResponse.json({ error: "Razorpay is not configured" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const paymentId = body.razorpay_payment_id as string;
    const subscriptionId = body.razorpay_subscription_id as string;
    const signature = body.razorpay_signature as string;

    if (!paymentId || !subscriptionId || !signature) {
      return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
    }

    const valid = verifySubscriptionSignature(paymentId, subscriptionId, signature);
    if (!valid) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    return NextResponse.json({ verified: true });
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
