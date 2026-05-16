import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { BRAND_NAME, SUPPORT_EMAIL, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${BRAND_NAME} collects, uses, and protects your information.`,
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy">
      <p>
        This Privacy Policy explains how {BRAND_NAME} ({SITE_URL}) operated by {BRAND_NAME}{" "}
        in India collects and uses information when you use our rental listing website.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>
          <strong>Browser storage:</strong> Saved properties (shortlist) and contact-pass unlock
          status are stored in your browser&apos;s localStorage on your device. We do not operate
          user accounts.
        </li>
        <li>
          <strong>Payments:</strong> If you subscribe to owner contact access, payment is processed
          by Razorpay. We do not store your card details. Razorpay may collect billing data per
          their policy.
        </li>
        <li>
          <strong>Usage data:</strong> Our hosting provider (Vercel) and analytics tools may log
          standard technical data such as IP address, browser type, and pages visited.
        </li>
        <li>
          <strong>Cookies:</strong> We use cookies and similar technologies for site functionality,
          preferences, and—if you consent—for advertising through Google AdSense.
        </li>
      </ul>

      <h2>How we use information</h2>
      <ul>
        <li>Display listings and enable search across cities in India</li>
        <li>Remember your shortlist and subscription unlock on this device</li>
        <li>Process Razorpay subscriptions for contact access</li>
        <li>Show relevant advertisements (with your consent) via Google AdSense</li>
        <li>Improve site security and performance</li>
      </ul>

      <h2>Advertising (Google AdSense)</h2>
      <p>
        With your consent, we may display ads served by Google AdSense. Google and its partners may
        use cookies to serve ads based on your visits to this and other websites. You can manage ad
        personalization in{" "}
        <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
          Google Ads Settings
        </a>
        . See{" "}
        <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">
          How Google uses data
        </a>
        .
      </p>

      <h2>Listing content</h2>
      <p>
        Property photos and details are submitted by or on behalf of property owners. {BRAND_NAME}{" "}
        displays this information to help renters discover homes. We make reasonable efforts to keep
        listings accurate but do not guarantee completeness.
      </p>

      <h2>Data sharing</h2>
      <p>We may share data with:</p>
      <ul>
        <li>Razorpay (payments)</li>
        <li>Google (advertising, Search Console, AdSense)</li>
        <li>Vercel (hosting)</li>
        <li>Authorities when required by law</li>
      </ul>
      <p>We do not sell your personal information.</p>

      <h2>Your choices</h2>
      <ul>
        <li>Clear browser localStorage to remove shortlist and contact-pass data</li>
        <li>Decline non-essential cookies via our cookie banner</li>
        <li>Cancel Razorpay subscriptions through Razorpay or your bank</li>
      </ul>

      <h2>Contact</h2>
      <p>
        Questions about privacy:{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> or our{" "}
        <Link href="/contact">Contact page</Link>.
      </p>
    </LegalPageLayout>
  );
}
