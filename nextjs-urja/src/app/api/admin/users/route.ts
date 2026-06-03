import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth, successResponse, paginatedResponse, errorResponse,
  getPaginationParams, parseJsonBody, applyRateLimit,
} from "@/lib/api-helpers";
import { createUserSchema } from "@/lib/validators";
import { hashPassword } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  const limited = await applyRateLimit(request, { preset: "adminRead", namespace: "admin:users:list" });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const { searchParams } = request.nextUrl;
    const { page, limit, skip } = getPaginationParams(searchParams);
    const [items, total] = await Promise.all([
      prisma.user.findMany({ skip, take: limit, orderBy: { createdAt: "desc" }, select: { id: true, name: true, email: true, role: true, avatar: true, phone: true, isActive: true, lastLogin: true, createdAt: true, updatedAt: true } }),
      prisma.user.count(),
    ]);
    return paginatedResponse(items.map((u) => ({ _id: u.id, name: u.name, email: u.email, role: u.role, avatar: u.avatar, phone: u.phone, isActive: u.isActive, lastLogin: u.lastLogin?.toISOString(), createdAt: u.createdAt.toISOString(), updatedAt: u.updatedAt.toISOString() })), total, page, limit);
  } catch (error) { return errorResponse("An error occurred", 500); }
}

export async function POST(request: NextRequest) {
  const limited = await applyRateLimit(request, { preset: "admin", namespace: "admin:users:create", identifyByUser: true });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const parsed = await parseJsonBody(request, createUserSchema);
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;
    const passwordHash = await hashPassword(body.password);
    const user = await prisma.user.create({
      data: {
        name: body.name, email: body.email, passwordHash,
        role: body.role || "front_desk",
        avatar: body.avatar || undefined,
        phone: body.phone || undefined,
        isActive: body.isActive ?? true,
      },
      select: { id: true, name: true, email: true, role: true, avatar: true, phone: true, isActive: true, lastLogin: true, createdAt: true, updatedAt: true },
    });
    return successResponse({ _id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, phone: user.phone, isActive: user.isActive, lastLogin: user.lastLogin?.toISOString(), createdAt: user.createdAt.toISOString(), updatedAt: user.updatedAt.toISOString() }, "User created successfully", 201);
  } catch (error: any) {
    if (error?.code === "P2002") return errorResponse("A user with this email already exists", 409);
    console.error("Create user error:", error);
    return errorResponse("An error occurred", 500);
  }
}
