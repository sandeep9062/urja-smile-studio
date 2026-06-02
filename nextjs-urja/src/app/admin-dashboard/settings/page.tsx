"use client";

import { useState } from "react";
import { Save, Phone, Mail, MapPin, Clock, Globe, Link } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function SettingsPage() {
  const [clinicName, setClinicName] = useState("Urja Dental Clinic");
  const [phones, setPhones] = useState(["+91 98765 43210", "+91 22 1234 5678"]);
  const [emails, setEmails] = useState(["info@urjadental.com", "appointments@urjadental.com"]);
  const [address, setAddress] = useState("123 Healthcare Avenue, Andheri West, Mumbai - 400053");
  const [googleMap, setGoogleMap] = useState(
    "https://maps.google.com/?q=Urja+Dental+Clinic+Mumbai",
  );
  const [timings, setTimings] = useState(
    days.map((day) => ({
      day,
      openTime: day === "Sunday" ? "" : "09:00",
      closeTime: day === "Sunday" ? "" : day === "Saturday" ? "13:00" : "18:00",
      isClosed: day === "Sunday",
    })),
  );
  const [social, setSocial] = useState({
    facebook: "https://facebook.com/urjadental",
    instagram: "https://instagram.com/urjadental",
    twitter: "",
    youtube: "https://youtube.com/@urjadental",
    linkedin: "",
    whatsapp: "+919876543210",
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Manage clinic information and preferences</p>
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="timings">Timings</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Clinic Information</CardTitle>
              <CardDescription>Basic clinic details displayed on the website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Clinic Name</Label>
                <Input value={clinicName} onChange={(e) => setClinicName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Phone Numbers
                </Label>
                {phones.map((phone, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={phone}
                      onChange={(e) => {
                        const updated = [...phones];
                        updated[idx] = e.target.value;
                        setPhones(updated);
                      }}
                    />
                    {phones.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setPhones(phones.filter((_, i) => i !== idx))}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => setPhones([...phones, ""])}>
                  + Add Phone
                </Button>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email Addresses
                </Label>
                {emails.map((email, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={email}
                      onChange={(e) => {
                        const updated = [...emails];
                        updated[idx] = e.target.value;
                        setEmails(updated);
                      }}
                    />
                    {emails.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEmails(emails.filter((_, i) => i !== idx))}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => setEmails([...emails, ""])}>
                  + Add Email
                </Button>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Address
                </Label>
                <Textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Globe className="h-4 w-4" /> Google Map Link
                </Label>
                <Input value={googleMap} onChange={(e) => setGoogleMap(e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timings" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Clinic Timings
              </CardTitle>
              <CardDescription>Set operating hours for each day</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {timings.map((timing, idx) => (
                <div
                  key={timing.day}
                  className={`flex items-center gap-4 p-3 rounded-lg border ${timing.isClosed ? "bg-gray-50" : ""}`}
                >
                  <span className="font-medium text-sm w-24">{timing.day}</span>
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      type="time"
                      value={timing.openTime}
                      disabled={timing.isClosed}
                      onChange={(e) => {
                        const updated = [...timings];
                        updated[idx] = { ...updated[idx], openTime: e.target.value };
                        setTimings(updated);
                      }}
                      className="w-32"
                    />
                    <span className="text-gray-400">to</span>
                    <Input
                      type="time"
                      value={timing.closeTime}
                      disabled={timing.isClosed}
                      onChange={(e) => {
                        const updated = [...timings];
                        updated[idx] = { ...updated[idx], closeTime: e.target.value };
                        setTimings(updated);
                      }}
                      className="w-32"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Closed</span>
                    <Switch
                      checked={timing.isClosed}
                      onCheckedChange={(v) => {
                        const updated = [...timings];
                        updated[idx] = {
                          ...updated[idx],
                          isClosed: v,
                          openTime: v ? "" : "09:00",
                          closeTime: v ? "" : "18:00",
                        };
                        setTimings(updated);
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Link className="h-5 w-5" />
                Social Media Links
              </CardTitle>
              <CardDescription>Connect your social media profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(social).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label className="capitalize">{key}</Label>
                  <Input
                    value={value}
                    placeholder={`https://${key}.com/urjadental`}
                    onChange={(e) => setSocial({ ...social, [key]: e.target.value })}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notification Settings</CardTitle>
              <CardDescription>Configure email and SMS notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Appointment Confirmations", desc: "Send confirmation on booking" },
                { label: "Appointment Reminders", desc: "Send reminder 24 hours before" },
                {
                  label: "Status Change Notifications",
                  desc: "Notify on appointment status change",
                },
                { label: "New Enquiry Alerts", desc: "Email alert for new enquiries" },
                { label: "SMS Notifications", desc: "Send SMS for appointment updates" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
