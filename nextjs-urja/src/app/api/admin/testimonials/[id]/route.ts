import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth, successResponse, errorResponse, notFoundResponse,
  parseJsonBody, applyRateLimit,
} from "@/lib/api-helpers";
import { updateTestimonialSchema } from "@/lib/validators";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = await applyRateLimit(request, { preset: "adminRead", namespace: "admin:testimonials:get" });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { id } = await params;
    const t = await prisma.testimonial.findUnique({ where: { id } });
    if (!t) return notFoundResponse("Testimonial not found");
    return successResponse({
      _id: t.id, patientName: t.patientName, patientPhoto: t.patientPhoto, rating: t.rating,
      testimonial: t.testimonial, treatment: t.treatment, status: t.status, isFeatured: t.isFeatured,
      createdAt: t.createdAt.toISOString(), updatedAt: t.updatedAt.toISOString(),
    });
  } catch (error) { return errorResponse("An error occurred", 500); }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = await applyRateLimit(request, { preset: "admin", namespace: "admin:testimonials:update", identifyByUser: true });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { id } = await params;
    const parsed = await parseJsonBody(request, updateTestimonialSchema);
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;
    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("Testimonial not found");
    const t = await prisma.testimonial.update({
      where: { id },
      data: {
        patientName: body.patientName, patientPhoto: body.patientPhoto, rating: body.rating,
        testimonial: body.testimonial, treatment: body.treatment,
        status: body.status, isFeatured: body.isFeatured,
      },
    });
    return successResponse({
      _id: t.id, patientName: t.patientName, patientPhoto: t.patientPhoto, rating: t.rating,
      testimonial: t.testimonial, treatment: t.treatment, status: t.status, isFeatured: t.isFeatured,
      createdAt: t.createdAt.toISOString(), updatedAt: t.updatedAt.toISOString(),
    });
  } catch (error) { return errorResponse("An error occurred", 500); }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = await applyRateLimit(request, { preset: "admin", namespace: "admin:testimonials:delete", identifyByUser: true });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { id } = await params;
    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("Testimonial not found");
    await prisma.testimonial.delete({ where: { id } });
    return successResponse({ message: "Testimonial deleted" });
  } catch (error) { return errorResponse("An error occurred", 500); }
}
