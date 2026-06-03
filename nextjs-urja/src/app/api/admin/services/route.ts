import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth, successResponse, paginatedResponse, errorResponse,
  getPaginationParams, getSearchParams, parseJsonBody, applyRateLimit,
} from "@/lib/api-helpers";
import { createServiceSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const limited = await applyRateLimit(request, { preset: "adminRead", namespace: "admin:services:list" });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { searchParams } = request.nextUrl;
    const { page, limit, skip } = getPaginationParams(searchParams);
    const { search, category } = getSearchParams(searchParams);
    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (search) where.name = { contains: search, mode: "insensitive" };
    const [items, total] = await Promise.all([
      prisma.service.findMany({ where, skip, take: limit, orderBy: { order: "asc" } }),
      prisma.service.count({ where }),
    ]);
    return paginatedResponse(items.map((s) => ({
      _id: s.id, name: s.name, slug: s.slug, icon: s.icon, banner: s.banner,
      shortDescription: s.shortDescription, description: s.description, benefits: s.benefits,
      category: s.category, isActive: s.isActive, order: s.order,
      seo: { metaTitle: s.metaTitle || "", metaDescription: s.metaDescription || "", keywords: s.keywords, ogImage: s.ogImage, canonicalUrl: s.canonicalUrl },
      createdAt: s.createdAt.toISOString(), updatedAt: s.updatedAt.toISOString(),
    })), total, page, limit);
  } catch (error) { return errorResponse("An error occurred", 500); }
}

export async function POST(request: NextRequest) {
  const limited = await applyRateLimit(request, { preset: "admin", namespace: "admin:services:create", identifyByUser: true });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const parsed = await parseJsonBody(request, createServiceSchema);
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;
    const service = await prisma.service.create({
      data: {
        name: body.name, slug: body.slug, icon: body.icon || undefined, banner: body.banner || undefined,
        shortDescription: body.shortDescription, description: body.description,
        benefits: body.benefits || [], category: body.category || undefined,
        isActive: body.isActive ?? true, order: body.order ?? 0,
        metaTitle: body.metaTitle || undefined, metaDescription: body.metaDescription || undefined,
        keywords: body.keywords || [], ogImage: body.ogImage || undefined, canonicalUrl: body.canonicalUrl || undefined,
      },
    });
    return successResponse({
      _id: service.id, name: service.name, slug: service.slug, icon: service.icon, banner: service.banner,
      shortDescription: service.shortDescription, description: service.description, benefits: service.benefits,
      category: service.category, isActive: service.isActive, order: service.order,
      seo: { metaTitle: service.metaTitle || "", metaDescription: service.metaDescription || "", keywords: service.keywords, ogImage: service.ogImage, canonicalUrl: service.canonicalUrl },
      createdAt: service.createdAt.toISOString(), updatedAt: service.updatedAt.toISOString(),
    }, "Service created successfully", 201);
  } catch (error: any) {
    if (error?.code === "P2002") return errorResponse("A service with this slug already exists", 409);
    return errorResponse("An error occurred", 500);
  }
}
