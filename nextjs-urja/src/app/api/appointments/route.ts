/**
 * Public appointment-booking endpoint.
 *
 *   POST /api/appointments
 *
 * Validates input with Zod, applies strict per-IP rate limiting, and creates
 * a `pending` appointment in the database. The admin team can then confirm
 * it from the dashboard.
 *
 * Public endpoint — no auth required. A `website` honeypot field is included
 * in the schema; any value in it is treated as spam and silently 200-OK'd.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  applyRateLimit,
  parseJsonBody,
  successResponse,
} from "@/lib/api-helpers";
import { appointmentBookingSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  // Strict rate limit: 5 bookings / minute / IP.
  const limited = await applyRateLimit(request, {
    preset: "contact",
    namespace: "appointment",
  });
  if (limited) return limited;

  const parsed = await parseJsonBody(request, appointmentBookingSchema);
  if (!parsed.ok) return parsed.response;
  const {
    name,
    phone,
    email,
    service,
    doctor,
    consultationType,
    date,
    time,
    complaint,
    website,
  } = parsed.data;

  // Honeypot trap — silently pretend success so bots learn nothing.
  if (website && website.length > 0) {
    return successResponse(
      { id: "spam-filtered" },
      "Your appointment request has been received.",
      201,
    );
  }

  try {
    // Look up the service and doctor by name (best-effort). They are
    // optional in the public form so we fall back to null.
    const [serviceRecord, doctorRecord] = await Promise.all([
      prisma.service.findFirst({
        where: { OR: [{ name: service }, { slug: service }] },
        select: { id: true },
      }),
      prisma.doctor.findFirst({
        where: { OR: [{ name: doctor }, { slug: doctor.toLowerCase().replace(/\s+/g, "-") }] },
        select: { id: true },
      }),
    ]);

    const appointment = await prisma.appointment.create({
      data: {
        patientName: name,
        patientPhone: phone,
        patientEmail: email || `${phone.replace(/\D/g, "")}@guest.urja.local`,
        serviceId: serviceRecord?.id,
        doctorId: doctorRecord?.id,
        date: new Date(`${date}T00:00:00.000Z`),
        time,
        status: "pending",
        consultationType: consultationType === "VIDEO" ? "VIDEO" : "PHYSICAL",
        notes: complaint
          ? `[Service requested: ${service}]\n[Doctor requested: ${doctor}]\n[Consultation type: ${consultationType}]\n\n${complaint}`
          : `[Service requested: ${service}]\n[Doctor requested: ${doctor}]\n[Consultation type: ${consultationType}]`,
      },
      select: { id: true, createdAt: true },
    });

    return successResponse(
      { id: appointment.id },
      "Your appointment request has been received.",
      201,
    );
  } catch (error) {
    console.error("[api/appointments] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit your appointment. Please try again.",
      },
      { status: 500 },
    );
  }
}
