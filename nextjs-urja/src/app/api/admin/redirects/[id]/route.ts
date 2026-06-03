import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth, successResponse, errorResponse, notFoundResponse,
  parseJsonBody, applyRateLimit,
} from "@/lib/api-helpers";
import { updateRedirectSchema } from "@/lib/validators";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = await applyRateLimit(request, { preset: "adminRead", namespace: "admin:redirects:get" });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { id } = await params;
    const r = await prisma.redirect.findUnique({ where: { id } });
    if (!r) return notFoundResponse("Redirect not found");
    return successResponse({
      _id: r.id, oldUrl: r.oldUrl, newUrl: r.newUrl, type: r.type, isActive: r.isActive, hits: r.hits,
      createdAt: r.createdAt.toISOString(), updatedAt: r.updatedAt.toISOString(),
    });
  } catch (error) { return errorResponse("An error occurred", 500); }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = await applyRateLimit(request, { preset: "admin", namespace: "admin:redirects:update", identifyByUser: true });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { id } = await params;
    const parsed = await parseJsonBody(request, updateRedirectSchema);
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;
    const existing = await prisma.redirect.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("Redirect not found");
    const r = await prisma.redirect.update({
      where: { id },
      data: { oldUrl: body.oldUrl, newUrl: body.newUrl, type: body.type, isActive: body.isActive },
    });
    return successResponse({
      _id: r.id, oldUrl: r.oldUrl, newUrl: r.newUrl, type: r.type, isActive: r.isActive, hits: r.hits,
      createdAt: r.createdAt.toISOString(), updatedAt: r.updatedAt.toISOString(),
    });
  } catch (error) { return errorResponse("An error occurred", 500); }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = await applyRateLimit(request, { preset: "admin", namespace: "admin:redirects:delete", identifyByUser: true });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { id } = await params;
    const existing = await prisma.redirect.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("Redirect not found");
    await prisma.redirect.delete({ where: { id } });
    return successResponse({ message: "Redirect deleted" });
  } catch (error) { return errorResponse("An error occurred", 500); }
}
