"use client";

import { useState } from "react";
import { Search, Plus, Trash2, Image as ImageIcon, Grid3X3, List, Upload, X } from "lucide-react";
import { DragDropImageUpload } from "@/components/admin/drag-drop-image-upload";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { mockGalleryImages } from "@/lib/mock-data";
import type { GalleryImage } from "@/lib/types";

const categories = [
  "All",
  "Teeth Whitening",
  "Dental Implants",
  "Smile Makeover",
  "Braces",
  "Root Canal",
];

export default function GalleryPage() {
  const [images, setImages] = useState(mockGalleryImages);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const filteredImages = images.filter((img) => {
    const matchesSearch =
      img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.caption?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || img.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const deleteImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img._id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Smile Gallery</h1>
          <p className="text-gray-500">Manage before/after photos and gallery</p>
        </div>
        <Button size="sm" onClick={() => setIsUploadDialogOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Photos
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search gallery..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-1">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((img) => (
            <Card
              key={img._id}
              className="group overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedImage(img)}
            >
              <div className="aspect-square bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center relative">
                <ImageIcon className="h-12 w-12 text-teal-300" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteImage(img._id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-sm font-medium truncate">{img.title}</p>
                <Badge variant="outline" className="text-xs mt-1">
                  {img.category}
                </Badge>
              </CardContent>
            </Card>
          ))}
          {filteredImages.length === 0 && (
            <div className="col-span-full text-center py-12">
              <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No images found</p>
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredImages.map((img) => (
                <div key={img._id} className="flex items-center gap-4 p-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="h-6 w-6 text-teal-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{img.title}</p>
                    <p className="text-xs text-gray-500 truncate">{img.caption}</p>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {img.category}
                      </Badge>
                      {img.treatmentTags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteImage(img._id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload Gallery Photos</DialogTitle>
            <DialogDescription>Upload before/after photos to the gallery</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <DragDropImageUpload
              folder="urja-dental/gallery"
              multiple
              variant="inline"
              value={uploadedUrls}
              onUploaded={(asset) => setUploadedUrls((prev) => [...prev, asset.url])}
              onRemoved={(url) => setUploadedUrls((prev) => prev.filter((u) => u !== url))}
              maxFileSizeMB={10}
            />
            <div className="space-y-2">
              <Label>Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter((c) => c !== "All")
                    .map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input placeholder="Photo title" />
            </div>
            <div className="space-y-2">
              <Label>Caption</Label>
              <Textarea placeholder="Photo caption..." />
            </div>
            <div className="space-y-2">
              <Label>Treatment Tags (comma separated)</Label>
              <Input placeholder="whitening, cosmetic, before-after" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsUploadDialogOpen(false)}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Detail Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedImage?.title}</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              <div className="aspect-video bg-gradient-to-br from-teal-100 to-blue-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="h-16 w-16 text-teal-300" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <Badge variant="outline">{selectedImage.category}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order</p>
                  <p className="font-medium">{selectedImage.order}</p>
                </div>
              </div>
              {selectedImage.caption && (
                <div>
                  <p className="text-sm text-gray-500">Caption</p>
                  <p className="text-sm">{selectedImage.caption}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Tags</p>
                <div className="flex gap-1 mt-1">
                  {selectedImage.treatmentTags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedImage(null)}>
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedImage) deleteImage(selectedImage._id);
                setSelectedImage(null);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
