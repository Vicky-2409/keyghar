import { BadgeCheck, IndianRupee, Headphones, Home } from "lucide-react";
import { BRAND_NAME } from "@/lib/constants";

const TRUST_ITEMS = [
  {
    icon: IndianRupee,
    title: "Zero brokerage",
    description: "Connect directly with property owners on select listings — no middlemen.",
  },
  {
    icon: BadgeCheck,
    title: "Verified listings",
    description: "Real photos, accurate BHK & rent details across top Indian cities.",
  },
  {
    icon: Home,
    title: "Every home type",
    description: "Apartments, independent houses, villas & PG — filter by budget and furnishing.",
  },
  {
    icon: Headphones,
    title: "Owner contact pass",
    description: "Unlock phone numbers instantly with a simple monthly pass on this device.",
  },
];

export function TrustSection() {
  return (
    <section className="border-b border-[#dde3eb] bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-[#1a1a2e]">
            Why renters choose {BRAND_NAME}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-[#5c6578]">
            A modern rental experience inspired by India&apos;s best property platforms — simple search,
            transparent pricing, direct owner connect.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_ITEMS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-[#dde3eb] bg-[#f4f6f8]/50 p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 font-bold text-[#1a1a2e]">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5c6578]">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
