"use client";

// =============================================================================
// MediaPicker + MediaLibrary
// =============================================================================
// Cloudinary-backed media library for the admin dashboard. Provides:
//   - A dialog-based picker (MediaPicker) that lets the user select one asset
//     and returns it to the caller (used by the rich-text editor).
//   - A full-page library (MediaLibrary) component that lists, uploads,
//     searches and deletes assets.
//   - A reusable CloudinaryUploader component that signs and uploads files
//     directly from the browser.
// =============================================================================

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Search,
  Upload,
  Trash2,
  Loader2,
  ImageIcon,
  Check,
  Copy,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface MediaAsset {
  publicId: string;
  url: string;
  thumbnail: string;
  format: string;
  width?: number;
  height?: number;
  bytes?: number;
  folder?: string;
  tags: string[];
  createdAt?: string;
  resourceType?: string;
}

interface ListResponse {
  resources: MediaAsset[];
  nextCursor: string | null;
  total: number;
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

// -----------------------------------------------------------------------------
// Cloudinary direct-from-browser uploader
// -----------------------------------------------------------------------------

interface CloudinaryUploaderProps {
  folder?: string;
  tags?: string[];
  onUploaded: (asset: MediaAsset) => void;
  variant?: "button" | "dropzone";
  className?: string;
  children?: React.ReactNode;
}

export function CloudinaryUploader({
  folder,
  tags,
  onUploaded,
  variant = "dropzone",
  className,
  children,
}: CloudinaryUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = useCallback(
    async (file: File) => {
      try {
        setUploading(true);
        const signRes = await fetch("/api/admin/cloudinary/sign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ folder, tags }),
        });
        const signJson = (await signRes.json()) as
          | { success: true; data: SignResponse; error?: undefined }
          | { success?: false; data?: undefined; error: string };

        if (!signRes.ok || !signJson?.success || !signJson.data) {
          const msg =
            (signJson as { error?: string })?.error ??
            "Failed to sign upload";
          throw new Error(msg);
        }

        const sign = signJson.data;
        const form = new FormData();
        form.append("file", file);
        form.append("api_key", sign.apiKey);
        form.append("timestamp", String(sign.timestamp));
        form.append("signature", sign.signature);
        if (sign.folder) form.append("folder", sign.folder);
        if (sign.publicId) form.append("public_id", sign.publicId);
        if (sign.tags && sign.tags.length > 0) {
          form.append("tags", sign.tags.join(","));
        }

        const endpoint = `https://api.cloudinary.com/v1_1/${sign.cloudName}/${sign.resourceType}/upload`;
        const uploadRes = await fetch(endpoint, { method: "POST", body: form });
        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadJson?.error?.message || "Upload failed");
        }

        const asset: MediaAsset = {
          publicId: uploadJson.public_id,
          url: uploadJson.secure_url,
          thumbnail: uploadJson.secure_url, // replaced via cloudinary.url() on next list
          format: uploadJson.format,
          width: uploadJson.width,
          height: uploadJson.height,
          bytes: uploadJson.bytes,
          folder: uploadJson.folder,
          tags: uploadJson.tags ?? [],
          createdAt: uploadJson.created_at,
          resourceType: uploadJson.resource_type,
        };
        toast.success(`Uploaded ${file.name}`);
        onUploaded(asset);
      } catch (err: any) {
        toast.error(err?.message || "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [folder, tags, onUploaded],
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
  };

  if (variant === "button") {
    return (
      <>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={className}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Upload className="h-4 w-4 mr-2" />
          )}
          {uploading ? "Uploading..." : (children ?? "Upload")}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={cn(
        "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
        dragOver
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50",
        uploading && "pointer-events-none opacity-60",
        className,
      )}
    >
      {uploading ? (
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-7 w-7 text-muted-foreground animate-spin" />
          <p className="text-sm text-muted-foreground">Uploading...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-7 w-7 text-muted-foreground" />
          <p className="text-sm font-medium">
            Drop files here or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            JPG, PNG, WebP, GIF, SVG — multiple files supported
          </p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}

// -----------------------------------------------------------------------------
// Shared: media grid (used by both MediaPicker and MediaLibrary)
// -----------------------------------------------------------------------------

interface MediaGridProps {
  assets: MediaAsset[];
  selected?: string | null;
  multiSelect?: boolean;
  selectedIds?: string[];
  onSelect?: (asset: MediaAsset) => void;
  onDelete?: (asset: MediaAsset) => void;
  emptyMessage?: string;
}

function MediaGrid({
  assets,
  selected,
  multiSelect,
  selectedIds,
  onSelect,
  onDelete,
  emptyMessage = "No images found",
}: MediaGridProps) {
  if (assets.length === 0) {
    return (
      <div className="text-center py-12">
        <ImageIcon className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {assets.map((asset) => {
        const isSelected = multiSelect
          ? selectedIds?.includes(asset.publicId)
          : selected === asset.publicId;

        return (
          <div
            key={asset.publicId}
            className={cn(
              "group relative aspect-square rounded-md overflow-hidden border bg-muted cursor-pointer",
              isSelected
                ? "ring-2 ring-primary border-primary"
                : "hover:border-primary/50",
            )}
            onClick={() => onSelect?.(asset)}
          >
            {/* Using native img here intentionally: Cloudinary returns optimized
                URLs that work in <img> without further next/image config. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset.thumbnail || asset.url}
              alt={asset.publicId}
              loading="lazy"
              className="w-full h-full object-cover"
            />

            {isSelected && (
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-0.5">
                <Check className="h-3.5 w-3.5" />
              </div>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(asset);
                }}
                className="absolute top-2 left-2 bg-black/60 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-xs text-white truncate" title={asset.publicId}>
                {asset.publicId.split("/").pop()}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-white/80">
                {asset.format && <span className="uppercase">{asset.format}</span>}
                {asset.width && asset.height && (
                  <>
                    <span>•</span>
                    <span>
                      {asset.width}×{asset.height}
                    </span>
                  </>
                )}
                {asset.bytes && (
                  <>
                    <span>•</span>
                    <span>{Math.round(asset.bytes / 1024)}KB</span>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// -----------------------------------------------------------------------------
// useMediaList — list + paginate Cloudinary assets
// -----------------------------------------------------------------------------

function useMediaList(folder?: string) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (cursor: string | null, searchTerm: string) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (folder) params.set("prefix", folder);
        if (cursor) params.set("next_cursor", cursor);
        params.set("max_results", "60");
        const res = await fetch(`/api/admin/cloudinary/list?${params.toString()}`);
        const json = await res.json();
        if (!res.ok || !json?.success) {
          throw new Error(json?.error || "Failed to load media");
        }
        const data = json.data as ListResponse;
        const filtered = searchTerm
          ? data.resources.filter((r) =>
              r.publicId.toLowerCase().includes(searchTerm.toLowerCase()),
            )
          : data.resources;
        setAssets((prev) => (cursor ? [...prev, ...filtered] : filtered));
        setNextCursor(data.nextCursor);
      } catch (err: any) {
        setError(err?.message || "Failed to load media");
      } finally {
        setLoading(false);
      }
    },
    [folder],
  );

  useEffect(() => {
    setAssets([]);
    setNextCursor(null);
    void fetchPage(null, search);
  }, [fetchPage, search]);

  const addLocal = useCallback((asset: MediaAsset) => {
    setAssets((prev) => [asset, ...prev]);
  }, []);

  const removeLocal = useCallback((publicId: string) => {
    setAssets((prev) => prev.filter((a) => a.publicId !== publicId));
  }, []);

  return {
    assets,
    loading,
    error,
    nextCursor,
    hasMore: Boolean(nextCursor),
    loadMore: () => fetchPage(nextCursor, search),
    refresh: () => {
      setAssets([]);
      setNextCursor(null);
      void fetchPage(null, search);
    },
    addLocal,
    removeLocal,
    search,
    setSearch,
  };
}

// -----------------------------------------------------------------------------
// MediaPicker — pick a single image and call onPick(asset)
// -----------------------------------------------------------------------------

export interface MediaPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPick: (asset: MediaAsset) => void;
  folder?: string;
  title?: string;
  description?: string;
}

export function MediaPicker({
  open,
  onOpenChange,
  onPick,
  folder,
  title = "Pick an image",
  description = "Choose an image from your Cloudinary media library.",
}: MediaPickerProps) {
  const [selected, setSelected] = useState<MediaAsset | null>(null);
  const {
    assets,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    addLocal,
    search,
    setSearch,
  } = useMediaList(folder);

  // Reset selection when the dialog re-opens.
  useEffect(() => {
    if (open) setSelected(null);
  }, [open]);

  const handleConfirm = () => {
    if (selected) {
      onPick(selected);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by filename..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <CloudinaryUploader
            folder={folder}
            variant="button"
            onUploaded={(asset) => {
              addLocal(asset);
              setSelected(asset);
            }}
          >
            Upload new
          </CloudinaryUploader>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={refresh}
            title="Refresh"
          >
            <Loader2
              className={cn("h-4 w-4", loading && "animate-spin")}
            />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto min-h-[300px]">
          {error ? (
            <div className="text-center py-12">
              <p className="text-sm text-destructive">{error}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={refresh}
              >
                Try again
              </Button>
            </div>
          ) : (
            <>
              <MediaGrid
                assets={assets}
                selected={selected?.publicId ?? null}
                onSelect={setSelected}
                emptyMessage={
                  search
                    ? `No images match "${search}"`
                    : "Your media library is empty — upload your first image."
                }
              />
              {loading && (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              )}
              {hasMore && !loading && (
                <div className="flex justify-center py-4">
                  <Button type="button" variant="outline" size="sm" onClick={loadMore}>
                    Load more
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between gap-2">
          <div className="text-xs text-muted-foreground truncate flex-1">
            {selected
              ? `Selected: ${selected.publicId}`
              : "Select an image to insert"}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={!selected}
            >
              Insert
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// -----------------------------------------------------------------------------
// MediaLibrary — full-page gallery used by /admin-dashboard/gallery
// -----------------------------------------------------------------------------

export interface MediaLibraryProps {
  folder?: string;
  title?: string;
  description?: string;
  onSelect?: (asset: MediaAsset) => void;
}

export function MediaLibrary({
  folder,
  title = "Media Library",
  description = "Browse, upload, and manage all your images in one place.",
  onSelect,
}: MediaLibraryProps) {
  const [detail, setDetail] = useState<MediaAsset | null>(null);
  const [toDelete, setToDelete] = useState<MediaAsset | null>(null);
  const {
    assets,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    addLocal,
    removeLocal,
    search,
    setSearch,
  } = useMediaList(folder);

  const handleDelete = useCallback(
    async (asset: MediaAsset) => {
      try {
        const res = await fetch("/api/admin/cloudinary/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId: asset.publicId }),
        });
        const json = await res.json();
        if (!res.ok || !json?.success) {
          throw new Error(json?.error || "Delete failed");
        }
        removeLocal(asset.publicId);
        toast.success("Image deleted");
        if (detail?.publicId === asset.publicId) setDetail(null);
      } catch (err: any) {
        toast.error(err?.message || "Delete failed");
      }
    },
    [removeLocal, detail],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <CloudinaryUploader
          folder={folder}
          variant="button"
          onUploaded={addLocal}
        >
          Upload images
        </CloudinaryUploader>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={refresh}
          title="Refresh"
        >
          <Loader2 className={cn("h-4 w-4", loading && "animate-spin")} />
        </Button>
      </div>

      <CloudinaryUploader
        folder={folder}
        variant="dropzone"
        className="mb-2"
        onUploaded={addLocal}
      />

      {error ? (
        <div className="text-center py-12">
          <p className="text-sm text-destructive">{error}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={refresh}
          >
            Try again
          </Button>
        </div>
      ) : (
        <>
          <MediaGrid
            assets={assets}
            onSelect={(asset) =>
              onSelect ? onSelect(asset) : setDetail(asset)
            }
            onDelete={(asset) => setToDelete(asset)}
          />
          {loading && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}
          {hasMore && !loading && (
            <div className="flex justify-center py-4">
              <Button type="button" variant="outline" onClick={loadMore}>
                Load more
              </Button>
            </div>
          )}
        </>
      )}

      {/* Detail dialog */}
      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="truncate">
              {detail?.publicId}
            </DialogTitle>
          </DialogHeader>
          {detail && (
            <div className="space-y-4">
              <div className="rounded-md overflow-hidden border bg-muted max-h-[60vh] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={detail.url}
                  alt={detail.publicId}
                  className="max-h-[60vh] w-auto object-contain"
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Format</p>
                  <p className="font-medium uppercase">{detail.format}</p>
                </div>
                {detail.width && detail.height && (
                  <div>
                    <p className="text-muted-foreground text-xs">Dimensions</p>
                    <p className="font-medium">
                      {detail.width}×{detail.height}
                    </p>
                  </div>
                )}
                {detail.bytes && (
                  <div>
                    <p className="text-muted-foreground text-xs">Size</p>
                    <p className="font-medium">
                      {Math.round(detail.bytes / 1024)} KB
                    </p>
                  </div>
                )}
                {detail.folder && (
                  <div>
                    <p className="text-muted-foreground text-xs">Folder</p>
                    <p className="font-medium truncate" title={detail.folder}>
                      {detail.folder}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">URL</p>
                <div className="flex items-center gap-2">
                  <Input value={detail.url} readOnly className="text-xs" />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText(detail.url);
                      toast.success("URL copied");
                    }}
                    title="Copy URL"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {detail.tags.length > 0 && (
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {detail.tags.map((t) => (
                      <Badge key={t} variant="secondary">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDetail(null)}
            >
              Close
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                if (detail) setToDelete(detail);
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete image?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove{" "}
              <span className="font-mono text-xs">
                {toDelete?.publicId}
              </span>{" "}
              from Cloudinary. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (toDelete) {
                  void handleDelete(toDelete);
                  setToDelete(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
