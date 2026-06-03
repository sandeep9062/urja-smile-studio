import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth, successResponse, errorResponse, notFoundResponse,
  parseJsonBody, applyRateLimit,
} from "@/lib/api-helpers";
import { updateGallerySchema } from "@/lib/validators";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = await applyRateLimit(request, { preset: "adminRead", namespace: "admin:gallery:get" });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { id } = await params;
    const g = await prisma.galleryImage.findUnique({ where: { id } });
    if (!g) return notFoundResponse("Gallery image not found");
    return successResponse({
      _id: g.id, url: g.url, thumbnail: g.thumbnail, title: g.title, caption: g.caption,
      category: g.category, treatmentTags: g.treatmentTags, order: g.order,
      createdAt: g.createdAt.toISOString(), updatedAt: g.updatedAt.toISOString(),
    });
  } catch (error) { return errorResponse("An error occurred", 500); }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = await applyRateLimit(request, { preset: "admin", namespace: "admin:gallery:update", identifyByUser: true });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { id } = await params;
    const parsed = await parseJsonBody(request, updateGallerySchema);
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;
    const existing = await prisma.galleryImage.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("Gallery image not found");
    const g = await prisma.galleryImage.update({
      where: { id },
      data: {
        url: body.url, thumbnail: body.thumbnail, title: body.title,
        caption: body.caption, category: body.category, treatmentTags: body.treatmentTags, order: body.order,
      },
    });
    return successResponse({
      _id: g.id, url: g.url, thumbnail: g.thumbnail, title: g.title, caption: g.caption,
      category: g.category, treatmentTags: g.treatmentTags, order: g.order,
      createdAt: g.createdAt.toISOString(), updatedAt: g.updatedAt.toISOString(),
    });
  } catch (error) { return errorResponse("An error occurred", 500); }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = await applyRateLimit(request, { preset: "admin", namespace: "admin:gallery:delete", identifyByUser: true });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { id } = await params;
    const existing = await prisma.galleryImage.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("Gallery image not found");
    await prisma.galleryImage.delete({ where: { id } });
    return successResponse({ message: "Gallery image deleted" });
  } catch (error) { return errorResponse("An error occurred", 500); }
}
