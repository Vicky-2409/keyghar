import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { BRAND_NAME, SUPPORT_EMAIL, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms and conditions for using ${BRAND_NAME}.`,
};

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Service">
      <p>
        By using {BRAND_NAME} at {SITE_URL}, you agree to these Terms of Service. If you do not
        agree, please do not use the site.
      </p>

      <h2>Service description</h2>
      <p>
        {BRAND_NAME} is an online platform that helps renters browse rental listings for apartments,
        houses, and PG accommodations in select Indian cities. Some features require a paid
        subscription to view owner contact details.
      </p>

      <h2>Subscriptions and payments</h2>
      <ul>
        <li>
          Owner contact access is offered as a recurring subscription (currently ₹49/month) billed
          through Razorpay.
        </li>
        <li>Access is tied to your browser/device via local storage for approximately 30 days after
          a successful payment until renewal or expiry.</li>
        <li>Refunds and cancellations are handled per Razorpay and applicable payment network
          rules. Contact us at {SUPPORT_EMAIL} for support requests.</li>
        <li>We do not guarantee that every listing will result in a successful rental or owner
          response.</li>
      </ul>

      <h2>Listings and accuracy</h2>
      <p>
        Listings, prices, availability, and photos are provided by property owners or their
        representatives. {BRAND_NAME} does not own the properties listed. We strive for accuracy but
        do not warrant that every detail is current. Renters should verify information independently
        before paying deposits or signing agreements.
      </p>

      <h2>Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Scrape, copy, or redistribute site content without permission</li>
        <li>Misuse owner contact information for spam or harassment</li>
        <li>Attempt to bypass paywalls or security measures</li>
        <li>Post false or misleading rental information</li>
        <li>Click advertisements fraudulently or encourage others to do so</li>
      </ul>

      <h2>Advertising</h2>
      <p>
        The site may display third-party advertisements (e.g. Google AdSense). Ad content is provided
        by advertisers; we are not responsible for products or services advertised.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The {BRAND_NAME} brand, layout, and original content are protected. Listing photos and text
        may belong to owners or licensors. Unauthorized use may violate copyright law.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        {BRAND_NAME} is provided &quot;as is.&quot; We are not liable for disputes between renters
        and owners, property condition, financial loss, or indirect damages arising from use of the
        platform.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms. Continued use after changes constitutes acceptance. Material
        changes will be reflected on this page with an updated date.
      </p>

      <h2>Contact</h2>
      <p>
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> ·{" "}
        <Link href="/contact">Contact form</Link>
      </p>
    </LegalPageLayout>
  );
}
