"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Phone,
  Mail,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  FileText,
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
import { mockPatients, mockAppointments } from "@/lib/mock-data";
import type { Patient } from "@/lib/types";

export default function PatientsPage() {
  const [patients] = useState(mockPatients);
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = genderFilter === "all" || patient.gender === genderFilter;
    return matchesSearch && matchesGender;
  });

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const getPatientAppointments = (patientName: string) => {
    return mockAppointments.filter((apt) => apt.patientName === patientName);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-500">Manage patient records and history</p>
        </div>
        <Button size="sm" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Patient
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Total Patients</p>
            <p className="text-2xl font-bold">{patients.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Male</p>
            <p className="text-2xl font-bold text-blue-600">
              {patients.filter((p) => p.gender === "male").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Female</p>
            <p className="text-2xl font-bold text-pink-600">
              {patients.filter((p) => p.gender === "female").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">New This Month</p>
            <p className="text-2xl font-bold text-green-600">3</p>
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
                placeholder="Search by name, phone, or email..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
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
                <TableHead>Contact</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Appointments</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPatients.map((patient) => (
                <TableRow key={patient._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="text-xs">
                          {patient.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{patient.name}</p>
                        <p className="text-xs text-gray-500">DOB: {patient.dateOfBirth || "N/A"}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm flex items-center gap-1">
                        <Phone className="h-3 w-3 text-gray-400" />
                        {patient.phone}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Mail className="h-3 w-3 text-gray-400" />
                        {patient.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        patient.gender === "male"
                          ? "bg-blue-100 text-blue-700"
                          : patient.gender === "female"
                            ? "bg-pink-100 text-pink-700"
                            : "bg-gray-100 text-gray-700"
                      }
                    >
                      {patient.gender || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {getPatientAppointments(patient.name).length}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(patient.createdAt).toLocaleDateString()}
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
                            setSelectedPatient(patient);
                            setIsViewDialogOpen(true);
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
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

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredPatients.length)} of{" "}
                {filteredPatients.length} results
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

      {/* View Patient Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Patient Profile</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Info</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="space-y-4 mt-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg">
                      {selectedPatient.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedPatient.name}</h3>
                    <p className="text-sm text-gray-500">
                      Patient since {new Date(selectedPatient.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedPatient.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{selectedPatient.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium">{selectedPatient.dateOfBirth || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium capitalize">{selectedPatient.gender || "N/A"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{selectedPatient.address || "N/A"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Medical History</p>
                    <p className="font-medium">{selectedPatient.medicalHistory || "N/A"}</p>
                  </div>
                  {selectedPatient.allergies && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Allergies</p>
                      <Badge variant="destructive">{selectedPatient.allergies}</Badge>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="appointments" className="mt-4">
                <div className="space-y-3">
                  {getPatientAppointments(selectedPatient.name).length > 0 ? (
                    getPatientAppointments(selectedPatient.name).map((apt) => (
                      <div
                        key={apt._id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-sm">{apt.service}</p>
                          <p className="text-xs text-gray-500">
                            {apt.doctor} • {apt.date} at {apt.time}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={
                            apt.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : apt.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                          }
                        >
                          {apt.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No appointments found</p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="notes" className="mt-4">
                <div className="space-y-3">
                  {selectedPatient.notes && selectedPatient.notes.length > 0 ? (
                    selectedPatient.notes.map((note) => (
                      <div key={note._id} className="p-3 border rounded-lg">
                        <p className="text-sm">{note.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          By {note.createdBy} • {new Date(note.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No notes yet</p>
                  )}
                  <div className="space-y-2">
                    <Textarea placeholder="Add a note..." />
                    <Button size="sm">Add Note</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Patient Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
            <DialogDescription>Register a new patient in the system</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input placeholder="Patient name" />
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
                <Label>Date of Birth</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Textarea placeholder="Full address" />
            </div>
            <div className="space-y-2">
              <Label>Medical History</Label>
              <Textarea placeholder="Any known medical conditions..." />
            </div>
            <div className="space-y-2">
              <Label>Allergies</Label>
              <Input placeholder="Known allergies (if any)" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(false)}>Add Patient</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
