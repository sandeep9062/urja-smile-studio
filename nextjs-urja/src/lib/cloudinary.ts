// =============================================================================
// Cloudinary helper for Urja Dental Clinic
// =============================================================================
// Server-side Cloudinary SDK configuration. All admin uploads should go through
// the server-side signed routes in /api/admin/cloudinary/* (see below) so that
// the API secret never leaves the server.
// =============================================================================

import { v2 as cloudinary } from "cloudinary";
import { createHash } from "node:crypto";

// Cloudinary is configured lazily so that build-time static analysis does not
// fail when the env vars are absent. The first call to `getCloudinary()` will
// throw a clear error if the configuration is missing.
export function getCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your environment.",
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return cloudinary;
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

/**
 * Generate a short-lived signed-upload payload for the browser to upload
 * directly to Cloudinary without exposing the API secret.
 *
 * Cloudinary's signing algorithm: alphabetically sort the params, join
 * `key=value` with `&` (skipping `file`, `api_key`, `resource_type`, and any
 * empty values), and append the API secret before SHA-1 hashing.
 * https://cloudinary.com/documentation/upload_images#generating_authentication_signatures
 */
export function signUploadParams(params: Record<string, string | number> = {}) {
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiSecret) {
    throw new Error("CLOUDINARY_API_SECRET is not set");
  }

  const entries = Object.entries(params)
    .filter(([, v]) => v !== "" && v !== null && v !== undefined)
    .filter(([k]) => k !== "file" && k !== "api_key" && k !== "resource_type")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");

  const toSign = entries + apiSecret;
  return createHash("sha1").update(toSign).digest("hex");
}

/**
 * The default folder uploaded assets go into.
 */
export const CLOUDINARY_FOLDER =
  process.env.CLOUDINARY_FOLDER ?? "urja-dental";
