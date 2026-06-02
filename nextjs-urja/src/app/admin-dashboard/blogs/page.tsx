"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  BookOpen,
  Calendar,
  TrendingUp,
} from "lucide-react";
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
import { mockBlogs } from "@/lib/mock-data";
import type { BlogPost, BlogStatus } from "@/lib/types";

const statusColors: Record<BlogStatus, string> = {
  published: "bg-green-100 text-green-700",
  draft: "bg-gray-100 text-gray-700",
  scheduled: "bg-blue-100 text-blue-700",
};

export default function BlogsPage() {
  const [blogs] = useState(mockBlogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || blog.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: blogs.length,
    published: blogs.filter((b) => b.status === "published").length,
    drafts: blogs.filter((b) => b.status === "draft").length,
    totalViews: blogs.reduce((sum, b) => sum + b.views, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-500">Manage blog content and articles</p>
        </div>
        <Button size="sm" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Total Posts</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Published</p>
            <p className="text-2xl font-bold text-green-600">{stats.published}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Drafts</p>
            <p className="text-2xl font-bold text-gray-600">{stats.drafts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Total Views</p>
            <p className="text-2xl font-bold text-blue-600">{stats.totalViews.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search posts..."
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
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBlogs.map((blog) => (
                <TableRow key={blog._id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{blog.title}</p>
                      <p className="text-xs text-gray-500 truncate max-w-xs">{blog.excerpt}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{blog.category}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{blog.author}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={statusColors[blog.status]}>
                      {blog.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-gray-400" />
                      {blog.views.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {blog.publishDate
                      ? new Date(blog.publishDate).toLocaleDateString()
                      : new Date(blog.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        {blog.status === "draft" && (
                          <DropdownMenuItem>
                            <BookOpen className="mr-2 h-4 w-4" />
                            Publish
                          </DropdownMenuItem>
                        )}
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

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Blog Post</DialogTitle>
            <DialogDescription>Write and publish a new blog post</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>
            <TabsContent value="content" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input placeholder="Blog post title" />
              </div>
              <div className="space-y-2">
                <Label>Excerpt</Label>
                <Textarea placeholder="Brief summary..." rows={2} />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea placeholder="Write your blog post content here..." rows={12} />
              </div>
              <div className="space-y-2">
                <Label>Featured Image</Label>
                <Input type="file" accept="image/*" />
              </div>
            </TabsContent>
            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input placeholder="e.g., Oral Health" />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tags (comma separated)</Label>
                <Input placeholder="tag1, tag2, tag3" />
              </div>
              <div className="space-y-2">
                <Label>Publish Date</Label>
                <Input type="datetime-local" />
              </div>
            </TabsContent>
            <TabsContent value="seo" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input placeholder="SEO title" />
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea placeholder="SEO description" rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Keywords (comma separated)</Label>
                <Input placeholder="keyword1, keyword2" />
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Save as Draft
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(false)}>Publish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
