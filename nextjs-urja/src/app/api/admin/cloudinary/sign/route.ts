import { NextRequest, NextResponse } from "next/server";
import { requireAuth, successResponse, errorResponse, parseJsonBody, applyRateLimit } from "@/lib/api-helpers";
import { isCloudinaryConfigured, getCloudinary } from "@/lib/cloudinary";
import { cloudinarySignSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const limited = await applyRateLimit(request, { preset: "upload", namespace: "admin:cloudinary:sign", identifyByUser: true });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    if (!isCloudinaryConfigured()) {
      return errorResponse("Cloudinary is not configured", 503);
    }
    const parsed = await parseJsonBody(request, cloudinarySignSchema);
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;
    const cloudinary = getCloudinary();
    const timestamp = Math.floor(Date.now() / 1000);
    // For signed uploads, the params to sign must be alphabetical
    const paramsToSign: Record<string, string | number | string[]> = { timestamp };
    if (body.folder) paramsToSign.folder = body.folder;
    if (body.publicId) paramsToSign.public_id = body.publicId;
    if (body.tags && body.tags.length) paramsToSign.tags = body.tags.join(",");
    if (body.eager) paramsToSign.eager = body.eager;
    const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET!);
    return successResponse({
      signature, timestamp, cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY, folder: body.folder, publicId: body.publicId, tags: body.tags,
    });
  } catch (error: any) {
    console.error("[cloudinary/sign] error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Signing failed" }, { status: 500 });
  }
}
