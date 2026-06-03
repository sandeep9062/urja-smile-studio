import { NextRequest, NextResponse } from "next/server";
import { requireAuth, successResponse, errorResponse, applyRateLimit } from "@/lib/api-helpers";
import { isCloudinaryConfigured, getCloudinary } from "@/lib/cloudinary";
import { z } from "zod";
import { parseQuery } from "@/lib/api-helpers";

const listQuerySchema = z.object({
  folder: z.string().trim().max(200).optional().default("urja-dental"),
  max_results: z.coerce.number().int().min(1).max(500).optional().default(50),
  next_cursor: z.string().trim().max(500).optional().default(""),
});

export async function GET(request: NextRequest) {
  const limited = await applyRateLimit(request, { preset: "adminRead", namespace: "admin:cloudinary:list" });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    if (!isCloudinaryConfigured()) return errorResponse("Cloudinary is not configured", 503);
    const parsed = parseQuery(request.nextUrl.searchParams, listQuerySchema);
    if (!parsed.ok) return parsed.response;
    const cloudinary = getCloudinary();
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: parsed.data.folder,
      max_results: parsed.data.max_results,
      next_cursor: parsed.data.next_cursor || undefined,
    });
    return successResponse({
      resources: result.resources, next_cursor: result.next_cursor,
    });
  } catch (error: any) {
    console.error("[cloudinary/list] error:", error);
    return NextResponse.json({ success: false, error: error?.message || "List failed" }, { status: 500 });
  }
}
