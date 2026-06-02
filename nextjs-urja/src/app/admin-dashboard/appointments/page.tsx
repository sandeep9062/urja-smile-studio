"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockAppointments, mockDoctors, mockServices } from "@/lib/mock-data";
import type { Appointment, AppointmentStatus } from "@/lib/types";

const statusConfig: Record<
  AppointmentStatus,
  { label: string; color: string; icon: React.ElementType }
> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700", icon: AlertCircle },
  confirmed: { label: "Confirmed", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  completed: { label: "Completed", color: "bg-blue-100 text-blue-700", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700", icon: XCircle },
  rescheduled: { label: "Rescheduled", color: "bg-purple-100 text-purple-700", icon: Clock },
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientPhone.includes(searchQuery) ||
      apt.patientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleStatusChange = (id: string, newStatus: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt._id === id ? { ...apt, status: newStatus } : apt)),
    );
  };

  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === "pending").length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    today: appointments.filter((a) => a.date === "2026-02-06").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-500">Manage and track all appointments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Today</p>
            <p className="text-2xl font-bold text-teal-600">{stats.today}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Confirmed</p>
            <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, phone, email, or service..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="rescheduled">Rescheduled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAppointments.map((apt) => {
                const status = statusConfig[apt.status];
                const StatusIcon = status.icon;
                return (
                  <TableRow key={apt._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="text-xs">
                            {apt.patientName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{apt.patientName}</p>
                          <p className="text-xs text-gray-500">{apt.patientPhone}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{apt.service}</TableCell>
                    <TableCell className="text-sm">{apt.doctor}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        <span>{apt.date}</span>
                        <Clock className="h-3.5 w-3.5 text-gray-400 ml-2" />
                        <span>{apt.time}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={status.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedAppointment(apt);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {apt.status === "pending" && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(apt._id, "confirmed")}
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Confirm
                            </DropdownMenuItem>
                          )}
                          {apt.status === "confirmed" && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(apt._id, "completed")}
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Mark Complete
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(apt._id, "rescheduled")}
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            Reschedule
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleStatusChange(apt._id, "cancelled")}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredAppointments.length)} of{" "}
                {filteredAppointments.length} results
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Appointment Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Appointment</DialogTitle>
            <DialogDescription>Schedule a new appointment for a patient</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Patient Name</Label>
                <Input placeholder="Full name" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input placeholder="+91 XXXXX XXXXX" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="patient@email.com" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Service</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockServices.map((svc) => (
                      <SelectItem key={svc._id} value={svc._id}>
                        {svc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Doctor</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockDoctors.map((doc) => (
                      <SelectItem key={doc._id} value={doc._id}>
                        {doc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
                <Input type="time" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea placeholder="Any additional notes..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(false)}>Create Appointment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Appointment Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {selectedAppointment.patientName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{selectedAppointment.patientName}</p>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {selectedAppointment.patientPhone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {selectedAppointment.patientEmail}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Service</p>
                  <p className="font-medium">{selectedAppointment.service}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Doctor</p>
                  <p className="font-medium">{selectedAppointment.doctor}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{selectedAppointment.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">{selectedAppointment.time}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge
                    variant="secondary"
                    className={statusConfig[selectedAppointment.status].color}
                  >
                    {statusConfig[selectedAppointment.status].label}
                  </Badge>
                </div>
              </div>
              {selectedAppointment.notes && (
                <div>
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="text-sm">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
