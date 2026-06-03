import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth, successResponse, errorResponse, notFoundResponse,
  parseJsonBody, applyRateLimit,
} from "@/lib/api-helpers";
import { updateDoctorSchema } from "@/lib/validators";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = await applyRateLimit(request, { preset: "adminRead", namespace: "admin:doctors:get" });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { id } = await params;
    const d = await prisma.doctor.findUnique({ where: { id } });
    if (!d) return notFoundResponse("Doctor not found");
    return successResponse({
      _id: d.id, name: d.name, slug: d.slug, photo: d.photo, qualification: d.qualification,
      experience: d.experience, specializations: d.specializations, bio: d.bio,
      consultationFees: Number(d.consultationFees), isActive: d.isActive, order: d.order,
      createdAt: d.createdAt.toISOString(), updatedAt: d.updatedAt.toISOString(),
    });
  } catch (error) { return errorResponse("An error occurred", 500); }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = await applyRateLimit(request, { preset: "admin", namespace: "admin:doctors:update", identifyByUser: true });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { id } = await params;
    const parsed = await parseJsonBody(request, updateDoctorSchema);
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;
    const existing = await prisma.doctor.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("Doctor not found");
    const d = await prisma.doctor.update({
      where: { id },
      data: {
        name: body.name, slug: body.slug, photo: body.photo,
        qualification: body.qualification, experience: body.experience,
        specializations: body.specializations, bio: body.bio,
        consultationFees: body.consultationFees,
        isActive: body.isActive, order: body.order,
      },
    });
    return successResponse({
      _id: d.id, name: d.name, slug: d.slug, photo: d.photo, qualification: d.qualification,
      experience: d.experience, specializations: d.specializations, bio: d.bio,
      consultationFees: Number(d.consultationFees), isActive: d.isActive, order: d.order,
      createdAt: d.createdAt.toISOString(), updatedAt: d.updatedAt.toISOString(),
    });
  } catch (error) { return errorResponse("An error occurred", 500); }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = await applyRateLimit(request, { preset: "admin", namespace: "admin:doctors:delete", identifyByUser: true });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { id } = await params;
    const existing = await prisma.doctor.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("Doctor not found");
    await prisma.doctor.delete({ where: { id } });
    return successResponse({ message: "Doctor deleted successfully" });
  } catch (error) { return errorResponse("An error occurred", 500); }
}
