import { BLOG_POSTS, type BlogPost } from "@/data/blogPosts";
import generated from "@/data/blogPosts.generated.json";

const generatedPosts = generated as BlogPost[];

const bySlug = new Map<string, BlogPost>();
for (const p of [...generatedPosts, ...BLOG_POSTS]) {
  bySlug.set(p.slug, p);
}

export const ALL_BLOG_POSTS: BlogPost[] = [...bySlug.values()].sort(
  (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
);

export function getBlogPost(slug: string): BlogPost | undefined {
  return bySlug.get(slug);
}
