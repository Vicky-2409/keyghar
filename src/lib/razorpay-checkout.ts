import type { RazorpaySubscriptionResponse } from "@/types/razorpay";

const SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

let scriptPromise: Promise<void> | null = null;

export function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("Browser only"));
  if (window.Razorpay) return Promise.resolve();

  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${SCRIPT_URL}"]`);
      if (existing) {
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", () => reject(new Error("Razorpay script failed")));
        return;
      }
      const script = document.createElement("script");
      script.src = SCRIPT_URL;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Razorpay script failed"));
      document.body.appendChild(script);
    });
  }

  return scriptPromise;
}

export async function openSubscriptionCheckout(
  subscriptionId: string,
  keyId: string,
  onSuccess: (response: RazorpaySubscriptionResponse) => void,
  onDismiss?: () => void
): Promise<void> {
  await loadRazorpayScript();

  if (!window.Razorpay) {
    throw new Error("Razorpay failed to load");
  }

  const rzp = new window.Razorpay({
    key: keyId,
    subscription_id: subscriptionId,
    name: "KeyGhar",
    description: "Monthly contact access — view owner details",
    theme: { color: "#0065b3" },
    handler: onSuccess,
    modal: { ondismiss: onDismiss },
  });

  rzp.on("payment.failed", (response) => {
    throw new Error(response.error.description || "Payment failed");
  });

  rzp.open();
}
