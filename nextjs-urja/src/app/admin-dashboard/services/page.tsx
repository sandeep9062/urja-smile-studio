"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  GripVertical,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockServices } from "@/lib/mock-data";
import type { Service } from "@/lib/types";

export default function ServicesPage() {
  const [services, setServices] = useState(mockServices);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const filteredServices = services.filter(
    (svc) =>
      svc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleServiceStatus = (id: string) => {
    setServices((prev) =>
      prev.map((svc) => (svc._id === id ? { ...svc, isActive: !svc.isActive } : svc)),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-500">Manage clinic services and treatments</p>
        </div>
        <Button size="sm" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search services..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Order</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>FAQs</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((svc) => (
                <TableRow key={svc._id}>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
                      <span className="text-sm text-gray-500">{svc.order}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{svc.name}</p>
                      <p className="text-xs text-gray-500">{svc.shortDescription}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{svc.category || "General"}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{svc.faqs.length} FAQs</TableCell>
                  <TableCell>
                    <Switch
                      checked={svc.isActive}
                      onCheckedChange={() => toggleServiceStatus(svc._id)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedService(svc);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ArrowUp className="mr-2 h-4 w-4" />
                          Move Up
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ArrowDown className="mr-2 h-4 w-4" />
                          Move Down
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Service Dialog */}
      <Dialog
        open={isCreateDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          setIsCreateDialogOpen(open);
          setIsEditDialogOpen(open);
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedService ? "Edit Service" : "Add New Service"}</DialogTitle>
            <DialogDescription>
              {selectedService ? "Update service details" : "Add a new service to the clinic"}
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="faq">FAQs</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Service Name</Label>
                  <Input placeholder="Service name" defaultValue={selectedService?.name} />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input placeholder="service-slug" defaultValue={selectedService?.slug} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input placeholder="Category" defaultValue={selectedService?.category} />
                </div>
                <div className="space-y-2">
                  <Label>Order</Label>
                  <Input type="number" placeholder="1" defaultValue={selectedService?.order} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Short Description</Label>
                <Textarea
                  placeholder="Brief description..."
                  defaultValue={selectedService?.shortDescription}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Icon</Label>
                  <Input type="file" accept="image/*" />
                </div>
                <div className="space-y-2">
                  <Label>Banner Image</Label>
                  <Input type="file" accept="image/*" />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="content" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Full Description</Label>
                <Textarea
                  placeholder="Detailed service description..."
                  rows={8}
                  defaultValue={selectedService?.description}
                />
              </div>
              <div className="space-y-2">
                <Label>Benefits (one per line)</Label>
                <Textarea
                  placeholder="Benefit 1&#10;Benefit 2&#10;Benefit 3"
                  rows={5}
                  defaultValue={selectedService?.benefits.join("\n")}
                />
              </div>
              <div className="space-y-2">
                <Label>Before/After Photos</Label>
                <Input type="file" accept="image/*" multiple />
              </div>
            </TabsContent>
            <TabsContent value="faq" className="space-y-4 mt-4">
              {selectedService?.faqs.map((faq, idx) => (
                <div key={idx} className="p-3 border rounded-lg space-y-2">
                  <Input placeholder="Question" defaultValue={faq.question} />
                  <Textarea placeholder="Answer" defaultValue={faq.answer} />
                </div>
              ))}
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add FAQ
              </Button>
            </TabsContent>
            <TabsContent value="seo" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input placeholder="SEO title" defaultValue={selectedService?.seo.metaTitle} />
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea
                  placeholder="SEO description"
                  defaultValue={selectedService?.seo.metaDescription}
                />
              </div>
              <div className="space-y-2">
                <Label>Keywords (comma separated)</Label>
                <Input
                  placeholder="keyword1, keyword2, keyword3"
                  defaultValue={selectedService?.seo.keywords.join(", ")}
                />
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setIsEditDialogOpen(false);
                setSelectedService(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setIsCreateDialogOpen(false);
                setIsEditDialogOpen(false);
                setSelectedService(null);
              }}
            >
              {selectedService ? "Update Service" : "Create Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
