import Link from "next/link";
import type { BlogPostLink } from "@/data/blogPosts";

export function RelatedLinks({ links, title = "Explore listings" }: { links: BlogPostLink[]; title?: string }) {
  if (!links.length) return null;

  return (
    <nav className="mt-8 rounded-lg border border-[#dde3eb] bg-[#f4f6f8]/60 p-5" aria-label={title}>
      <h2 className="text-sm font-bold uppercase tracking-wide text-[#1a1a2e]">{title}</h2>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm font-medium text-primary hover:underline">
              {link.label} →
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
