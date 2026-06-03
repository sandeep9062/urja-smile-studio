import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth, successResponse, errorResponse, notFoundResponse,
  parseJsonBody, applyRateLimit,
} from "@/lib/api-helpers";
import { updateUserSchema } from "@/lib/validators";
import { hashPassword } from "@/lib/auth-utils";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = await applyRateLimit(request, { preset: "adminRead", namespace: "admin:users:get" });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { id } = await params;
    const u = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, avatar: true, phone: true, isActive: true, lastLogin: true, createdAt: true, updatedAt: true },
    });
    if (!u) return notFoundResponse("User not found");
    return successResponse({ _id: u.id, name: u.name, email: u.email, role: u.role, avatar: u.avatar, phone: u.phone, isActive: u.isActive, lastLogin: u.lastLogin?.toISOString(), createdAt: u.createdAt.toISOString(), updatedAt: u.updatedAt.toISOString() });
  } catch (error) { return errorResponse("An error occurred", 500); }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = await applyRateLimit(request, { preset: "admin", namespace: "admin:users:update", identifyByUser: true });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { id } = await params;
    const parsed = await parseJsonBody(request, updateUserSchema);
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("User not found");
    const passwordHash = body.password ? await hashPassword(body.password) : undefined;
    const u = await prisma.user.update({
      where: { id },
      data: {
        name: body.name, email: body.email, role: body.role,
        avatar: body.avatar, phone: body.phone, isActive: body.isActive,
        passwordHash,
      },
      select: { id: true, name: true, email: true, role: true, avatar: true, phone: true, isActive: true, lastLogin: true, createdAt: true, updatedAt: true },
    });
    return successResponse({ _id: u.id, name: u.name, email: u.email, role: u.role, avatar: u.avatar, phone: u.phone, isActive: u.isActive, lastLogin: u.lastLogin?.toISOString(), createdAt: u.createdAt.toISOString(), updatedAt: u.updatedAt.toISOString() });
  } catch (error) { return errorResponse("An error occurred", 500); }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = await applyRateLimit(request, { preset: "admin", namespace: "admin:users:delete", identifyByUser: true });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { id } = await params;
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("User not found");
    await prisma.user.delete({ where: { id } });
    return successResponse({ message: "User deleted successfully" });
  } catch (error) { return errorResponse("An error occurred", 500); }
}
