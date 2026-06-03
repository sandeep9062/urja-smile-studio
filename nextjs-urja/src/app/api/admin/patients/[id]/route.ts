import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth, successResponse, errorResponse, notFoundResponse,
  parseJsonBody, applyRateLimit,
} from "@/lib/api-helpers";
import { updatePatientSchema } from "@/lib/validators";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = await applyRateLimit(request, { preset: "adminRead", namespace: "admin:patients:get" });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { id } = await params;
    const p = await prisma.patient.findUnique({ where: { id } });
    if (!p) return notFoundResponse("Patient not found");
    return successResponse({
      _id: p.id, name: p.name, email: p.email, phone: p.phone,
      dateOfBirth: p.dateOfBirth?.toISOString().split("T")[0], gender: p.gender,
      address: p.address, medicalHistory: p.medicalHistory, allergies: p.allergies, photo: p.photo,
      createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString(),
    });
  } catch (error) { return errorResponse("An error occurred", 500); }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = await applyRateLimit(request, { preset: "admin", namespace: "admin:patients:update", identifyByUser: true });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { id } = await params;
    const parsed = await parseJsonBody(request, updatePatientSchema);
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;
    const existing = await prisma.patient.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("Patient not found");
    const p = await prisma.patient.update({
      where: { id },
      data: {
        name: body.name, email: body.email, phone: body.phone,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
        gender: body.gender || undefined,
        address: body.address, medicalHistory: body.medicalHistory,
        allergies: body.allergies, photo: body.photo,
      },
    });
    return successResponse({
      _id: p.id, name: p.name, email: p.email, phone: p.phone,
      dateOfBirth: p.dateOfBirth?.toISOString().split("T")[0], gender: p.gender,
      address: p.address, medicalHistory: p.medicalHistory, allergies: p.allergies, photo: p.photo,
      createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString(),
    });
  } catch (error) { return errorResponse("An error occurred", 500); }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = await applyRateLimit(request, { preset: "admin", namespace: "admin:patients:delete", identifyByUser: true });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { id } = await params;
    const existing = await prisma.patient.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("Patient not found");
    await prisma.patient.delete({ where: { id } });
    return successResponse({ message: "Patient deleted successfully" });
  } catch (error) { return errorResponse("An error occurred", 500); }
}
