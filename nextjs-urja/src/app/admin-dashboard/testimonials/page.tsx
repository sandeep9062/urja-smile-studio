"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Star,
  CheckCircle2,
  XCircle,
  Eye,
  Edit,
  Trash2,
  ThumbsUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockTestimonials } from "@/lib/mock-data";
import type { Testimonial, TestimonialStatus } from "@/lib/types";
import { ImageDropzone } from "@/components/admin/drag-drop-image-upload";

const statusColors: Record<TestimonialStatus, string> = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
};

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState(mockTestimonials);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [patientPhoto, setPatientPhoto] = useState<string | null>(null);

  const filteredTestimonials = testimonials.filter((t) => {
    const matchesSearch =
      t.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.testimonial.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = (id: string, status: TestimonialStatus) => {
    setTestimonials((prev) => prev.map((t) => (t._id === id ? { ...t, status } : t)));
  };

  const toggleFeatured = (id: string) => {
    setTestimonials((prev) =>
      prev.map((t) => (t._id === id ? { ...t, isFeatured: !t.isFeatured } : t)),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-gray-500">Manage patient testimonials and reviews</p>
        </div>
        <Button size="sm" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Testimonial
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold">{testimonials.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Approved</p>
            <p className="text-2xl font-bold text-green-600">
              {testimonials.filter((t) => t.status === "approved").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {testimonials.filter((t) => t.status === "pending").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Featured</p>
            <p className="text-2xl font-bold text-blue-600">
              {testimonials.filter((t) => t.isFeatured).length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search testimonials..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTestimonials.map((testimonial) => (
          <Card key={testimonial._id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white text-xs">
                      {testimonial.patientName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{testimonial.patientName}</p>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {testimonial.status === "pending" && (
                      <>
                        <DropdownMenuItem onClick={() => updateStatus(testimonial._id, "approved")}>
                          <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatus(testimonial._id, "rejected")}>
                          <XCircle className="mr-2 h-4 w-4 text-red-600" />
                          Reject
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem onClick={() => toggleFeatured(testimonial._id)}>
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      {testimonial.isFeatured ? "Unfeature" : "Feature on Homepage"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-sm text-gray-600 mt-3 line-clamp-3">{testimonial.testimonial}</p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex gap-1">
                  <Badge variant="secondary" className={statusColors[testimonial.status]}>
                    {testimonial.status}
                  </Badge>
                  {testimonial.treatment && (
                    <Badge variant="outline">{testimonial.treatment}</Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500">Featured</span>
                  <Switch
                    checked={testimonial.isFeatured}
                    onCheckedChange={() => toggleFeatured(testimonial._id)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Testimonial</DialogTitle>
            <DialogDescription>Add a new patient testimonial</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Patient Name</Label>
              <Input placeholder="Patient name" />
            </div>
            <div className="space-y-2">
              <Label>Rating</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map((r) => (
                    <SelectItem key={r} value={r.toString()}>
                      {"★".repeat(r)}
                      {"☆".repeat(5 - r)} ({r}/5)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Treatment</Label>
              <Input placeholder="e.g., Teeth Whitening" />
            </div>
            <div className="space-y-2">
              <Label>Testimonial</Label>
              <Textarea placeholder="Patient testimonial..." rows={4} />
            </div>
            <ImageDropzone
              folder="urja-dental/testimonials"
              label="Patient Photo"
              value={patientPhoto}
              onChange={setPatientPhoto}
              tags={["testimonial", "patient"]}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(false)}>Add Testimonial</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
