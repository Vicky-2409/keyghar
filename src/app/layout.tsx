import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { NuqsProvider } from "@/providers/NuqsProvider";
import { ContactAccessProvider } from "@/providers/ContactAccessProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/constants";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${BRAND_NAME} — Rental Homes`,
    template: `%s | ${BRAND_NAME}`,
  },
  description: BRAND_TAGLINE,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={jakarta.variable}>
      <body className="min-h-screen flex flex-col font-sans antialiased pb-16 md:pb-0">
        <ThemeProvider>
          <NuqsProvider>
            <ContactAccessProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <MobileBottomNav />
            </ContactAccessProvider>
          </NuqsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
