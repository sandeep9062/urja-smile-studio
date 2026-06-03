import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth, successResponse, errorResponse, notFoundResponse,
  parseJsonBody, applyRateLimit,
} from "@/lib/api-helpers";
import { updateBlogSchema } from "@/lib/validators";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = await applyRateLimit(request, { preset: "adminRead", namespace: "admin:blogs:get" });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { id } = await params;
    const b = await prisma.blogPost.findUnique({ where: { id }, include: { author: { select: { name: true } } } });
    if (!b) return notFoundResponse("Blog not found");
    return successResponse({
      _id: b.id, title: b.title, slug: b.slug, content: b.content, excerpt: b.excerpt,
      featuredImage: b.featuredImage, category: b.category, tags: b.tags,
      author: b.author?.name || "", authorId: b.authorId,
      status: b.status, publishDate: b.publishDate?.toISOString(), views: b.views,
      seo: { metaTitle: b.metaTitle || "", metaDescription: b.metaDescription || "", keywords: b.keywords, ogImage: b.ogImage, canonicalUrl: b.canonicalUrl },
      createdAt: b.createdAt.toISOString(), updatedAt: b.updatedAt.toISOString(),
    });
  } catch (error) { return errorResponse("An error occurred", 500); }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = await applyRateLimit(request, { preset: "admin", namespace: "admin:blogs:update", identifyByUser: true });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { id } = await params;
    const parsed = await parseJsonBody(request, updateBlogSchema);
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("Blog not found");
    const b = await prisma.blogPost.update({
      where: { id },
      data: {
        title: body.title, slug: body.slug, content: body.content, excerpt: body.excerpt,
        featuredImage: body.featuredImage || undefined, category: body.category, tags: body.tags,
        status: body.status, publishDate: body.publishDate ? new Date(body.publishDate) : undefined,
        metaTitle: body.seo?.metaTitle, metaDescription: body.seo?.metaDescription,
        keywords: body.seo?.keywords, ogImage: body.seo?.ogImage, canonicalUrl: body.seo?.canonicalUrl,
      },
      include: { author: { select: { name: true } } },
    });
    return successResponse({
      _id: b.id, title: b.title, slug: b.slug, content: b.content, excerpt: b.excerpt,
      featuredImage: b.featuredImage, category: b.category, tags: b.tags,
      author: b.author?.name || "", authorId: b.authorId,
      status: b.status, publishDate: b.publishDate?.toISOString(), views: b.views,
      seo: { metaTitle: b.metaTitle || "", metaDescription: b.metaDescription || "", keywords: b.keywords, ogImage: b.ogImage, canonicalUrl: b.canonicalUrl },
      createdAt: b.createdAt.toISOString(), updatedAt: b.updatedAt.toISOString(),
    });
  } catch (error) { console.error("Update blog error:", error); return errorResponse("An error occurred", 500); }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = await applyRateLimit(request, { preset: "admin", namespace: "admin:blogs:delete", identifyByUser: true });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { id } = await params;
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("Blog not found");
    await prisma.blogPost.delete({ where: { id } });
    return successResponse({ message: "Blog deleted successfully" });
  } catch (error) { return errorResponse("An error occurred", 500); }
}
