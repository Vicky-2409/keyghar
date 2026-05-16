"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { hasAdConsent } from "@/lib/cookieConsent";

const CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const SLOT_MAP: Record<string, string | undefined> = {
  "search-mid": process.env.NEXT_PUBLIC_ADSENSE_SLOT_SEARCH,
  "property-mid": process.env.NEXT_PUBLIC_ADSENSE_SLOT_PROPERTY,
  "blog-top": process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG_TOP,
  "blog-bottom": process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG_BOTTOM,
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdUnit({
  slot,
  format = "auto",
  className,
}: {
  slot: keyof typeof SLOT_MAP | string;
  format?: "auto" | "horizontal" | "rectangle";
  className?: string;
}) {
  const pushed = useRef(false);
  const adSlot = SLOT_MAP[slot] ?? process.env.NEXT_PUBLIC_ADSENSE_SLOT_DEFAULT;
  const show = CLIENT_ID && adSlot && hasAdConsent();

  useEffect(() => {
    if (!show || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* ignore if script not ready */
    }
  }, [show]);

  useEffect(() => {
    const onConsent = () => {
      if (hasAdConsent() && !pushed.current) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          pushed.current = true;
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener("cookie-consent-updated", onConsent);
    return () => window.removeEventListener("cookie-consent-updated", onConsent);
  }, []);

  if (!show) {
    if (!CLIENT_ID) return null;
    return null;
  }

  return (
    <div className={cn("overflow-hidden text-center", className)}>
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
