"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Star,
  Clock,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockDoctors } from "@/lib/mock-data";
import type { Doctor } from "@/lib/types";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState(mockDoctors);
  const [searchQuery, setSearchQuery] = useState("");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specializations.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const toggleDoctorStatus = (id: string) => {
    setDoctors((prev) =>
      prev.map((doc) => (doc._id === id ? { ...doc, isActive: !doc.isActive } : doc)),
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctors</h1>
          <p className="text-gray-500">Manage doctor profiles and schedules</p>
        </div>
        <Button size="sm" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Doctor
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or specialization..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor._id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback className="text-lg bg-gradient-to-br from-teal-500 to-blue-600 text-white">
                      {doctor.name
                        .replace("Dr. ", "")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                    <p className="text-sm text-gray-500">{doctor.qualification}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedDoctor(doctor);
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
              </div>

              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Stethoscope className="h-4 w-4 text-teal-600" />
                  <span className="text-sm font-medium">Specializations</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {doctor.specializations.map((spec) => (
                    <Badge key={spec} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>{doctor.experience} years exp</span>
                </div>
                <div className="font-medium">₹{doctor.consultationFees}</div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${doctor.isActive ? "bg-green-500" : "bg-gray-300"}`}
                  />
                  <span className="text-sm text-gray-500">
                    {doctor.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <Switch
                  checked={doctor.isActive}
                  onCheckedChange={() => toggleDoctorStatus(doctor._id)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Doctor Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Doctor Profile</DialogTitle>
          </DialogHeader>
          {selectedDoctor && (
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Info</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="bio">Bio</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="space-y-4 mt-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg bg-gradient-to-br from-teal-500 to-blue-600 text-white">
                      {selectedDoctor.name
                        .replace("Dr. ", "")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedDoctor.name}</h3>
                    <p className="text-sm text-gray-500">{selectedDoctor.qualification}</p>
                    <p className="text-sm text-teal-600">
                      {selectedDoctor.experience} years experience
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Consultation Fees</p>
                    <p className="font-medium">₹{selectedDoctor.consultationFees}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <Badge
                      className={
                        selectedDoctor.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }
                    >
                      {selectedDoctor.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Specializations</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedDoctor.specializations.map((spec) => (
                        <Badge key={spec} variant="secondary">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="schedule" className="mt-4">
                <div className="space-y-2">
                  {selectedDoctor.schedule.map((s) => (
                    <div
                      key={s.day}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        !s.isAvailable ? "bg-gray-50 opacity-50" : ""
                      }`}
                    >
                      <span className="font-medium text-sm w-24">{s.day}</span>
                      {s.isAvailable ? (
                        <span className="text-sm text-gray-600">
                          {s.startTime} - {s.endTime}
                        </span>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          Day Off
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="bio" className="mt-4">
                <p className="text-sm text-gray-700 leading-relaxed">{selectedDoctor.bio}</p>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Doctor Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Doctor</DialogTitle>
            <DialogDescription>Add a new doctor to the clinic</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input placeholder="Dr. Full Name" />
            </div>
            <div className="space-y-2">
              <Label>Qualification</Label>
              <Input placeholder="BDS, MDS (Specialization)" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Experience (years)</Label>
                <Input type="number" placeholder="10" />
              </div>
              <div className="space-y-2">
                <Label>Consultation Fees (₹)</Label>
                <Input type="number" placeholder="1000" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Specializations</Label>
              <Input placeholder="Comma separated: Implants, Braces, etc." />
            </div>
            <div className="space-y-2">
              <Label>Short Bio</Label>
              <Textarea placeholder="Brief biography..." rows={4} />
            </div>
            <div className="space-y-2">
              <Label>Profile Photo</Label>
              <Input type="file" accept="image/*" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(false)}>Add Doctor</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
