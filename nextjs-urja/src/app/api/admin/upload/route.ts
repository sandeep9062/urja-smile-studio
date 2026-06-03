import { NextRequest } from "next/server";
import { requireAuth, errorResponse, successResponse, applyRateLimit } from "@/lib/api-helpers";
import {
  getCloudinary,
  isCloudinaryConfigured,
  CLOUDINARY_FOLDER,
} from "@/lib/cloudinary";
import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const uploadMetaSchema = z.object({
  folder: z.string().trim().min(1).max(200).default(CLOUDINARY_FOLDER),
  publicId: z.string().trim().max(200).optional().or(z.literal("")),
  tags: z.array(z.string().trim().min(1).max(80)).max(50).optional(),
});

export async function POST(request: NextRequest) {
  const limited = await applyRateLimit(request, { preset: "upload", namespace: "admin:upload", identifyByUser: true });
  if (limited) return limited;

  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    if (!isCloudinaryConfigured()) {
      return errorResponse(
        "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
        503,
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const tagsRaw = formData.get("tags");
    const raw = {
      folder: (formData.get("folder") as string) || CLOUDINARY_FOLDER,
      publicId: (formData.get("publicId") as string) || "",
      tags: tagsRaw
        ? (tagsRaw as string).split(",").map((t) => t.trim()).filter(Boolean)
        : undefined,
    };
    const parsed = uploadMetaSchema.safeParse(raw);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message || "Invalid upload metadata", 400);
    }
    const { folder, publicId, tags } = parsed.data;

    if (!file || !(file instanceof File)) return errorResponse("No file provided", 400);
    if (!file.type.startsWith("image/")) return errorResponse("Only image uploads are supported", 400);
    if (file.size > MAX_FILE_SIZE) return errorResponse(`File too large. Max ${MAX_FILE_SIZE / (1024 * 1024)}MB`, 400);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const cloudinary = getCloudinary();

    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, public_id: publicId || undefined, tags, resource_type: "image" },
        (error, res) => (error ? reject(error) : resolve(res)),
      );
      stream.end(buffer);
    });

    return successResponse({
      url: result.secure_url, publicId: result.public_id, width: result.width, height: result.height,
      format: result.format, bytes: result.bytes, folder: result.folder, tags: result.tags ?? [],
    }, "File uploaded successfully", 201);
  } catch (error: any) {
    console.error("[admin/upload] error:", error);
    return errorResponse(error?.message || "Upload failed", 500);
  }
}
