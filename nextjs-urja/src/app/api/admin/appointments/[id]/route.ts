import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  successResponse,
  errorResponse,
  notFoundResponse,
  parseJsonBody,
  applyRateLimit,
} from "@/lib/api-helpers";
import { updateAppointmentSchema } from "@/lib/validators";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = await applyRateLimit(request, {
    preset: "adminRead",
    namespace: "admin:appointments:get",
  });
  if (limited) return limited;

  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    const { id } = await params;
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { doctor: true, service: true },
    });

    if (!appointment) return notFoundResponse("Appointment not found");

    return successResponse({
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
    });
  } catch (error) {
    console.error("Get appointment error:", error);
    return errorResponse("An error occurred", 500);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = await applyRateLimit(request, {
    preset: "admin",
    namespace: "admin:appointments:update",
    identifyByUser: true,
  });
  if (limited) return limited;

  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    const { id } = await params;

    const parsed = await parseJsonBody(request, updateAppointmentSchema);
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;

    const existing = await prisma.appointment.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("Appointment not found");

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        patientName: body.patientName,
        patientPhone: body.patientPhone,
        patientEmail: body.patientEmail,
        patientId: body.patientId || undefined,
        serviceId: body.serviceId || undefined,
        doctorId: body.doctorId || undefined,
        date: body.date ? new Date(body.date) : undefined,
        time: body.time,
        status: body.status,
        notes: body.notes,
      },
      include: { doctor: true, service: true },
    });

    return successResponse({
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
    });
  } catch (error) {
    console.error("Update appointment error:", error);
    return errorResponse("An error occurred", 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = await applyRateLimit(request, {
    preset: "admin",
    namespace: "admin:appointments:delete",
    identifyByUser: true,
  });
  if (limited) return limited;

  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    const { id } = await params;
    const existing = await prisma.appointment.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("Appointment not found");

    await prisma.appointment.delete({ where: { id } });

    return successResponse({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Delete appointment error:", error);
    return errorResponse("An error occurred", 500);
  }
}
