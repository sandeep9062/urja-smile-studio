import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth, successResponse, errorResponse, notFoundResponse,
  parseJsonBody, applyRateLimit,
} from "@/lib/api-helpers";
import { updateServiceSchema } from "@/lib/validators";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = await applyRateLimit(request, { preset: "adminRead", namespace: "admin:services:get" });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { id } = await params;
    const s = await prisma.service.findUnique({ where: { id } });
    if (!s) return notFoundResponse("Service not found");
    return successResponse({
      _id: s.id, name: s.name, slug: s.slug, icon: s.icon, banner: s.banner,
      shortDescription: s.shortDescription, description: s.description, benefits: s.benefits,
      category: s.category, isActive: s.isActive, order: s.order,
      seo: { metaTitle: s.metaTitle || "", metaDescription: s.metaDescription || "", keywords: s.keywords, ogImage: s.ogImage, canonicalUrl: s.canonicalUrl },
      createdAt: s.createdAt.toISOString(), updatedAt: s.updatedAt.toISOString(),
    });
  } catch (error) { return errorResponse("An error occurred", 500); }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = await applyRateLimit(request, { preset: "admin", namespace: "admin:services:update", identifyByUser: true });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { id } = await params;
    const parsed = await parseJsonBody(request, updateServiceSchema);
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;
    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("Service not found");
    const s = await prisma.service.update({
      where: { id },
      data: {
        name: body.name, slug: body.slug, icon: body.icon, banner: body.banner,
        shortDescription: body.shortDescription, description: body.description,
        benefits: body.benefits, category: body.category,
        isActive: body.isActive, order: body.order,
        metaTitle: body.metaTitle, metaDescription: body.metaDescription,
        keywords: body.keywords, ogImage: body.ogImage, canonicalUrl: body.canonicalUrl,
      },
    });
    return successResponse({
      _id: s.id, name: s.name, slug: s.slug, icon: s.icon, banner: s.banner,
      shortDescription: s.shortDescription, description: s.description, benefits: s.benefits,
      category: s.category, isActive: s.isActive, order: s.order,
      seo: { metaTitle: s.metaTitle || "", metaDescription: s.metaDescription || "", keywords: s.keywords, ogImage: s.ogImage, canonicalUrl: s.canonicalUrl },
      createdAt: s.createdAt.toISOString(), updatedAt: s.updatedAt.toISOString(),
    });
  } catch (error) { return errorResponse("An error occurred", 500); }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = await applyRateLimit(request, { preset: "admin", namespace: "admin:services:delete", identifyByUser: true });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { id } = await params;
    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("Service not found");
    await prisma.service.delete({ where: { id } });
    return successResponse({ message: "Service deleted successfully" });
  } catch (error) { return errorResponse("An error occurred", 500); }
}
