import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  successResponse,
  errorResponse,
  notFoundResponse,
  parseJsonBody,
  applyRateLimit,
} from "@/lib/api-helpers";
import { updateEnquirySchema } from "@/lib/validators";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = await applyRateLimit(request, {
    preset: "adminRead",
    namespace: "admin:enquiries:get",
  });
  if (limited) return limited;

  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    const { id } = await params;
    const e = await prisma.enquiry.findUnique({
      where: { id },
      include: { assignedTo: { select: { name: true } }, internalNotes: { include: { createdBy: { select: { name: true } } } }, conversationHistory: true },
    });
    if (!e) return notFoundResponse("Enquiry not found");
    return successResponse({
      _id: e.id, name: e.name, phone: e.phone, email: e.email, subject: e.subject, message: e.message,
      status: e.status, assignedTo: e.assignedTo?.name || "",
      internalNotes: e.internalNotes.map(n => ({ _id: n.id, content: n.content, createdBy: n.createdBy?.name || "", createdAt: n.createdAt.toISOString() })),
      conversationHistory: e.conversationHistory.map(m => ({ _id: m.id, type: m.type, content: m.content, sentBy: m.sentBy, sentAt: m.sentAt.toISOString() })),
      createdAt: e.createdAt.toISOString(), updatedAt: e.updatedAt.toISOString(),
    });
  } catch (error) { return errorResponse("An error occurred", 500); }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = await applyRateLimit(request, {
    preset: "admin",
    namespace: "admin:enquiries:update",
    identifyByUser: true,
  });
  if (limited) return limited;

  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    const { id } = await params;
    const parsed = await parseJsonBody(request, updateEnquirySchema);
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;

    const existing = await prisma.enquiry.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("Enquiry not found");

    const e = await prisma.enquiry.update({
      where: { id },
      data: {
        name: body.name,
        phone: body.phone,
        email: body.email,
        subject: body.subject,
        message: body.message,
        status: body.status,
        assignedToId: body.assignedToId || undefined,
      },
      include: { assignedTo: { select: { name: true } }, internalNotes: { include: { createdBy: { select: { name: true } } } }, conversationHistory: true },
    });
    return successResponse({
      _id: e.id, name: e.name, phone: e.phone, email: e.email, subject: e.subject, message: e.message,
      status: e.status, assignedTo: e.assignedTo?.name || "",
      internalNotes: e.internalNotes.map(n => ({ _id: n.id, content: n.content, createdBy: n.createdBy?.name || "", createdAt: n.createdAt.toISOString() })),
      conversationHistory: e.conversationHistory.map(m => ({ _id: m.id, type: m.type, content: m.content, sentBy: m.sentBy, sentAt: m.sentAt.toISOString() })),
      createdAt: e.createdAt.toISOString(), updatedAt: e.updatedAt.toISOString(),
    });
  } catch (error) { return errorResponse("An error occurred", 500); }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = await applyRateLimit(request, {
    preset: "admin",
    namespace: "admin:enquiries:delete",
    identifyByUser: true,
  });
  if (limited) return limited;

  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    const { id } = await params;
    const existing = await prisma.enquiry.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("Enquiry not found");

    await prisma.enquiry.delete({ where: { id } });
    return successResponse({ message: "Enquiry deleted successfully" });
  } catch (error) { return errorResponse("An error occurred", 500); }
}
 