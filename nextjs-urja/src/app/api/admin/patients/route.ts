import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth, successResponse, paginatedResponse, errorResponse,
  getPaginationParams, getSearchParams, parseJsonBody, applyRateLimit,
} from "@/lib/api-helpers";
import { createPatientSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const limited = await applyRateLimit(request, { preset: "adminRead", namespace: "admin:patients:list" });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { searchParams } = request.nextUrl;
    const { page, limit, skip } = getPaginationParams(searchParams);
    const { search } = getSearchParams(searchParams);
    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }
    const [items, total] = await Promise.all([
      prisma.patient.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.patient.count({ where }),
    ]);
    return paginatedResponse(items.map((p) => ({
      _id: p.id, name: p.name, email: p.email, phone: p.phone,
      dateOfBirth: p.dateOfBirth?.toISOString().split("T")[0], gender: p.gender,
      address: p.address, medicalHistory: p.medicalHistory, allergies: p.allergies, photo: p.photo,
      createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString(),
    })), total, page, limit);
  } catch (error) { return errorResponse("An error occurred", 500); }
}

export async function POST(request: NextRequest) {
  const limited = await applyRateLimit(request, { preset: "admin", namespace: "admin:patients:create", identifyByUser: true });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const parsed = await parseJsonBody(request, createPatientSchema);
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;
    const patient = await prisma.patient.create({
      data: {
        name: body.name, email: body.email, phone: body.phone,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
        gender: body.gender || undefined,
        address: body.address || undefined,
        medicalHistory: body.medicalHistory || undefined,
        allergies: body.allergies || undefined,
        photo: body.photo || undefined,
        createdById: authResult.userId,
      },
    });
    return successResponse({
      _id: patient.id, name: patient.name, email: patient.email, phone: patient.phone,
      dateOfBirth: patient.dateOfBirth?.toISOString().split("T")[0], gender: patient.gender,
      address: patient.address, medicalHistory: patient.medicalHistory, allergies: patient.allergies, photo: patient.photo,
      createdAt: patient.createdAt.toISOString(), updatedAt: patient.updatedAt.toISOString(),
    }, "Patient created successfully", 201);
  } catch (error) { return errorResponse("An error occurred", 500); }
}
