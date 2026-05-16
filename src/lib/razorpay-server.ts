import crypto from "crypto";

export function getRazorpayConfig() {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const planId = process.env.RAZORPAY_PLAN_ID;

  if (!keyId || !keySecret || !planId) {
    return null;
  }

  return { keyId, keySecret, planId };
}

export async function razorpayFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const config = getRazorpayConfig();
  if (!config) throw new Error("Razorpay is not configured");

  const auth = Buffer.from(`${config.keyId}:${config.keySecret}`).toString("base64");
  const res = await fetch(`https://api.razorpay.com/v1${path}`, {
    ...options,
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    const err = data as { error?: { description?: string } };
    throw new Error(err.error?.description ?? "Razorpay request failed");
  }
  return data as T;
}

export function verifySubscriptionSignature(
  paymentId: string,
  subscriptionId: string,
  signature: string
): boolean {
  const config = getRazorpayConfig();
  if (!config) return false;

  const body = `${paymentId}|${subscriptionId}`;
  const expected = crypto
    .createHmac("sha256", config.keySecret)
    .update(body)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}
