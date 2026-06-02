"use client";

import {
  Calendar,
  Users,
  BookOpen,
  Mail,
  Eye,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

// Mock data - will be replaced with real API data
const stats = [
  {
    title: "Total Appointments",
    value: "1,234",
    change: "+12.5%",
    trend: "up",
    icon: Calendar,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Today's Appointments",
    value: "18",
    change: "+3",
    trend: "up",
    icon: Clock,
    color: "text-teal-600",
    bgColor: "bg-teal-50",
  },
  {
    title: "Active Patients",
    value: "856",
    change: "+5.2%",
    trend: "up",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Blog Posts",
    value: "42",
    change: "+2",
    trend: "up",
    icon: BookOpen,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    title: "Enquiries",
    value: "28",
    change: "-3",
    trend: "down",
    icon: Mail,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
  },
  {
    title: "Website Visitors",
    value: "12.5K",
    change: "+18.2%",
    trend: "up",
    icon: Eye,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
];

const monthlyAppointments = [
  { month: "Jan", appointments: 65 },
  { month: "Feb", appointments: 78 },
  { month: "Mar", appointments: 90 },
  { month: "Apr", appointments: 81 },
  { month: "May", appointments: 95 },
  { month: "Jun", appointments: 110 },
  { month: "Jul", appointments: 125 },
  { month: "Aug", appointments: 118 },
  { month: "Sep", appointments: 105 },
  { month: "Oct", appointments: 130 },
  { month: "Nov", appointments: 142 },
  { month: "Dec", appointments: 138 },
];

const serviceData = [
  { name: "Teeth Whitening", value: 35, color: "#0d9488" },
  { name: "Dental Implants", value: 25, color: "#3b82f6" },
  { name: "Root Canal", value: 20, color: "#8b5cf6" },
  { name: "Braces", value: 12, color: "#f59e0b" },
  { name: "Others", value: 8, color: "#6b7280" },
];

const trafficData = [
  { day: "Mon", visitors: 420 },
  { day: "Tue", visitors: 380 },
  { day: "Wed", visitors: 510 },
  { day: "Thu", visitors: 460 },
  { day: "Fri", visitors: 580 },
  { day: "Sat", visitors: 720 },
  { day: "Sun", visitors: 340 },
];

const appointmentTrends = [
  { month: "Jan", confirmed: 45, completed: 40, cancelled: 5 },
  { month: "Feb", confirmed: 55, completed: 50, cancelled: 8 },
  { month: "Mar", confirmed: 65, completed: 58, cancelled: 7 },
  { month: "Apr", confirmed: 60, completed: 55, cancelled: 10 },
  { month: "May", confirmed: 75, completed: 68, cancelled: 6 },
  { month: "Jun", confirmed: 85, completed: 78, cancelled: 9 },
];

const recentActivities = [
  {
    id: 1,
    type: "appointment",
    title: "New appointment booking",
    description: "Rahul Sharma booked Teeth Whitening",
    time: "2 minutes ago",
    icon: Calendar,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: 2,
    type: "enquiry",
    title: "New enquiry received",
    description: "Priya Patel enquired about Dental Implants",
    time: "15 minutes ago",
    icon: Mail,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
  },
  {
    id: 3,
    type: "blog",
    title: "Blog post published",
    description: '"5 Tips for Better Oral Health" is now live',
    time: "1 hour ago",
    icon: BookOpen,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    id: 4,
    type: "gallery",
    title: "Gallery updated",
    description: "12 new before/after photos added",
    time: "2 hours ago",
    icon: TrendingUp,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    id: 5,
    type: "appointment",
    title: "Appointment completed",
    description: "Amit Kumar's Root Canal treatment completed",
    time: "3 hours ago",
    icon: CheckCircle2,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    id: 6,
    type: "appointment",
    title: "Appointment cancelled",
    description: "Neha Singh cancelled her appointment",
    time: "4 hours ago",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
];

const upcomingAppointments = [
  {
    id: 1,
    patient: "Rahul Sharma",
    service: "Teeth Whitening",
    doctor: "Dr. Mehta",
    time: "10:00 AM",
    status: "confirmed",
  },
  {
    id: 2,
    patient: "Priya Patel",
    service: "Dental Implant",
    doctor: "Dr. Sharma",
    time: "11:30 AM",
    status: "pending",
  },
  {
    id: 3,
    patient: "Amit Kumar",
    service: "Root Canal",
    doctor: "Dr. Mehta",
    time: "2:00 PM",
    status: "confirmed",
  },
  {
    id: 4,
    patient: "Sneha Reddy",
    service: "Braces Consultation",
    doctor: "Dr. Gupta",
    time: "3:30 PM",
    status: "pending",
  },
  {
    id: 5,
    patient: "Vikram Joshi",
    service: "Cleaning",
    doctor: "Dr. Sharma",
    time: "5:00 PM",
    status: "confirmed",
  },
];

const statusColors: Record<string, string> = {
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Last 30 days
          </Button>
          <Button size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Appointment
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <span
                    className={`text-xs font-medium flex items-center gap-0.5 ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.title}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Appointments Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Appointments</CardTitle>
            <CardDescription>Appointment trends over the past year</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyAppointments}>
                <defs>
                  <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="appointments"
                  stroke="#0d9488"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAppointments)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Most Booked Services */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Most Booked Services</CardTitle>
            <CardDescription>Service distribution this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={250}>
                <PieChart>
                  <Pie
                    data={serviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {serviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {serviceData.map((service) => (
                  <div key={service.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: service.color }}
                      />
                      <span className="text-sm text-gray-600">{service.name}</span>
                    </div>
                    <span className="text-sm font-medium">{service.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Traffic Overview</CardTitle>
            <CardDescription>Website visitors this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="visitors" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Appointment Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Appointment Trends</CardTitle>
            <CardDescription>Confirmed vs Completed vs Cancelled</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={appointmentTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="confirmed"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="cancelled"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <CardDescription>Latest actions and updates</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${activity.bgColor}`}>
                      <Icon className={`h-4 w-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500 truncate">{activity.description}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
                <CardDescription>Today's scheduled appointments</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-xs">
                        {apt.patient
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{apt.patient}</p>
                      <p className="text-xs text-gray-500">
                        {apt.service} • {apt.doctor}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{apt.time}</p>
                    <Badge
                      variant="secondary"
                      className={`text-xs mt-1 ${statusColors[apt.status]}`}
                    >
                      {apt.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
