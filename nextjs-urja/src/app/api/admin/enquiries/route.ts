import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  successResponse,
  paginatedResponse,
  errorResponse,
  getPaginationParams,
  getSearchParams,
  parseJsonBody,
  applyRateLimit,
} from "@/lib/api-helpers";
import { createEnquirySchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const limited = await applyRateLimit(request, {
    preset: "adminRead",
    namespace: "admin:enquiries:list",
  });
  if (limited) return limited;

  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    const { searchParams } = request.nextUrl;
    const { page, limit, skip } = getPaginationParams(searchParams);
    const { search, status } = getSearchParams(searchParams);

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.enquiry.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" }, include: { assignedTo: { select: { name: true } }, internalNotes: { include: { createdBy: { select: { name: true } } } }, conversationHistory: true } }),
      prisma.enquiry.count({ where }),
    ]);

    return paginatedResponse(items.map((e) => ({
      _id: e.id, name: e.name, phone: e.phone, email: e.email, subject: e.subject, message: e.message,
      status: e.status, assignedTo: e.assignedTo?.name || "",
      internalNotes: e.internalNotes.map(n => ({ _id: n.id, content: n.content, createdBy: n.createdBy?.name || "", createdAt: n.createdAt.toISOString() })),
      conversationHistory: e.conversationHistory.map(m => ({ _id: m.id, type: m.type, content: m.content, sentBy: m.sentBy, sentAt: m.sentAt.toISOString() })),
      createdAt: e.createdAt.toISOString(), updatedAt: e.updatedAt.toISOString(),
    })), total, page, limit);
  } catch (error) { return errorResponse("An error occurred", 500); }
}

export async function POST(request: NextRequest) {
  const limited = await applyRateLimit(request, {
    preset: "admin",
    namespace: "admin:enquiries:create",
    identifyByUser: true,
  });
  if (limited) return limited;

  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    const parsed = await parseJsonBody(request, createEnquirySchema);
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;

    const enquiry = await prisma.enquiry.create({
      data: {
        name: body.name,
        phone: body.phone,
        email: body.email,
        subject: body.subject || "Manual entry",
        message: body.message,
        status: body.status || "new",
        assignedToId: body.assignedToId || undefined,
      },
    });
    return successResponse(
      {
        _id: enquiry.id,
        name: enquiry.name,
        phone: enquiry.phone,
        email: enquiry.email,
        subject: enquiry.subject,
        message: enquiry.message,
        status: enquiry.status,
        createdAt: enquiry.createdAt.toISOString(),
        updatedAt: enquiry.updatedAt.toISOString(),
      },
      "Enquiry created successfully",
      201,
    );
  } catch (error) {
    console.error("Create enquiry error:", error);
    return errorResponse("An error occurred", 500);
  }
}
