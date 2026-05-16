import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "@/data/blogPosts";
import { BRAND_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Rental Guides",
  description: `Expert rental tips and city guides from ${BRAND_NAME}.`,
};

export default function BlogIndexPage() {
  return (
    <div className="bg-[#f4f6f8] min-h-screen">
      <div className="border-b border-[#dde3eb] bg-white">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
          <h1 className="text-3xl font-extrabold text-[#1a1a2e]">Rental guides</h1>
          <p className="mt-2 text-[#5c6578]">
            Practical advice for renters in India — budgets, documents, and city-specific tips from{" "}
            {BRAND_NAME}.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <ul className="space-y-6">
          {BLOG_POSTS.map((post) => (
            <li key={post.slug}>
              <article className="rounded-xl border border-[#dde3eb] bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#888]">
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <span>·</span>
                  <span>{post.readMinutes} min read</span>
                  {post.city && (
                    <>
                      <span>·</span>
                      <span>{post.city}</span>
                    </>
                  )}
                </div>
                <h2 className="mt-2 text-xl font-bold text-[#1a1a2e]">
                  <Link href={`/blog/${post.slug}`} className="hover:text-primary">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[#5c6578]">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
                >
                  Read guide →
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
