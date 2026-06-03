import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    const blog = await prisma.blogPost.findUnique({
      where: { slug, status: "published" },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        excerpt: true,
        featuredImage: true,
        category: true,
        tags: true,
        publishDate: true,
        views: true,
        author: { select: { name: true } },
      },
    });

    if (!blog) {
      return errorResponse("Blog not found", 404);
    }

    // Increment views
    await prisma.blogPost.update({
      where: { id: blog.id },
      data: { views: { increment: 1 } },
    });

    // Get related posts (same category, excluding current)
    const relatedPosts = await prisma.blogPost.findMany({
      where: {
        status: "published",
        category: blog.category,
        id: { not: blog.id },
      },
      take: 3,
      orderBy: { publishDate: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        category: true,
        publishDate: true,
        author: { select: { name: true } },
      },
    });

    return successResponse({
      _id: blog.id,
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      excerpt: blog.excerpt,
      featuredImage: blog.featuredImage,
      category: blog.category,
      tags: blog.tags,
      publishDate: blog.publishDate?.toISOString() || null,
      views: blog.views + 1,
      author: blog.author?.name || "",
      relatedPosts: relatedPosts.map((r) => ({
        _id: r.id,
        title: r.title,
        slug: r.slug,
        excerpt: r.excerpt,
        featuredImage: r.featuredImage,
        category: r.category,
        publishDate: r.publishDate?.toISOString() || null,
        author: r.author?.name || "",
      })),
    });
  } catch (error) {
    console.error("Get blog by slug error:", error);
    return errorResponse("An error occurred", 500);
  }
}