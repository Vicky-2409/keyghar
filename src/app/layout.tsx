import type { Metadata } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { NuqsProvider } from "@/providers/NuqsProvider";
import { ContactAccessProvider } from "@/providers/ContactAccessProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { BRAND_NAME, BRAND_TAGLINE, SITE_URL } from "@/lib/constants";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { AdSenseScript } from "@/components/ads/AdSenseScript";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export const metadata: Metadata = {
  title: {
    default: `${BRAND_NAME} — Rental Homes`,
    template: `%s | ${BRAND_NAME}`,
  },
  description: BRAND_TAGLINE,
  metadataBase: new URL(SITE_URL),
  ...(googleVerification
    ? { verification: { google: googleVerification } }
    : {}),
  ...(adsenseClient
    ? { other: { "google-adsense-account": adsenseClient } }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={jakarta.variable}>
      <body className="min-h-screen flex flex-col font-sans antialiased pb-16 md:pb-0">
        {adsenseClient && (
          <Script
            id="adsense-init"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
        <ThemeProvider>
          <NuqsProvider>
            <ContactAccessProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <MobileBottomNav />
              <CookieConsent />
            </ContactAccessProvider>
          </NuqsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
