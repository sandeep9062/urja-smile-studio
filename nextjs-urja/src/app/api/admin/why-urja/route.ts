import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth, successResponse, errorResponse,
  applyRateLimit,
} from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  const limited = await applyRateLimit(request, { preset: "adminRead", namespace: "admin:why-urja:get" });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    const pillars = await prisma.whyUrjaPillar.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    return successResponse(
      pillars.map((p) => ({
        _id: p.id,
        order: p.order,
        tag: p.tag,
        headline: p.headline,
        body: p.body,
        image: p.image,
        fallbackGradient: p.fallbackGradient,
        imageAlt: p.imageAlt,
        nudge: p.nudge,
      }))
    );
  } catch (error) {
    return errorResponse("An error occurred", 500);
  }
}

export async function PUT(request: NextRequest) {
  const limited = await applyRateLimit(request, { preset: "admin", namespace: "admin:why-urja:update", identifyByUser: true });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    const body = await request.json();
    const { pillars } = body;

    if (!Array.isArray(pillars) || pillars.length === 0) {
      return errorResponse("Pillars array is required", 400);
    }

    // Delete existing pillars and create new ones
    await prisma.whyUrjaPillar.deleteMany({});

    const created = await Promise.all(
      pillars.map((p: any, idx: number) =>
        prisma.whyUrjaPillar.create({
          data: {
            order: idx,
            tag: p.tag || "",
            headline: p.headline || "",
            body: p.body || "",
            image: p.image || "",
            fallbackGradient: p.fallbackGradient || "linear-gradient(135deg, #e8d5c0 0%, #d4b896 50%, #c9a97a 100%)",
            imageAlt: p.imageAlt || "",
            nudge: p.nudge || "mt-0",
            isActive: true,
          },
        })
      )
    );

    return successResponse(
      created.map((p) => ({
        _id: p.id,
        order: p.order,
        tag: p.tag,
        headline: p.headline,
        body: p.body,
        image: p.image,
        fallbackGradient: p.fallbackGradient,
        imageAlt: p.imageAlt,
        nudge: p.nudge,
      }))
    );
  } catch (error) {
    console.error("WhyUrja PUT error:", error);
    return errorResponse("An error occurred", 500);
  }
}