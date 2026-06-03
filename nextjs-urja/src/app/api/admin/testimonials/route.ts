import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth, successResponse, paginatedResponse, errorResponse,
  getPaginationParams, getSearchParams, parseJsonBody, applyRateLimit,
} from "@/lib/api-helpers";
import { createTestimonialSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const limited = await applyRateLimit(request, { preset: "adminRead", namespace: "admin:testimonials:list" });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { searchParams } = request.nextUrl;
    const { page, limit, skip } = getPaginationParams(searchParams);
    const { search, status } = getSearchParams(searchParams);
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (search) where.patientName = { contains: search, mode: "insensitive" };
    const [items, total] = await Promise.all([
      prisma.testimonial.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.testimonial.count({ where }),
    ]);
    return paginatedResponse(items.map((t) => ({
      _id: t.id, patientName: t.patientName, patientPhoto: t.patientPhoto, rating: t.rating,
      testimonial: t.testimonial, treatment: t.treatment, status: t.status, isFeatured: t.isFeatured,
      createdAt: t.createdAt.toISOString(), updatedAt: t.updatedAt.toISOString(),
    })), total, page, limit);
  } catch (error) { return errorResponse("An error occurred", 500); }
}

export async function POST(request: NextRequest) {
  const limited = await applyRateLimit(request, { preset: "admin", namespace: "admin:testimonials:create", identifyByUser: true });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const parsed = await parseJsonBody(request, createTestimonialSchema);
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;
    const t = await prisma.testimonial.create({
      data: {
        patientName: body.patientName, patientPhoto: body.patientPhoto || undefined,
        rating: body.rating, testimonial: body.testimonial,
        treatment: body.treatment || undefined,
        status: body.status || "pending", isFeatured: body.isFeatured ?? false,
      },
    });
    return successResponse({
      _id: t.id, patientName: t.patientName, patientPhoto: t.patientPhoto, rating: t.rating,
      testimonial: t.testimonial, treatment: t.treatment, status: t.status, isFeatured: t.isFeatured,
      createdAt: t.createdAt.toISOString(), updatedAt: t.updatedAt.toISOString(),
    }, "Testimonial created", 201);
  } catch (error) { return errorResponse("An error occurred", 500); }
}
