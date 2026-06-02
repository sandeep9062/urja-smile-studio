"use client";

import { useState } from "react";
import { Search, Plus, Edit, Trash2, ArrowRightLeft, ExternalLink } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockRedirects } from "@/lib/mock-data";
import type { Redirect } from "@/lib/types";

export default function RedirectsPage() {
  const [redirects, setRedirects] = useState(mockRedirects);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredRedirects = redirects.filter(
    (r) =>
      r.oldUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.newUrl.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleRedirectStatus = (id: string) => {
    setRedirects((prev) => prev.map((r) => (r._id === id ? { ...r, isActive: !r.isActive } : r)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Redirect Manager</h1>
          <p className="text-gray-500">Manage URL redirects (301/302)</p>
        </div>
        <Button size="sm" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Redirect
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search redirects..."
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
                <TableHead>Old URL</TableHead>
                <TableHead>New URL</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Hits</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRedirects.map((redirect) => (
                <TableRow key={redirect._id}>
                  <TableCell className="font-mono text-sm text-red-600">
                    {redirect.oldUrl}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <ArrowRightLeft className="h-3 w-3 text-gray-400" />
                      <span className="font-mono text-sm text-green-600">{redirect.newUrl}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{redirect.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{redirect.hits}</TableCell>
                  <TableCell>
                    <Switch
                      checked={redirect.isActive}
                      onCheckedChange={() => toggleRedirectStatus(redirect._id)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          setRedirects((prev) => prev.filter((r) => r._id !== redirect._id))
                        }
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Redirect</DialogTitle>
            <DialogDescription>Create a new URL redirect</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Old URL</Label>
              <Input placeholder="/old-page-url" />
            </div>
            <div className="space-y-2">
              <Label>New URL</Label>
              <Input placeholder="/new-page-url" />
            </div>
            <div className="space-y-2">
              <Label>Redirect Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="301">301 (Permanent)</SelectItem>
                  <SelectItem value="302">302 (Temporary)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(false)}>Add Redirect</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
