import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, successResponse, errorResponse, applyRateLimit } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  const limited = await applyRateLimit(request, { preset: "adminRead", namespace: "admin:stats:get" });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalAppointments, todayAppointments, activePatients, blogPosts, enquiries] =
      await Promise.all([
        prisma.appointment.count(),
        prisma.appointment.count({
          where: { date: { gte: today, lt: tomorrow } },
        }),
        prisma.patient.count(),
        prisma.blogPost.count({ where: { status: "published" } }),
        prisma.enquiry.count({ where: { status: { not: "closed" } } }),
      ]);

    return successResponse({
      totalAppointments,
      todayAppointments,
      activePatients,
      blogPosts,
      enquiries,
      websiteVisitors: 12500, // Placeholder - would need analytics integration
    });
  } catch (error) {
    console.error("Stats error:", error);
    return errorResponse("An error occurred", 500);
  }
}