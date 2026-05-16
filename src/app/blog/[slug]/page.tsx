import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ALL_BLOG_POSTS, getBlogPost } from "@/lib/blogPostsAll";
import { AdUnit } from "@/components/ads/AdUnit";
import { RelatedLinks } from "@/components/seo/RelatedLinks";
import { JsonLd } from "@/components/seo/JsonLd";
import { BRAND_NAME, SITE_URL } from "@/lib/constants";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ALL_BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Guide not found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `${SITE_URL}/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${slug}`,
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const paragraphs = post.content.trim().split(/\n\n+/);

  const defaultLinks = [
    {
      href: `/search?city=${encodeURIComponent(post.city ?? "Chennai")}`,
      label: `Search rentals${post.city ? ` in ${post.city}` : ""}`,
    },
    { href: "/blog", label: "All rental guides" },
  ];

  const relatedLinks = post.relatedLinks?.length ? post.relatedLinks : defaultLinks;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: BRAND_NAME },
    publisher: { "@type": "Organization", name: BRAND_NAME, url: SITE_URL },
  };

  return (
    <div className="bg-[#f4f6f8] min-h-screen">
      <JsonLd data={articleJsonLd} />
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
          <RelatedLinks links={relatedLinks} />
          <AdUnit slot="blog-bottom" format="rectangle" className="mt-8" />
        </div>
      </article>
    </div>
  );
}
