import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth, successResponse, paginatedResponse, errorResponse,
  getPaginationParams, getSearchParams, parseJsonBody, applyRateLimit,
} from "@/lib/api-helpers";
import { createBlogSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const limited = await applyRateLimit(request, { preset: "adminRead", namespace: "admin:blogs:list" });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { searchParams } = request.nextUrl;
    const { page, limit, skip } = getPaginationParams(searchParams);
    const { search, status } = getSearchParams(searchParams);
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (search) where.title = { contains: search, mode: "insensitive" };
    const [items, total] = await Promise.all([
      prisma.blogPost.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" }, include: { author: { select: { name: true } } } }),
      prisma.blogPost.count({ where }),
    ]);
    return paginatedResponse(items.map((b) => ({
      _id: b.id, title: b.title, slug: b.slug, content: b.content, excerpt: b.excerpt,
      featuredImage: b.featuredImage, category: b.category, tags: b.tags,
      author: b.author?.name || "", authorId: b.authorId,
      status: b.status, publishDate: b.publishDate?.toISOString(), views: b.views,
      seo: { metaTitle: b.metaTitle || "", metaDescription: b.metaDescription || "", keywords: b.keywords, ogImage: b.ogImage, canonicalUrl: b.canonicalUrl },
      createdAt: b.createdAt.toISOString(), updatedAt: b.updatedAt.toISOString(),
    })), total, page, limit);
  } catch (error) { console.error("Get blogs error:", error); return errorResponse("An error occurred", 500); }
}

export async function POST(request: NextRequest) {
  const limited = await applyRateLimit(request, { preset: "admin", namespace: "admin:blogs:create", identifyByUser: true });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const parsed = await parseJsonBody(request, createBlogSchema);
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;
    const blog = await prisma.blogPost.create({
      data: {
        title: body.title, slug: body.slug, content: body.content, excerpt: body.excerpt,
        featuredImage: body.featuredImage || undefined, category: body.category, tags: body.tags || [],
        authorId: authResult.userId, status: body.status || "draft",
        publishDate: body.publishDate ? new Date(body.publishDate) : undefined,
        metaTitle: body.seo?.metaTitle || undefined, metaDescription: body.seo?.metaDescription || undefined,
        keywords: body.seo?.keywords || [], ogImage: body.seo?.ogImage || undefined, canonicalUrl: body.seo?.canonicalUrl || undefined,
      },
      include: { author: { select: { name: true } } },
    });
    return successResponse({
      _id: blog.id, title: blog.title, slug: blog.slug, content: blog.content, excerpt: blog.excerpt,
      featuredImage: blog.featuredImage, category: blog.category, tags: blog.tags,
      author: blog.author?.name || "", authorId: blog.authorId,
      status: blog.status, publishDate: blog.publishDate?.toISOString(), views: blog.views,
      seo: { metaTitle: blog.metaTitle || "", metaDescription: blog.metaDescription || "", keywords: blog.keywords, ogImage: blog.ogImage, canonicalUrl: blog.canonicalUrl },
      createdAt: blog.createdAt.toISOString(), updatedAt: blog.updatedAt.toISOString(),
    }, "Blog created successfully", 201);
  } catch (error) { console.error("Create blog error:", error); return errorResponse("An error occurred", 500); }
}
