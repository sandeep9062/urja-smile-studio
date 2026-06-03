import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth, successResponse, paginatedResponse, errorResponse,
  getPaginationParams, getSearchParams, parseJsonBody, applyRateLimit,
} from "@/lib/api-helpers";
import { createGallerySchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const limited = await applyRateLimit(request, { preset: "adminRead", namespace: "admin:gallery:list" });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { searchParams } = request.nextUrl;
    const { page, limit, skip } = getPaginationParams(searchParams);
    const { search, category } = getSearchParams(searchParams);
    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (search) where.title = { contains: search, mode: "insensitive" };
    const [items, total] = await Promise.all([
      prisma.galleryImage.findMany({ where, skip, take: limit, orderBy: { order: "asc" } }),
      prisma.galleryImage.count({ where }),
    ]);
    return paginatedResponse(items.map((g) => ({
      _id: g.id, url: g.url, thumbnail: g.thumbnail, title: g.title, caption: g.caption,
      category: g.category, treatmentTags: g.treatmentTags, order: g.order,
      createdAt: g.createdAt.toISOString(), updatedAt: g.updatedAt.toISOString(),
    })), total, page, limit);
  } catch (error) { return errorResponse("An error occurred", 500); }
}

export async function POST(request: NextRequest) {
  const limited = await applyRateLimit(request, { preset: "admin", namespace: "admin:gallery:create", identifyByUser: true });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const parsed = await parseJsonBody(request, createGallerySchema);
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;
    const g = await prisma.galleryImage.create({
      data: {
        url: body.url, thumbnail: body.thumbnail, title: body.title,
        caption: body.caption || undefined, category: body.category,
        treatmentTags: body.treatmentTags || [], order: body.order ?? 0,
      },
    });
    return successResponse({
      _id: g.id, url: g.url, thumbnail: g.thumbnail, title: g.title, caption: g.caption,
      category: g.category, treatmentTags: g.treatmentTags, order: g.order,
      createdAt: g.createdAt.toISOString(), updatedAt: g.updatedAt.toISOString(),
    }, "Gallery image added", 201);
  } catch (error) { return errorResponse("An error occurred", 500); }
}
