import { NextRequest, NextResponse } from "next/server";
import { requireAuth, successResponse, errorResponse, parseJsonBody, applyRateLimit } from "@/lib/api-helpers";
import { isCloudinaryConfigured, getCloudinary } from "@/lib/cloudinary";
import { cloudinaryDeleteSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const limited = await applyRateLimit(request, { preset: "upload", namespace: "admin:cloudinary:delete", identifyByUser: true });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    if (!isCloudinaryConfigured()) return errorResponse("Cloudinary is not configured", 503);
    const parsed = await parseJsonBody(request, cloudinaryDeleteSchema);
    if (!parsed.ok) return parsed.response;
    const { publicId, resourceType } = parsed.data;
    const cloudinary = getCloudinary();
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return successResponse({ result });
  } catch (error: any) {
    console.error("[cloudinary/delete] error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Delete failed" }, { status: 500 });
  }
}
