import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-helpers";

/**
 * Public API — no auth required.
 * Returns the active Why Urja pillars for the frontend.
 */
export async function GET(request: NextRequest) {
  try {
    const pillars = await prisma.whyUrjaPillar.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    if (!pillars || pillars.length === 0) {
      return successResponse([]);
    }

    return successResponse(
      pillars.map((p) => ({
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
    console.error("Public WhyUrja API error:", error);
    return errorResponse("An error occurred", 500);
  }
}