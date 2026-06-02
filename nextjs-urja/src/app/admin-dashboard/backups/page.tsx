"use client";

import { useState } from "react";
import {
  DatabaseBackup,
  Download,
  RotateCcw,
  Plus,
  HardDrive,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mockBackups } from "@/lib/mock-data";
import type { Backup } from "@/lib/types";

const statusConfig: Record<string, { color: string; icon: React.ElementType }> = {
  completed: { color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  failed: { color: "bg-red-100 text-red-700", icon: AlertCircle },
  in_progress: { color: "bg-blue-100 text-blue-700", icon: Loader2 },
};

export default function BackupsPage() {
  const [backups, setBackups] = useState(mockBackups);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const createBackup = () => {
    setIsCreating(true);
    setTimeout(() => {
      const newBackup: Backup = {
        _id: `bak_${Date.now()}`,
        type: "manual",
        status: "completed",
        databaseSize: "45.5 MB",
        mediaSize: "2.3 GB",
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      };
      setBackups((prev) => [newBackup, ...prev]);
      setIsCreating(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Backup Manager</h1>
          <p className="text-gray-500">Manage database and media backups</p>
        </div>
        <Button size="sm" onClick={createBackup} disabled={isCreating}>
          {isCreating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          {isCreating ? "Creating Backup..." : "Create Backup"}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DatabaseBackup className="h-5 w-5 text-teal-600" />
              <p className="text-sm text-gray-500">Total Backups</p>
            </div>
            <p className="text-2xl font-bold mt-1">{backups.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-gray-500">Latest DB Size</p>
            </div>
            <p className="text-2xl font-bold mt-1">{backups[0]?.databaseSize || "N/A"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <p className="text-sm text-gray-500">Last Backup</p>
            </div>
            <p className="text-lg font-bold mt-1">
              {backups[0] ? new Date(backups[0].createdAt).toLocaleDateString() : "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Backup History</CardTitle>
          <CardDescription>Automatic daily backups at 2:00 AM IST</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {backups.map((backup) => {
              const status = statusConfig[backup.status];
              const StatusIcon = status.icon;
              return (
                <div
                  key={backup._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${status.color}`}>
                      <StatusIcon
                        className={`h-4 w-4 ${backup.status === "in_progress" ? "animate-spin" : ""}`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">
                          {backup.type === "automatic" ? "Auto Backup" : "Manual Backup"}
                        </p>
                        <Badge variant="secondary" className={`text-xs ${status.color}`}>
                          {backup.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(backup.createdAt).toLocaleString()} • DB: {backup.databaseSize} •
                        Media: {backup.mediaSize}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setSelectedBackup(backup);
                        setIsRestoreDialogOpen(true);
                      }}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore Backup</DialogTitle>
            <DialogDescription>
              Are you sure you want to restore this backup? This will overwrite all current data.
            </DialogDescription>
          </DialogHeader>
          {selectedBackup && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> This action cannot be undone. All current data will be
                replaced with data from {new Date(selectedBackup.createdAt).toLocaleString()}.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRestoreDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => setIsRestoreDialogOpen(false)}>
              Restore Backup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
