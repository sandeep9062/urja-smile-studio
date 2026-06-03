import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth, successResponse, paginatedResponse, errorResponse,
  getPaginationParams, getSearchParams, parseJsonBody, applyRateLimit,
} from "@/lib/api-helpers";
import { createDoctorSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const limited = await applyRateLimit(request, { preset: "adminRead", namespace: "admin:doctors:list" });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { searchParams } = request.nextUrl;
    const { page, limit, skip } = getPaginationParams(searchParams);
    const { search } = getSearchParams(searchParams);
    const where: Record<string, unknown> = {};
    if (search) where.name = { contains: search, mode: "insensitive" };
    const [items, total] = await Promise.all([
      prisma.doctor.findMany({ where, skip, take: limit, orderBy: { order: "asc" } }),
      prisma.doctor.count({ where }),
    ]);
    return paginatedResponse(items.map((d) => ({
      _id: d.id, name: d.name, slug: d.slug, photo: d.photo, qualification: d.qualification,
      experience: d.experience, specializations: d.specializations, bio: d.bio,
      consultationFees: Number(d.consultationFees), isActive: d.isActive, order: d.order,
      createdAt: d.createdAt.toISOString(), updatedAt: d.updatedAt.toISOString(),
    })), total, page, limit);
  } catch (error) { return errorResponse("An error occurred", 500); }
}

export async function POST(request: NextRequest) {
  const limited = await applyRateLimit(request, { preset: "admin", namespace: "admin:doctors:create", identifyByUser: true });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const parsed = await parseJsonBody(request, createDoctorSchema);
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;
    const doctor = await prisma.doctor.create({
      data: {
        name: body.name, slug: body.slug, photo: body.photo || undefined,
        qualification: body.qualification, experience: body.experience,
        specializations: body.specializations, bio: body.bio,
        consultationFees: body.consultationFees,
        isActive: body.isActive ?? true, order: body.order ?? 0,
      },
    });
    return successResponse({
      _id: doctor.id, name: doctor.name, slug: doctor.slug, photo: doctor.photo, qualification: doctor.qualification,
      experience: doctor.experience, specializations: doctor.specializations, bio: doctor.bio,
      consultationFees: Number(doctor.consultationFees), isActive: doctor.isActive, order: doctor.order,
      createdAt: doctor.createdAt.toISOString(), updatedAt: doctor.updatedAt.toISOString(),
    }, "Doctor created successfully", 201);
  } catch (error: any) {
    if (error?.code === "P2002") return errorResponse("A doctor with this slug already exists", 409);
    return errorResponse("An error occurred", 500);
  }
}
