"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { hasAdConsent } from "@/lib/cookieConsent";

const CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export function AdSenseScript() {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const check = () => setLoad(hasAdConsent());
    check();
    window.addEventListener("cookie-consent-updated", check);
    return () => window.removeEventListener("cookie-consent-updated", check);
  }, []);

  if (!CLIENT_ID || !load) return null;

  return (
    <Script
      id="adsense-init"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
