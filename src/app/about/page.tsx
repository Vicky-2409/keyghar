import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import {
  BRAND_NAME,
  BRAND_TAGLINE,
  BRAND_STATS,
  CITIES,
  OPERATOR_NAME,
  BUSINESS_LOCATION,
  SUPPORT_EMAIL,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${BRAND_NAME} — India's rental listing platform for flats, houses and PG.`,
};

export default function AboutPage() {
  return (
    <LegalPageLayout title="About KeyGhar">
      <p className="text-lg text-[#333]">{BRAND_TAGLINE}</p>

      <h2>Our mission</h2>
      <p>
        {BRAND_NAME} helps renters across India discover rental homes without unnecessary
        middlemen. We focus on clarity—real photos, transparent rent, locality context, and direct
        ways to reach property owners when you are ready to take the next step.
      </p>
      <p>
        Whether you are looking for a 1 BHK near IT corridors in Bangalore, a family flat in Chennai,
        or a PG in Pune, {BRAND_NAME} brings search, filters, and shortlisting into one simple
        experience on web and mobile browsers.
      </p>

      <h2>How it works</h2>
      <ul>
        <li>Browse thousands of listings across {BRAND_STATS.cities} major cities</li>
        <li>Filter by budget, BHK, furnishing, PG, and amenities</li>
        <li>Save homes to your shortlist (stored on your device)</li>
        <li>
          Subscribe to a monthly contact pass to unlock owner phone numbers on unlimited listings
        </li>
      </ul>

      <h2>Cities we cover</h2>
      <p>
        We currently feature rentals in {CITIES.join(", ")} with more localities added over time.
        Use our <Link href="/search">search</Link> or city guides in our{" "}
        <Link href="/blog">rental guides</Link>.
      </p>

      <h2>Who runs {BRAND_NAME}</h2>
      <p>
        {BRAND_NAME} is operated by {OPERATOR_NAME}, an individual entrepreneur based in{" "}
        {BUSINESS_LOCATION}. We are building a transparent rental discovery platform for Indian
        renters and property owners.
      </p>

      <h2>Monetization</h2>
      <p>
        {BRAND_NAME} is supported by optional paid subscriptions for owner contact access (processed
        via Razorpay) and by display advertising through Google AdSense. Listing browse and search
        remain free.
      </p>

      <h2>Contact</h2>
      <p>
        Questions, feedback, or listing concerns:{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. Visit our{" "}
        <Link href="/contact">Contact page</Link> for more options.
      </p>
    </LegalPageLayout>
  );
}
