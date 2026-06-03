import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth, successResponse, errorResponse,
  parseJsonBody, applyRateLimit,
} from "@/lib/api-helpers";
import { createRedirectSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const limited = await applyRateLimit(request, { preset: "adminRead", namespace: "admin:redirects:list" });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const items = await prisma.redirect.findMany({ orderBy: { createdAt: "desc" } });
    return successResponse(items.map((r) => ({
      _id: r.id, oldUrl: r.oldUrl, newUrl: r.newUrl, type: r.type, isActive: r.isActive, hits: r.hits,
      createdAt: r.createdAt.toISOString(), updatedAt: r.updatedAt.toISOString(),
    })));
  } catch (error) { return errorResponse("An error occurred", 500); }
}

export async function POST(request: NextRequest) {
  const limited = await applyRateLimit(request, { preset: "admin", namespace: "admin:redirects:create", identifyByUser: true });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const parsed = await parseJsonBody(request, createRedirectSchema);
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;
    const r = await prisma.redirect.create({
      data: { oldUrl: body.oldUrl, newUrl: body.newUrl, type: body.type || "PERMANENT", isActive: body.isActive ?? true },
    });
    return successResponse({
      _id: r.id, oldUrl: r.oldUrl, newUrl: r.newUrl, type: r.type, isActive: r.isActive, hits: r.hits,
      createdAt: r.createdAt.toISOString(), updatedAt: r.updatedAt.toISOString(),
    }, "Redirect created", 201);
  } catch (error: any) {
    if (error?.code === "P2002") return errorResponse("A redirect with this source URL already exists", 409);
    return errorResponse("An error occurred", 500);
  }
}
