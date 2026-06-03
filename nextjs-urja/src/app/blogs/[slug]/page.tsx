"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, User, Eye, Tag, ArrowRight, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";

interface RelatedPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  category: string;
  publishDate?: string;
  author: string;
}

interface BlogDetail {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  publishDate?: string;
  views: number;
  author: string;
  relatedPosts: RelatedPost[];
}

interface BlogResponse {
  success: boolean;
  data: BlogDetail;
}

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [blog, setBlog] = useState<BlogDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${slug}`);
        const data: BlogResponse = await res.json();
        if (data.success) {
          setBlog(data.data);
        } else {
          setError("Blog post not found.");
        }
      } catch {
        setError("Failed to load blog post.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <>
        <PageHeader
          title="Loading..."
          crumbs={[{ label: "Blog", to: "/blogs" }, { label: "Article" }]}
        />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </>
    );
  }

  if (error || !blog) {
    return (
      <>
        <PageHeader
          title="Article Not Found"
          crumbs={[{ label: "Blog", to: "/blogs" }, { label: "Not Found" }]}
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-lg text-muted-foreground mb-6">
            {error || "The blog post you're looking for doesn't exist."}
          </p>
          <Button asChild>
            <Link href="/blogs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={blog.title}
        crumbs={[{ label: "Blog", to: "/blogs" }, { label: blog.title }]}
      />

      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Image */}
        {blog.featuredImage && (
          <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden mb-8">
            <Image
              src={blog.featuredImage}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-xs">
            {blog.category}
          </span>
          {blog.author && (
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {blog.author}
            </span>
          )}
          {blog.publishDate && (
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(blog.publishDate)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {blog.views} views
          </span>
        </div>

        {/* Tags */}
        {blog.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <Tag className="h-4 w-4 text-muted-foreground" />
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-md bg-accent/60 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Excerpt */}
        <p className="text-lg text-muted-foreground italic border-l-4 border-primary pl-4 mb-8">
          {blog.excerpt}
        </p>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground/80 prose-a:text-primary prose-strong:text-foreground"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Back Link */}
        <div className="mt-12 pt-8 border-t border-border">
          <Button asChild variant="outline">
            <Link href="/blogs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Articles
            </Link>
          </Button>
        </div>
      </article>

      {/* Related Posts */}
      {blog.relatedPosts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 border-t border-border">
          <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blog.relatedPosts.map((post) => (
              <article
                key={post._id}
                className="rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:shadow-soft transition flex flex-col group"
              >
                <div className="relative h-40 w-full overflow-hidden">
                  {post.featuredImage ? (
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-soft flex items-center justify-center">
                      <span className="text-3xl">🦷</span>
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-xs text-primary font-medium mb-2">
                    {post.category}
                  </span>
                  <h3 className="font-bold leading-snug line-clamp-2">
                    <Link
                      href={`/blogs/${post.slug}`}
                      className="hover:text-primary transition"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2 flex-1">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/blogs/${post.slug}`}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
                  >
                    Read more <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
}