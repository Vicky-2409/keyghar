import Link from "next/link";
import seoPages from "@/data/seoPages.json";
import { BRAND_NAME, BRAND_TAGLINE, BRAND_STATS } from "@/lib/constants";
import { BrandLogo } from "@/components/layout/BrandLogo";

export function Footer() {
  const links = (seoPages as string[]).slice(0, 8);

  return (
    <footer className="mt-auto border-t border-[#dde3eb] bg-[#1a1a2e] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <BrandLogo variant="dark" />
            <p className="mt-4 text-sm leading-relaxed text-white/70">{BRAND_TAGLINE}</p>
            <p className="mt-3 text-xs text-white/50">
              {BRAND_STATS.listings} listings across {BRAND_STATS.cities} major cities · Direct owner connect
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white/90">Popular searches</h3>
            <ul className="mt-4 space-y-2">
              {links.map((slug) => (
                <li key={slug}>
                  <Link
                    href={`/${slug}`}
                    className="text-sm text-white/60 capitalize transition-colors hover:text-white"
                  >
                    {slug.replace(/-/g, " ")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white/90">Top cities</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/60">
              {["Chennai", "Pune", "Bangalore", "Mumbai", "Hyderabad"].map((city) => (
                <li key={city}>
                  <Link href={`/search?city=${city}`} className="hover:text-white">
                    Rentals in {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white/90">Why {BRAND_NAME}</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/60">
              <li>Zero brokerage on owner listings</li>
              <li>Verified photos & details</li>
              <li>Instant owner contact pass</li>
              <li>Flats, houses & PG in one place</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-white/50">
            <Link href="/search" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/search" className="hover:text-white">
              Terms
            </Link>
            <Link href="/search" className="hover:text-white">
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
