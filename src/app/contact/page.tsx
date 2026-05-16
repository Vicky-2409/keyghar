import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Clock } from "lucide-react";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { BRAND_NAME, SUPPORT_EMAIL, BUSINESS_LOCATION } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with the ${BRAND_NAME} team.`,
};

export default function ContactPage() {
  return (
    <LegalPageLayout title="Contact Us">
      <p>
        We&apos;re here to help with listing questions, subscription support, privacy requests, and
        general feedback about {BRAND_NAME}.
      </p>

      <div className="mt-6 space-y-4 not-prose">
        <div className="flex gap-4 rounded-lg border border-[#dde3eb] bg-[#f4f6f8]/50 p-4">
          <Mail className="h-6 w-6 shrink-0 text-primary" />
          <div>
            <p className="font-semibold text-[#1a1a2e]">Email</p>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">
              {SUPPORT_EMAIL}
            </a>
            <p className="mt-1 text-sm text-[#888]">We aim to reply within 2–3 business days.</p>
          </div>
        </div>

        <div className="flex gap-4 rounded-lg border border-[#dde3eb] bg-[#f4f6f8]/50 p-4">
          <MapPin className="h-6 w-6 shrink-0 text-primary" />
          <div>
            <p className="font-semibold text-[#1a1a2e]">Location</p>
            <p className="text-sm text-[#555]">{BUSINESS_LOCATION}</p>
          </div>
        </div>

        <div className="flex gap-4 rounded-lg border border-[#dde3eb] bg-[#f4f6f8]/50 p-4">
          <Clock className="h-6 w-6 shrink-0 text-primary" />
          <div>
            <p className="font-semibold text-[#1a1a2e]">Support hours</p>
            <p className="text-sm text-[#555]">Monday – Saturday, 10:00 AM – 6:00 PM IST</p>
          </div>
        </div>
      </div>

      <h2>Common topics</h2>
      <ul>
        <li>
          <strong>Contact pass / Razorpay:</strong> Subscription billing and cancellations are
          managed through Razorpay. Email us with your payment reference if you need help.
        </li>
        <li>
          <strong>Listing accuracy:</strong> Report incorrect photos or rent details with the
          property link.
        </li>
        <li>
          <strong>Privacy:</strong> See our <Link href="/privacy">Privacy Policy</Link>.
        </li>
      </ul>
    </LegalPageLayout>
  );
}
