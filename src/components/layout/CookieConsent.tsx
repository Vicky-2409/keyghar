"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCookieConsent, setCookieConsent } from "@/lib/cookieConsent";
import { BRAND_NAME } from "@/lib/constants";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getCookieConsent() === null);
    const onUpdate = () => setVisible(getCookieConsent() === null);
    window.addEventListener("cookie-consent-updated", onUpdate);
    return () => window.removeEventListener("cookie-consent-updated", onUpdate);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-16 left-0 right-0 z-[60] border-t border-[#dde3eb] bg-white p-4 shadow-lg md:bottom-0"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-[#555]">
          {BRAND_NAME} uses cookies for site features and, if you accept, personalised ads via Google
          AdSense. See our{" "}
          <Link href="/privacy" className="font-semibold text-primary underline">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => {
              setCookieConsent("declined");
              setVisible(false);
            }}
            className="rounded-md border border-[#dde3eb] px-4 py-2 text-sm font-semibold text-[#555] hover:bg-[#f4f6f8]"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => {
              setCookieConsent("accepted");
              setVisible(false);
            }}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-[#004d8c]"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
