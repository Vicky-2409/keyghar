import Link from "next/link";
import { BRAND_NAME } from "@/lib/constants";

export function LegalPageLayout({
  title,
  children,
  updated = "May 2026",
}: {
  title: string;
  children: React.ReactNode;
  updated?: string;
}) {
  return (
    <div className="bg-[#f4f6f8] min-h-screen">
      <div className="border-b border-[#dde3eb] bg-white">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <nav className="text-xs text-[#888]">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span className="mx-1">/</span>
            <span className="text-[#333]">{title}</span>
          </nav>
          <h1 className="mt-3 text-3xl font-extrabold text-[#1a1a2e]">{title}</h1>
          <p className="mt-2 text-sm text-[#888]">
            {BRAND_NAME} · Last updated {updated}
          </p>
        </div>
      </div>
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="rounded-xl border border-[#dde3eb] bg-white p-6 sm:p-8 text-[#444] leading-relaxed [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-[#1a1a2e] [&_h3]:mt-6 [&_h3]:font-semibold [&_h3]:text-[#333] [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1 [&_a]:text-primary [&_a]:underline">
          {children}
        </div>
      </article>
    </div>
  );
}
