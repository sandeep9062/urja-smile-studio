import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  successResponse,
  paginatedResponse,
  errorResponse,
  getPaginationParams,
  getSearchParams,
  parseJsonBody,
  applyRateLimit,
} from "@/lib/api-helpers";
import { createAppointmentSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const limited = await applyRateLimit(request, {
    preset: "adminRead",
    namespace: "admin:appointments:list",
  });
  if (limited) return limited;

  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    const { searchParams } = request.nextUrl;
    const { page, limit, skip } = getPaginationParams(searchParams);
    const { search, status } = getSearchParams(searchParams);

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { patientName: { contains: search, mode: "insensitive" } },
        { patientEmail: { contains: search, mode: "insensitive" } },
        { patientPhone: { contains: search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: "desc" },
        include: { doctor: true, service: true },
      }),
      prisma.appointment.count({ where }),
    ]);

    return paginatedResponse(
      items.map((a) => ({
        _id: a.id,
        patientName: a.patientName,
        patientPhone: a.patientPhone,
        patientEmail: a.patientEmail,
        service: a.service?.name || "",
        serviceId: a.serviceId,
        doctor: a.doctor?.name || "",
        doctorId: a.doctorId,
        date: a.date.toISOString().split("T")[0],
        time: a.time,
        status: a.status,
        notes: a.notes,
        createdAt: a.createdAt.toISOString(),
        updatedAt: a.updatedAt.toISOString(),
      })),
      total,
      page,
      limit,
    );
  } catch (error) {
    console.error("Get appointments error:", error);
    return errorResponse("An error occurred", 500);
  }
}

export async function POST(request: NextRequest) {
  const limited = await applyRateLimit(request, {
    preset: "admin",
    namespace: "admin:appointments:create",
    identifyByUser: true,
  });
  if (limited) return limited;

  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    const parsed = await parseJsonBody(request, createAppointmentSchema);
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;

    const appointment = await prisma.appointment.create({
      data: {
        patientName: body.patientName,
        patientPhone: body.patientPhone,
        patientEmail: body.patientEmail,
        patientId: body.patientId || undefined,
        serviceId: body.serviceId || undefined,
        doctorId: body.doctorId || undefined,
        date: new Date(body.date),
        time: body.time,
        status: body.status || "pending",
        notes: body.notes || undefined,
        createdById: authResult.userId,
      },
      include: { doctor: true, service: true },
    });

    return successResponse(
      {
        _id: appointment.id,
        patientName: appointment.patientName,
        patientPhone: appointment.patientPhone,
        patientEmail: appointment.patientEmail,
        service: appointment.service?.name || "",
        serviceId: appointment.serviceId,
        doctor: appointment.doctor?.name || "",
        doctorId: appointment.doctorId,
        date: appointment.date.toISOString().split("T")[0],
        time: appointment.time,
        status: appointment.status,
        notes: appointment.notes,
        createdAt: appointment.createdAt.toISOString(),
        updatedAt: appointment.updatedAt.toISOString(),
      },
      "Appointment created successfully",
      201,
    );
  } catch (error) {
    console.error("Create appointment error:", error);
    return errorResponse("An error occurred", 500);
  }
}
