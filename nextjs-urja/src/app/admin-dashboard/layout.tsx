"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Stethoscope,
  Sparkles,
  Image,
  BookOpen,
  MessageSquareQuote,
  Star,
  Home,
  Mail,
  Search,
  Shield,
  UserCog,
  ArrowRightLeft,
  Settings,
  Activity,
  DatabaseBackup,
  ChevronLeft,
  ChevronRight,
  Bell,
  Moon,
  Sun,
  LogOut,
  User,
  Menu,
  X,
  ExternalLink,
  Images,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const navigation = [
  { name: "Dashboard", href: "/admin-dashboard", icon: LayoutDashboard },
  { name: "Appointments", href: "/admin-dashboard/appointments", icon: Calendar },
  { name: "Patients", href: "/admin-dashboard/patients", icon: Users },
  { name: "Doctors", href: "/admin-dashboard/doctors", icon: Stethoscope },
  { name: "Services", href: "/admin-dashboard/services", icon: Sparkles },
  { name: "Smile Gallery", href: "/admin-dashboard/gallery", icon: Image },
  { name: "Media Library", href: "/admin-dashboard/media-library", icon: Images },
  { name: "Blogs", href: "/admin-dashboard/blogs", icon: BookOpen },
  { name: "Testimonials", href: "/admin-dashboard/testimonials", icon: MessageSquareQuote },
  { name: "Reviews", href: "/admin-dashboard/reviews", icon: Star },
  { name: "Homepage Manager", href: "/admin-dashboard/homepage", icon: Home },
  { name: "Enquiries", href: "/admin-dashboard/enquiries", icon: Mail },
  { name: "SEO Manager", href: "/admin-dashboard/seo", icon: Search },
  { name: "Users & Roles", href: "/admin-dashboard/users", icon: UserCog },
  { name: "Redirects", href: "/admin-dashboard/redirects", icon: ArrowRightLeft },
  { name: "Settings", href: "/admin-dashboard/settings", icon: Settings },
  { name: "Activity Logs", href: "/admin-dashboard/logs", icon: Activity },
  { name: "Backup Manager", href: "/admin-dashboard/backups", icon: DatabaseBackup },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={cn("min-h-screen bg-gray-50", darkMode && "dark bg-gray-900")}>
      <TooltipProvider>
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-200 transition-all duration-300 dark:bg-gray-800 dark:border-gray-700",
            collapsed ? "w-16" : "w-64",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          )}
        >
          {/* Logo */}
          <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <Link href="/admin-dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              {!collapsed && (
                <span className="font-semibold text-gray-900 dark:text-white">Urja Admin</span>
              )}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto hidden lg:flex"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="h-[calc(100vh-4rem)] px-2 py-4">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                const linkContent = (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white",
                      collapsed && "justify-center px-2",
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                );

                if (collapsed) {
                  return (
                    <Tooltip key={item.name} delayDuration={0}>
                      <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                      <TooltipContent side="right">{item.name}</TooltipContent>
                    </Tooltip>
                  );
                }

                return linkContent;
              })}
            </nav>

            {/* Back to Website */}
            <div className="px-2 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/"
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white",
                  collapsed && "justify-center px-2",
                )}
              >
                <ExternalLink className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>Back to Website</span>}
              </Link>
            </div>
          </ScrollArea>
        </aside>

        {/* Main content */}
        <div className={cn("transition-all duration-300", collapsed ? "lg:ml-16" : "lg:ml-64")}>
          {/* Top Header */}
          <header className="sticky top-0 z-30 flex items-center h-16 px-4 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden mr-2"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search..."
                  className="w-full h-9 pl-9 pr-4 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {/* Dark mode toggle */}
              <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="space-y-2 p-2">
                    <div className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <p className="text-sm font-medium">New appointment booking</p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                    <div className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <p className="text-sm font-medium">New enquiry received</p>
                      <p className="text-xs text-gray-500">15 minutes ago</p>
                    </div>
                    <div className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <p className="text-sm font-medium">Blog post published</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <Separator orientation="vertical" className="h-6" />

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/admin-avatar.jpg" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium">Admin</p>
                      <p className="text-xs text-gray-500">Owner</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page content */}
          <main className="p-4 md:p-6">{children}</main>
        </div>
      </TooltipProvider>
    </div>
  );
}
