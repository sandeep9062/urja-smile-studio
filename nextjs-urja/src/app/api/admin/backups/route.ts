import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, successResponse, errorResponse, applyRateLimit } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  const limited = await applyRateLimit(request, { preset: "adminRead", namespace: "admin:backups:list" });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    const backups = await prisma.backup.findMany({ orderBy: { createdAt: "desc" } });
    return successResponse(backups.map((b) => ({
      _id: b.id, type: b.type, status: b.status, databaseSize: b.databaseSize,
      mediaSize: b.mediaSize, createdAt: b.createdAt.toISOString(), completedAt: b.completedAt?.toISOString(),
    })));
  } catch (error) { return errorResponse("An error occurred", 500); }
}

export async function POST(request: NextRequest) {
  const limited = await applyRateLimit(request, { preset: "admin", namespace: "admin:backups:create", identifyByUser: true });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    const backup = await prisma.backup.create({ data: { type: "manual", status: "in_progress" } });
    // Simulate backup completion
    setTimeout(async () => {
      await prisma.backup.update({ where: { id: backup.id }, data: { status: "completed", databaseSize: "45.2 MB", mediaSize: "2.3 GB", completedAt: new Date() } });
    }, 5000);

    return successResponse({ _id: backup.id, type: backup.type, status: backup.status, createdAt: backup.createdAt.toISOString() }, "Backup started", 201);
  } catch (error) { return errorResponse("An error occurred", 500); }
}