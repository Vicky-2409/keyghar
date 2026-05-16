import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_POSTS, getBlogPost } from "@/data/blogPosts";
import { AdUnit } from "@/components/ads/AdUnit";
import { BRAND_NAME } from "@/lib/constants";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Guide not found" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const paragraphs = post.content.trim().split(/\n\n+/);

  return (
    <div className="bg-[#f4f6f8] min-h-screen">
      <div className="border-b border-[#dde3eb] bg-white">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <nav className="text-xs text-[#888]">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span className="mx-1">/</span>
            <Link href="/blog" className="hover:text-primary">
              Guides
            </Link>
            <span className="mx-1">/</span>
            <span className="text-[#333] line-clamp-1">{post.title}</span>
          </nav>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-[#1a1a2e]">{post.title}</h1>
          <p className="mt-3 text-sm text-[#888]">
            {new Date(post.publishedAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            · {post.readMinutes} min read · {BRAND_NAME}
          </p>
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="rounded-xl border border-[#dde3eb] bg-white p-6 sm:p-8">
          <p className="text-lg leading-relaxed text-[#5c6578]">{post.excerpt}</p>
          <AdUnit slot="blog-top" format="horizontal" className="my-8" />
          <div className="mt-6 space-y-4 text-[#444] leading-relaxed">
            {paragraphs.map((para, i) => (
              <p key={i}>{para.trim()}</p>
            ))}
          </div>
          <AdUnit slot="blog-bottom" format="rectangle" className="mt-8" />
        </div>
        <p className="mt-8 text-center">
          <Link href="/search" className="font-semibold text-primary hover:underline">
            Browse rental listings →
          </Link>
        </p>
      </article>
    </div>
  );
}
