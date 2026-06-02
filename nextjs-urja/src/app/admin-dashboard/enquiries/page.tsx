"use client";

import { useState } from "react";
import {
  Search,
  MoreHorizontal,
  Eye,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockEnquiries } from "@/lib/mock-data";
import type { Enquiry, EnquiryStatus } from "@/lib/types";

const statusColors: Record<EnquiryStatus, string> = {
  new: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  closed: "bg-gray-100 text-gray-700",
};

export default function EnquiriesPage() {
  const [enquiries] = useState(mockEnquiries);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  const filteredEnquiries = enquiries.filter((enq) => {
    const matchesSearch =
      enq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enq.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enq.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || enq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: enquiries.length,
    new: enquiries.filter((e) => e.status === "new").length,
    inProgress: enquiries.filter((e) => e.status === "in_progress").length,
    closed: enquiries.filter((e) => e.status === "closed").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Enquiries</h1>
        <p className="text-gray-500">Manage incoming enquiries and conversations</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">New</p>
            <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">In Progress</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Closed</p>
            <p className="text-2xl font-bold text-gray-600">{stats.closed}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search enquiries..."
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
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-2">
          {filteredEnquiries.map((enq) => (
            <Card
              key={enq._id}
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                selectedEnquiry?._id === enq._id ? "ring-2 ring-teal-500" : ""
              }`}
              onClick={() => setSelectedEnquiry(enq)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {enq.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{enq.name}</p>
                      <p className="text-xs text-gray-500">{enq.subject}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className={`text-xs ${statusColors[enq.status]}`}>
                    {enq.status === "in_progress" ? "In Progress" : enq.status}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{enq.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(enq.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-2">
          {selectedEnquiry ? (
            <Card className="h-full">
              <Card className="border-0">
                <CardContent className="p-6">
                  <Tabs defaultValue="conversation" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="conversation">Conversation</TabsTrigger>
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="notes">Internal Notes</TabsTrigger>
                    </TabsList>
                    <TabsContent value="conversation" className="mt-4 space-y-4">
                      <div className="space-y-3">
                        {selectedEnquiry.conversationHistory.map((msg) => (
                          <div
                            key={msg._id}
                            className={`p-3 rounded-lg ${
                              msg.type === "internal"
                                ? "bg-yellow-50 border border-yellow-200"
                                : "bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium">{msg.sentBy}</span>
                              <span className="text-xs text-gray-400">
                                {new Date(msg.sentAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm">{msg.content}</p>
                            <Badge variant="outline" className="text-xs mt-1">
                              {msg.type}
                            </Badge>
                          </div>
                        ))}
                        {selectedEnquiry.conversationHistory.length === 0 && (
                          <p className="text-sm text-gray-500 text-center py-4">
                            No conversation history
                          </p>
                        )}
                      </div>
                      <div className="space-y-2 pt-4 border-t">
                        <Label>Reply</Label>
                        <Textarea placeholder="Type your reply..." rows={3} />
                        <div className="flex gap-2">
                          <Button size="sm">
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </Button>
                          <Button size="sm" variant="outline">
                            <Phone className="mr-2 h-4 w-4" />
                            Send SMS
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="details" className="mt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="font-medium">{selectedEnquiry.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{selectedEnquiry.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{selectedEnquiry.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Subject</p>
                          <p className="font-medium">{selectedEnquiry.subject}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <Badge className={statusColors[selectedEnquiry.status]}>
                            {selectedEnquiry.status}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Assigned To</p>
                          <p className="font-medium">
                            {selectedEnquiry.assignedTo || "Unassigned"}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Message</p>
                        <p className="text-sm mt-1">{selectedEnquiry.message}</p>
                      </div>
                    </TabsContent>
                    <TabsContent value="notes" className="mt-4 space-y-4">
                      <div className="space-y-3">
                        {selectedEnquiry.internalNotes.map((note) => (
                          <div key={note._id} className="p-3 border rounded-lg">
                            <p className="text-sm">{note.content}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              By {note.createdBy} • {new Date(note.createdAt).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2 pt-4 border-t">
                        <Textarea placeholder="Add internal note..." rows={2} />
                        <Button size="sm">Add Note</Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Select an enquiry to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
