"use client";

import { useState } from "react";
import { Lock, Phone, Check } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { setContactUnlocked } from "@/lib/contactAccess";
import { openSubscriptionCheckout } from "@/lib/razorpay-checkout";
import type { RazorpaySubscriptionResponse } from "@/types/razorpay";

const BENEFITS = [
  "View owner phone numbers on all listings",
  "Contact owners on unlimited properties",
  "Valid for 30 days on this device",
];

export function ContactPaywallModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/razorpay/create-subscription", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Could not start payment");
      }

      await openSubscriptionCheckout(
        data.subscriptionId,
        data.keyId,
        async (response: RazorpaySubscriptionResponse) => {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const verifyData = await verifyRes.json();

          if (!verifyRes.ok || !verifyData.verified) {
            throw new Error(verifyData.error ?? "Payment verification failed");
          }

          setContactUnlocked();
          setLoading(false);
          onSuccess();
        },
        () => setLoading(false)
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Payment failed");
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Unlock owner contact">
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-lg border border-[#e0e0e0] bg-[#fafafa] p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-lg font-bold text-[#222]">₹49 <span className="text-sm font-normal text-[#666]">/ month</span></p>
            <p className="text-xs text-[#888]">Recurring subscription · cancel anytime</p>
          </div>
        </div>

        <ul className="space-y-2 text-sm text-[#555]">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {b}
            </li>
          ))}
        </ul>

        {error && (
          <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <button
          type="button"
          disabled={loading}
          onClick={handleSubscribe}
          className="flex w-full items-center justify-center gap-2 rounded bg-primary py-3 text-sm font-bold uppercase text-white hover:bg-[#004d8c] disabled:opacity-60"
        >
          <Phone className="h-4 w-4" />
          {loading ? "Opening payment…" : "Subscribe ₹49/month"}
        </button>

        <p className="text-center text-[10px] leading-relaxed text-[#999]">
          Secure payment via Razorpay. No account required. Access is stored on this browser for 30 days.
          Cancel anytime via your bank or Razorpay dashboard.
        </p>
      </div>
    </Modal>
  );
}
