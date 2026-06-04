"use client";

// =============================================================================
// DragDropImageUpload
// =============================================================================
// A reusable drag-and-drop image upload component backed by Cloudinary.
// Supports single & multiple file modes, optional metadata (folder, tags),
// image preview, and both inline & compact variants.
// =============================================================================

import { useCallback, useRef, useState } from "react";
import {
  Upload,
  X,
  Loader2,
  ImageIcon,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface UploadedAsset {
  publicId: string;
  url: string;
  format: string;
  width?: number;
  height?: number;
  bytes?: number;
}

interface SignResponse {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder?: string;
  publicId?: string;
  tags?: string[];
  signature: string;
  resourceType: string;
}

interface UploadState {
  file: File;
  status: "uploading" | "success" | "error";
  url?: string;
  error?: string;
}

export interface DragDropImageUploadProps {
  /** Cloudinary folder to upload into */
  folder?: string;
  /** Tags to apply to uploaded assets */
  tags?: string[];
  /** Accept string for the file input, defaults to "image/*" */
  accept?: string;
  /** Allow multiple file selection */
  multiple?: boolean;
  /** Callback fired after each successful upload */
  onUploaded?: (asset: UploadedAsset) => void;
  /** Callback fired when files are removed (by user) */
  onRemoved?: (url: string) => void;
  /** Current preview URLs (controlled mode) */
  value?: string[];
  /** "inline" = larger dropzone, "compact" = smaller inline widget */
  variant?: "inline" | "compact";
  /** Whether the whole component is disabled */
  disabled?: boolean;
  /** Extra CSS class names */
  className?: string;
  /** Optional label shown above the dropzone */
  label?: string;
  /** Helper text shown below the dropzone */
  helperText?: string;
  /** Max file size in MB (client-side check) */
  maxFileSizeMB?: number;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function DragDropImageUpload({
  folder,
  tags,
  accept = "image/*",
  multiple = false,
  onUploaded,
  onRemoved,
  value = [],
  variant = "inline",
  disabled = false,
  className,
  label,
  helperText,
  maxFileSizeMB = 10,
}: DragDropImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploads, setUploads] = useState<UploadState[]>([]);

  // ---------- helpers ----------

  const resetInput = () => {
    if (inputRef.current) inputRef.current.value = "";
  };

  const uploadFile = useCallback(
    async (file: File) => {
      // Client-side size check
      if (file.size > maxFileSizeMB * 1024 * 1024) {
        toast.error(`${file.name} exceeds ${maxFileSizeMB} MB limit`);
        return;
      }

      const placeholder: UploadState = { file, status: "uploading" };
      setUploads((prev) => [...prev, placeholder]);

      try {
        // 1. Sign
        const signRes = await fetch("/api/admin/cloudinary/sign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ folder, tags }),
        });
        const signJson = (await signRes.json()) as
          | { success: true; data: SignResponse }
          | { success?: false; error: string };

        if (!signRes.ok || !signJson?.success || !("data" in signJson) || !signJson.data) {
          throw new Error(
            (signJson as { error?: string })?.error ?? "Failed to sign upload",
          );
        }

        const sign = signJson.data;

        // 2. Upload to Cloudinary
        const form = new FormData();
        form.append("file", file);
        form.append("api_key", sign.apiKey);
        form.append("timestamp", String(sign.timestamp));
        form.append("signature", sign.signature);
        if (sign.folder) form.append("folder", sign.folder);
        if (sign.publicId) form.append("public_id", sign.publicId);
        if (sign.tags && sign.tags.length > 0) form.append("tags", sign.tags.join(","));

        const endpoint = `https://api.cloudinary.com/v1_1/${sign.cloudName}/${sign.resourceType}/upload`;
        const uploadRes = await fetch(endpoint, { method: "POST", body: form });
        const uploadJson = await uploadRes.json();

        if (!uploadRes.ok) {
          throw new Error(uploadJson?.error?.message || "Upload failed");
        }

        const asset: UploadedAsset = {
          publicId: uploadJson.public_id,
          url: uploadJson.secure_url,
          format: uploadJson.format,
          width: uploadJson.width,
          height: uploadJson.height,
          bytes: uploadJson.bytes,
        };

        // Update placeholder to success
        setUploads((prev) =>
          prev.map((u) =>
            u.file === file ? { ...u, status: "success" as const, url: asset.url } : u,
          ),
        );

        toast.success(`Uploaded ${file.name}`);
        onUploaded?.(asset);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        setUploads((prev) =>
          prev.map((u) =>
            u.file === file ? { ...u, status: "error" as const, error: msg } : u,
          ),
        );
        toast.error(msg);
      }
    },
    [folder, tags, maxFileSizeMB, onUploaded],
  );

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        return;
      }
      void uploadFile(file);
    });
    resetInput();
  };

  // ---------- drag handlers ----------

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setDragOver(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    if (!disabled) handleFiles(e.dataTransfer.files);
  };

  // ---------- remove helpers ----------

  const removePreview = (url: string) => {
    onRemoved?.(url);
  };

  const removeUpload = (idx: number) => {
    setUploads((prev) => prev.filter((_, i) => i !== idx));
  };

  // ---------- rendering ----------

  const isCompact = variant === "compact";
  const allPreviews = [...value, ...uploads.filter((u) => u.status === "success" && u.url).map((u) => u.url!)];

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <p className="text-sm font-medium text-gray-700">{label}</p>
      )}

      {/* Dropzone */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "border-2 border-dashed rounded-lg text-center cursor-pointer transition-all duration-200",
          isCompact ? "p-4" : "p-8",
          dragOver
            ? "border-teal-500 bg-teal-50/80 scale-[1.01]"
            : "border-gray-300 hover:border-teal-400 hover:bg-gray-50/50",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        <div className="flex flex-col items-center gap-2">
          <div
            className={cn(
              "rounded-full bg-gray-100 flex items-center justify-center",
              isCompact ? "h-10 w-10" : "h-14 w-14",
              dragOver && "bg-teal-100",
            )}
          >
            <Upload
              className={cn(
                isCompact ? "h-5 w-5" : "h-7 w-7",
                dragOver ? "text-teal-600" : "text-gray-400",
              )}
            />
          </div>
          <p className={cn("font-medium text-gray-700", isCompact ? "text-xs" : "text-sm")}>
            {dragOver ? "Drop images here" : "Drag & drop images here or click to browse"}
          </p>
          <p className={cn("text-gray-400", isCompact ? "text-[10px]" : "text-xs")}>
            JPG, PNG, WebP, GIF — Max {maxFileSizeMB} MB{multiple ? " • Multiple files supported" : ""}
          </p>
        </div>
      </div>

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          handleFiles(e.target.files);
        }}
      />

      {/* Helper text */}
      {helperText && (
        <p className="text-xs text-gray-400">{helperText}</p>
      )}

      {/* Uploading indicators */}
      {uploads.some((u) => u.status === "uploading") && (
        <div className="space-y-2">
          {uploads
            .filter((u) => u.status === "uploading")
            .map((u, i) => (
              <div
                key={`uploading-${i}`}
                className="flex items-center gap-3 p-2 rounded-md bg-blue-50 border border-blue-200"
              >
                <Loader2 className="h-4 w-4 text-blue-500 animate-spin shrink-0" />
                <span className="text-xs text-blue-700 truncate flex-1">
                  Uploading {u.file.name}…
                </span>
              </div>
            ))}
        </div>
      )}

      {/* Failed uploads */}
      {uploads.some((u) => u.status === "error") && (
        <div className="space-y-2">
          {uploads
            .filter((u) => u.status === "error")
            .map((u, i) => (
              <div
                key={`error-${i}`}
                className="flex items-center gap-3 p-2 rounded-md bg-red-50 border border-red-200"
              >
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                <span className="text-xs text-red-700 truncate flex-1">
                  {u.file.name}: {u.error}
                </span>
                <button
                  type="button"
                  onClick={() => removeUpload(uploads.indexOf(u))}
                  className="text-red-400 hover:text-red-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
        </div>
      )}

      {/* Previews grid */}
      {allPreviews.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allPreviews.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className="relative group rounded-md overflow-hidden border bg-gray-100"
              style={{ width: isCompact ? 64 : 96, height: isCompact ? 64 : 96 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Upload ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {value.includes(url) ? (
                  <button
                    type="button"
                    onClick={() => removePreview(url)}
                    className="text-white hover:text-red-300"
                    title="Remove"
                  >
                    <X className="h-5 w-5" />
                  </button>
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                )}
              </div>
              {value.includes(url) && (
                <button
                  type="button"
                  onClick={() => removePreview(url)}
                  className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// ImageDropzone — lightweight standalone dropzone for quick single-image use
// =============================================================================
// A simpler variant that just handles the dropzone + file input + upload,
// returning a single URL via `onUploaded`. Useful for forms that just need
// a quick "drop an image here" widget.
// =============================================================================

interface ImageDropzoneProps {
  folder?: string;
  tags?: string[];
  value?: string | null;
  onChange?: (url: string | null) => void;
  className?: string;
  label?: string;
  maxFileSizeMB?: number;
  disabled?: boolean;
}

export function ImageDropzone({
  folder,
  tags,
  value,
  onChange,
  className,
  label,
  maxFileSizeMB = 10,
  disabled = false,
}: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  const uploadFile = useCallback(
    async (file: File) => {
      if (file.size > maxFileSizeMB * 1024 * 1024) {
        toast.error(`${file.name} exceeds ${maxFileSizeMB} MB limit`);
        return;
      }

      setUploading(true);
      try {
        const signRes = await fetch("/api/admin/cloudinary/sign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ folder, tags }),
        });
        const signJson = (await signRes.json()) as
          | { success: true; data: SignResponse }
          | { success?: false; error: string };

        if (!signRes.ok || !signJson?.success || !("data" in signJson) || !signJson.data) {
          throw new Error(
            (signJson as { error?: string })?.error ?? "Failed to sign upload",
          );
        }

        const sign = signJson.data;
        const form = new FormData();
        form.append("file", file);
        form.append("api_key", sign.apiKey);
        form.append("timestamp", String(sign.timestamp));
        form.append("signature", sign.signature);
        if (sign.folder) form.append("folder", sign.folder);
        if (sign.publicId) form.append("public_id", sign.publicId);
        if (sign.tags && sign.tags.length > 0) form.append("tags", sign.tags.join(","));

        const endpoint = `https://api.cloudinary.com/v1_1/${sign.cloudName}/${sign.resourceType}/upload`;
        const uploadRes = await fetch(endpoint, { method: "POST", body: form });
        const uploadJson = await uploadRes.json();

        if (!uploadRes.ok) {
          throw new Error(uploadJson?.error?.message || "Upload failed");
        }

        toast.success(`Uploaded ${file.name}`);
        onChange?.(uploadJson.secure_url as string);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        toast.error(msg);
      } finally {
        setUploading(false);
      }
    },
    [folder, tags, maxFileSizeMB, onChange],
  );

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0]; // single file
    if (!file.type.startsWith("image/")) {
      toast.error(`${file.name} is not an image`);
      return;
    }
    void uploadFile(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium text-gray-700">{label}</p>}

      {value ? (
        <div className="relative rounded-md overflow-hidden border bg-gray-100 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Uploaded" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={disabled || uploading}
            >
              Replace
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => onChange?.(null)}
              disabled={disabled}
            >
              Remove
            </Button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
            </div>
          )}
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => !disabled && !uploading && inputRef.current?.click()}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !disabled) {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragOver(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (!disabled) handleFiles(e.dataTransfer.files);
          }}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200",
            dragOver
              ? "border-teal-500 bg-teal-50/80"
              : "border-gray-300 hover:border-teal-400 hover:bg-gray-50/50",
            disabled && "pointer-events-none opacity-50",
            uploading && "pointer-events-none opacity-60",
          )}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />
              <p className="text-sm text-gray-500">Uploading…</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-700">
                Drag & drop an image or click to browse
              </p>
              <p className="text-xs text-gray-400">
                JPG, PNG, WebP — Max {maxFileSizeMB} MB
              </p>
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          handleFiles(e.target.files);
        }}
      />
    </div>
  );
}